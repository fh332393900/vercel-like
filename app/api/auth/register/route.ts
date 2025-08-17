import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { randomBytes } from "crypto"
import { getUserByEmail } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/email"
import { storePendingUser } from "@/lib/redis"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Generate verification token
    const verificationToken = randomBytes(32).toString("hex")

    // Store pending user data in Redis
    await storePendingUser(verificationToken, {
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    })

    // Send verification email
    await sendVerificationEmail(email, verificationToken, name)

    return NextResponse.json({
      message: "Registration initiated. Please check your email to verify your account.",
      email: email,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Failed to process registration. Please try again." }, { status: 500 })
  }
}
