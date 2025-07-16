import { NextResponse } from "next/server"
import { loginWithGithub, createUserSession } from "@/lib/auth"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const tokenData = await tokenResponse.json()
    console.log("GitHub token response:", tokenData)

    if (tokenData.error) {
      console.error("GitHub token error:", tokenData.error_description)
      return NextResponse.redirect(new URL("/login?error=github_token_error", request.url))
    }

    const accessToken = tokenData.access_token

    // Fetch user data from GitHub
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    })
    const githubUserData = await githubUserResponse.json()
    console.log("GitHub user data:", githubUserData)

    if (githubUserData.message === "Bad credentials" || !githubUserData.id) {
      console.error("Failed to fetch GitHub user data:", githubUserData.message)
      return NextResponse.redirect(new URL("/login?error=github_user_fetch_failed", request.url))
    }

    // Login or create user in your database
    const user = await loginWithGithub({
      id: githubUserData.id.toString(),
      email: githubUserData.email || `${githubUserData.login}@github.com`, // Fallback email
      name: githubUserData.name || githubUserData.login,
      avatar_url: githubUserData.avatar_url,
      login: githubUserData.login,
    })
    console.log("User login/creation successful:", user.id)

    // Create session for the user
    await createUserSession({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
    })
    console.log("User session created successfully.")

    // Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("GitHub login error:", error)
    return NextResponse.redirect(new URL("/login?error=github_login_failed", request.url))
  }
}
