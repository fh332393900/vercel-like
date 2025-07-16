import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value

    console.log("Debug session endpoint called")
    console.log("Session token exists:", !!sessionToken)

    if (sessionToken) {
      console.log("Session token (first 10 chars):", sessionToken.substring(0, 10))
    }

    const user = await getCurrentUser()

    return NextResponse.json({
      hasSessionToken: !!sessionToken,
      sessionTokenPreview: sessionToken ? sessionToken.substring(0, 10) + "..." : null,
      user: user,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug session error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
