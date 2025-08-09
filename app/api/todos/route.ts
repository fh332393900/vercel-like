import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import jwt from "jsonwebtoken"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")

    let query = "SELECT * FROM todos WHERE user_id = $1"
    const params: any[] = [decoded.userId]

    if (status === "completed") {
      query += " AND completed = true"
    } else if (status === "pending") {
      query += " AND completed = false"
    }

    if (priority && priority !== "all") {
      query += ` AND priority = $${params.length + 1}`
      params.push(priority)
    }

    query += " ORDER BY created_at DESC"

    const todos = await sql(query, params)
    return NextResponse.json(todos)
  } catch (error) {
    console.error("Error fetching todos:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const { title, description, priority, due_date } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const result = await sql(
      "INSERT INTO todos (user_id, title, description, priority, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [decoded.userId, title, description || null, priority || "medium", due_date || null],
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating todo:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
