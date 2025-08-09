import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { title, description, completed, priority, due_date } = await request.json()
    const todoId = Number.parseInt(params.id)

    // Check if todo belongs to user
    const [existingTodo] = await sql`
      SELECT id FROM todos WHERE id = ${todoId} AND user_id = ${user.id}
    `

    if (!existingTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 })
    }

    const [updatedTodo] = await sql`
      UPDATE todos 
      SET 
        title = COALESCE(${title?.trim()}, title),
        description = COALESCE(${description?.trim()}, description),
        completed = COALESCE(${completed}, completed),
        priority = COALESCE(${priority}, priority),
        due_date = COALESCE(${due_date}, due_date),
        updated_at = NOW()
      WHERE id = ${todoId} AND user_id = ${user.id}
      RETURNING id, title, description, completed, priority, due_date, created_at, updated_at
    `

    return NextResponse.json({ todo: updatedTodo })
  } catch (error) {
    console.error("Update todo error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const todoId = Number.parseInt(params.id)

    // Check if todo belongs to user and delete
    const [deletedTodo] = await sql`
      DELETE FROM todos 
      WHERE id = ${todoId} AND user_id = ${user.id}
      RETURNING id
    `

    if (!deletedTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete todo error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
