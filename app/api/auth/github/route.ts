import { type NextRequest, NextResponse } from "next/server"

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || "http://localhost:3000/api/auth/github/callback"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    // Redirect to GitHub OAuth
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}&scope=user:email`
    return NextResponse.redirect(githubAuthUrl)
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
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
      throw new Error(tokenData.error_description)
    }

    // Get user info from GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    const githubUser = await userResponse.json()

    // Get user email if not public
    let email = githubUser.email
    if (!email) {
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/vnd.github.v3+json",
        },
      })

      const emails = await emailResponse.json()
      const primaryEmail = emails.find((e: any) => e.primary)
      email = primaryEmail?.email
    }

    if (!email) {
      throw new Error("Unable to get email from GitHub")
    }

    // Store GitHub user data in session/cookie for callback processing
    const response = NextResponse.redirect(new URL("/api/auth/github/callback", request.url))
    response.cookies.set(
      "github_user",
      JSON.stringify({
        id: githubUser.id.toString(),
        email,
        name: githubUser.name || githubUser.login,
        avatar_url: githubUser.avatar_url,
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
