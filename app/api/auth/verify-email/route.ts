import { type NextRequest, NextResponse } from "next/server"
import { get, del } from "@/lib/redis"
import { sql } from "@/lib/db"
import { createUserSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
    }

    // Get registration data from Redis
    const registrationData = await get(`registration:${token}`)

    if (!registrationData) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 })
    }

    const { email, name, passwordHash } = registrationData

    // Check if user already exists (in case of race condition)
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      // Clean up Redis data
      await del(`registration:${token}`)
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Create user in database
    const users = await sql`
      INSERT INTO users (email, password_hash, name, email_verified, email_verified_at, created_at, updated_at)
      VALUES (${email}, ${passwordHash}, ${name}, true, NOW(), NOW(), NOW())
      RETURNING id, email, name, avatar_url, email_verified, created_at
    `

    const user = users[0]

    // Clean up Redis data
    await del(`registration:${token}`)

    // Create session and log user in
    await createUserSession({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
    })

    console.log("User verified and logged in:", user.email)

    return NextResponse.json({
      message: "Email verified successfully. You are now logged in.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        email_verified: user.email_verified,
      },
    })
  } catch (error: any) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
