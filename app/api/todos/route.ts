import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const completed = searchParams.get("completed")
    const priority = searchParams.get("priority")

    let query = sql`
      SELECT id, title, description, completed, priority, due_date, created_at, updated_at
      FROM todos 
      WHERE user_id = ${user.id}
    `

    // Add filters
    const conditions = []
    if (completed !== null) {
      conditions.push(sql`completed = ${completed === "true"}`)
    }
    if (priority) {
      conditions.push(sql`priority = ${priority}`)
    }

    if (conditions.length > 0) {
      query = sql`
        SELECT id, title, description, completed, priority, due_date, created_at, updated_at
        FROM todos 
        WHERE user_id = ${user.id} AND ${sql.join(conditions, sql` AND `)}
      `
    }

    query = sql`${query} ORDER BY created_at DESC`

    const todos = await query

    return NextResponse.json({ todos })
  } catch (error) {
    console.error("Get todos error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { title, description, priority, due_date } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const [todo] = await sql`
      INSERT INTO todos (user_id, title, description, priority, due_date)
      VALUES (${user.id}, ${title}, ${description || null}, ${priority || "medium"}, ${due_date || null})
      RETURNING id, title, description, completed, priority, due_date, created_at, updated_at
    `

    return NextResponse.json({ todo })
  } catch (error) {
    console.error("Create todo error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
