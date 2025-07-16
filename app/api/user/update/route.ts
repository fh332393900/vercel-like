import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { updateUser } from "@/lib/db"

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { name, email, avatarUrl } = await request.json()

    const updatedUser = await updateUser(user.id, {
      name,
      email,
      avatarUrl,
    })

    if (!updatedUser) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 })
    }

    return NextResponse.json({ user: updatedUser })
  } catch (error: any) {
    console.error("Update user error:", error)

    if (error.message.includes("duplicate key")) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
