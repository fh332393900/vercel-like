import { type NextRequest, NextResponse } from "next/server"
import { loginWithGithub, createUserSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const githubUserCookie = request.cookies.get("github_user")?.value

    if (!githubUserCookie) {
      console.error("No GitHub user data found in callback")
      throw new Error("No GitHub user data found")
    }

    const githubUser = JSON.parse(githubUserCookie)

    // Validate required fields
    if (!githubUser.id || !githubUser.email || !githubUser.name) {
      console.error("Invalid GitHub user data:", githubUser)
      throw new Error("Invalid GitHub user data")
    }

    // Login or create user with GitHub data
    const user = await loginWithGithub(githubUser)
    await createUserSession(user)

    // Clear the temporary cookie
    const response = NextResponse.redirect(new URL("/dashboard", request.url))
    response.cookies.delete("github_user")

    return response
  } catch (error: any) {
    console.error("GitHub callback error:", error)

    const response = NextResponse.redirect(new URL("/login?error=github_auth_failed", request.url))
    response.cookies.delete("github_user")

    return response
  }
}
