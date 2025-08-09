import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import jwt from "jsonwebtoken"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const { title, description, completed, priority, due_date } = await request.json()
    const todoId = Number.parseInt(params.id)

    // Check if todo belongs to user
    const existingTodo = await sql("SELECT * FROM todos WHERE id = $1 AND user_id = $2", [todoId, decoded.userId])
    if (existingTodo.length === 0) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 })
    }

    const result = await sql(
      "UPDATE todos SET title = $1, description = $2, completed = $3, priority = $4, due_date = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 AND user_id = $7 RETURNING *",
      [title, description, completed, priority, due_date, todoId, decoded.userId],
    )

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating todo:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }
    const todoId = Number.parseInt(params.id)

    const result = await sql("DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *", [todoId, decoded.userId])

    if (result.length === 0) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Todo deleted successfully" })
  } catch (error) {
    console.error("Error deleting todo:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
