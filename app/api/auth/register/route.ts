import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { setWithExpiry } from "@/lib/redis"
import { sendEmail, generateVerificationEmailHtml } from "@/lib/email"
import bcrypt from "bcryptjs"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex")

    // Store registration data in Redis with 1 hour expiry
    const registrationData = {
      email,
      name,
      passwordHash,
      createdAt: new Date().toISOString(),
    }

    await setWithExpiry(`registration:${verificationToken}`, registrationData, 3600) // 1 hour

    // Generate verification URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`

    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: "Verify your email address - DeployHub",
        html: generateVerificationEmailHtml(verificationUrl, name),
      })

      console.log("Verification email sent to:", email)
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
      return NextResponse.json({ error: "Failed to send verification email. Please try again." }, { status: 500 })
    }

    return NextResponse.json({
      message: "Registration initiated. Please check your email to verify your account.",
      email: email,
    })
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
