import { type NextRequest, NextResponse } from "next/server"
import { loginWithGithub, createUserSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    console.log("GitHub callback started")

    const githubUserCookie = request.cookies.get("github_user")?.value
    console.log("GitHub user cookie:", githubUserCookie ? "exists" : "missing")

    if (!githubUserCookie) {
      console.error("No GitHub user data found in callback")
      throw new Error("No GitHub user data found")
    }

    const githubUser = JSON.parse(githubUserCookie)
    console.log("Parsed GitHub user:", { id: githubUser.id, email: githubUser.email, name: githubUser.name })

    // Validate required fields
    if (!githubUser.id || !githubUser.email || !githubUser.name) {
      console.error("Invalid GitHub user data:", githubUser)
      throw new Error("Invalid GitHub user data")
    }

    // Login or create user with GitHub data
    console.log("Attempting to login/create user with GitHub data")
    const user = await loginWithGithub(githubUser)
    console.log("User login/creation successful:", { id: user.id, email: user.email })

    // Create session
    console.log("Creating user session")
    await createUserSession(user)
    console.log("User session created successfully")

    // Clear the temporary cookie
    const response = NextResponse.redirect(new URL("/dashboard", request.url))
    response.cookies.delete("github_user")

    console.log("Redirecting to dashboard")
    return response
  } catch (error: any) {
    console.error("GitHub callback error:", error)

    const response = NextResponse.redirect(new URL("/login?error=github_auth_failed", request.url))
    response.cookies.delete("github_user")

    return response
  }
}
