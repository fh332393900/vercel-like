import { type NextRequest, NextResponse } from "next/server"

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const GITHUB_REDIRECT_URI =
  process.env.GITHUB_REDIRECT_URI ||
  `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/github/callback`

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  // Handle OAuth errors
  if (error) {
    console.error("GitHub OAuth error:", error)
    return NextResponse.redirect(new URL(`/login?error=${error}`, request.url))
  }

  if (!code) {
    // Generate state parameter for security
    const state = crypto.randomUUID()

    // Store state in cookie for verification
    const response = NextResponse.redirect(
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}&scope=user:email&state=${state}`,
    )

    response.cookies.set("github_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    })

    return response
  }

  // Verify state parameter
  const storedState = request.cookies.get("github_oauth_state")?.value
  const receivedState = searchParams.get("state")

  if (!storedState || storedState !== receivedState) {
    console.error("GitHub OAuth state mismatch")
    return NextResponse.redirect(new URL("/login?error=state_mismatch", request.url))
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://api.github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "DeployHub-App",
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: GITHUB_REDIRECT_URI,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      console.error("GitHub token error:", tokenData.error_description)
      throw new Error(tokenData.error_description || tokenData.error)
    }

    if (!tokenData.access_token) {
      throw new Error("No access token received from GitHub")
    }

    // Get user info from GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "DeployHub-App",
      },
    })

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user data from GitHub")
    }

    const githubUser = await userResponse.json()

    // Get user email if not public
    let email = githubUser.email
    if (!email) {
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "DeployHub-App",
        },
      })

      if (emailResponse.ok) {
        const emails = await emailResponse.json()
        const primaryEmail = emails.find((e: any) => e.primary && e.verified)
        email = primaryEmail?.email
      }
    }

    if (!email) {
      console.error("No email found for GitHub user:", githubUser.login)
      return NextResponse.redirect(new URL("/login?error=github_email_required", request.url))
    }

    // Store GitHub user data in session/cookie for callback processing
    const response = NextResponse.redirect(new URL("/api/auth/github/callback", request.url))

    // Clear state cookie
    response.cookies.delete("github_oauth_state")

    // Set user data cookie
    response.cookies.set(
      "github_user",
      JSON.stringify({
        id: githubUser.id.toString(),
        email,
        name: githubUser.name || githubUser.login,
        avatar_url: githubUser.avatar_url,
        login: githubUser.login,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 300, // 5 minutes
        path: "/",
      },
    )

    return response
  } catch (error: any) {
    console.error("GitHub OAuth error:", error)
    return NextResponse.redirect(new URL("/login?error=github_auth_failed", request.url))
  }
}
