import { type NextRequest, NextResponse } from "next/server"
import { getPendingUser, deletePendingUser } from "@/lib/redis"
import { createUser, createSession } from "@/lib/db"
import { randomBytes } from "crypto"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
    }

    // Get pending user data from Redis
    const pendingUser = await getPendingUser(token)
    if (!pendingUser) {
      return NextResponse.json(
        { error: "Invalid or expired verification token. Please register again." },
        { status: 400 },
      )
    }

    // Create user in database
    const user = await createUser({
      email: pendingUser.email,
      name: pendingUser.name,
      passwordHash: pendingUser.passwordHash,
      emailVerified: true,
    })

    // Create session for auto-login
    const sessionToken = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await createSession(user.id.toString(), sessionToken, expiresAt)

    // Delete pending user data from Redis
    await deletePendingUser(token)

    // Set session cookie and redirect
    const response = NextResponse.redirect(new URL("/dashboard", request.url))
    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Failed to verify email. Please try again." }, { status: 500 })
  }
}
