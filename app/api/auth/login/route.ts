import { type NextRequest, NextResponse } from "next/server"
import { loginUser, createUserSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await loginUser(email, password)

    // Check if email is verified
    if (!user.email_verified) {
      return NextResponse.json(
        {
          error: "Please verify your email address before logging in. Check your inbox for the verification email.",
        },
        { status: 403 },
      )
    }

    await createUserSession(user)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        email_verified: user.email_verified,
      },
    })
  } catch (error: any) {
    console.error("Login error:", error)

    if (error.message === "Invalid credentials") {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (error.message === "Please use GitHub login for this account") {
      return NextResponse.json({ error: "Please use GitHub login for this account" }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
