import { type NextRequest, NextResponse } from "next/server"
import { getPendingUser, deletePendingUser } from "@/lib/redis"
import { createUser, createSession } from "@/lib/db"
import { randomBytes } from "crypto"
import { createUserSession } from "@/lib/auth"

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
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 })
    }

    // Create user in database
    const user = await createUser({
      name: pendingUser.name,
      email: pendingUser.email,
      passwordHash: pendingUser.passwordHash,
      emailVerified: true,
    })

    // Clean up pending user data
    await deletePendingUser(token)

    // Create session for auto-login
    const sessionToken = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await createUserSession(user)

    // Set session cookie
    const response = NextResponse.json({
      message: "Email verified successfully! You are now logged in.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        email_verified: true,
      },
    })

    return response
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Failed to verify email. Please try again." }, { status: 500 })
  }
}
