import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    const user = await getCurrentUser()

    // Get session info from database
    let sessionInfo = null
    if (sessionCookie?.value) {
      const sessions = await sql`
        SELECT id, user_id, expires_at, created_at
        FROM sessions 
        WHERE id = ${sessionCookie.value}
      `
      sessionInfo = sessions[0] || null
    }

    return NextResponse.json({
      authenticated: !!user,
      user: user,
      sessionCookie: sessionCookie?.value || null,
      sessionInfo: sessionInfo,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug session error:", error)
    return NextResponse.json(
      {
        error: "Failed to get session info",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
