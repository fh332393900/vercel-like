export interface Todo {
  id: number
  user_id: number
  title: string
  description: string | null
  completed: boolean
  priority: "low" | "medium" | "high"
  due_date: string | null // ISO string
  created_at: string
  updated_at: string
}
