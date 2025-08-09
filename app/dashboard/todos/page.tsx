"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Edit, Trash2, Calendar } from "lucide-react"
import { format, isAfter } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { TodoForm } from "@/components/todos/todo-form"
import { TodoFilters } from "@/components/todos/todo-filters"
import { useToast } from "@/components/ui/use-toast"

interface Todo {
  id: number
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  due_date: string | null
  created_at: string
  updated_at: string
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const { toast } = useToast()

  const fetchTodos = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (priorityFilter !== "all") params.append("priority", priorityFilter)

      const response = await fetch(`/api/todos?${params}`)
      if (response.ok) {
        const data = await response.json()
        setTodos(data)
      }
    } catch (error) {
      console.error("Error fetching todos:", error)
      toast({
        title: "Error",
        description: "Failed to fetch todos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [statusFilter, priorityFilter, toast])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const handleCreateTodo = () => {
    setEditingTodo(null)
    setFormOpen(true)
  }

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo)
    setFormOpen(true)
  }

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      })

      if (response.ok) {
        fetchTodos()
        toast({
          title: "Success",
          description: `Todo ${!todo.completed ? "completed" : "reopened"}`,
        })
      }
    } catch (error) {
      console.error("Error updating todo:", error)
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTodo = async (id: number) => {
    if (!confirm("Are you sure you want to delete this todo?")) return

    try {
      const response = await fetch(`/api/todos/${id}`, { method: "DELETE" })
      if (response.ok) {
        fetchTodos()
        toast({
          title: "Success",
          description: "Todo deleted successfully",
        })
      }
    } catch (error) {
      console.error("Error deleting todo:", error)
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      })
    }
  }

  const handleFormSave = () => {
    fetchTodos()
    toast({
      title: "Success",
      description: editingTodo ? "Todo updated successfully" : "Todo created successfully",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false
    return isAfter(new Date(), new Date(dueDate))
  }

  const completedCount = todos.filter((todo) => todo.completed).length
  const pendingCount = todos.filter((todo) => !todo.completed).length
  const overdueCount = todos.filter((todo) => !todo.completed && isOverdue(todo.due_date)).length

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading todos...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Todos</h1>
        <Button onClick={handleCreateTodo}>
          <Plus className="mr-2 h-4 w-4" />
          New Todo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <TodoFilters
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
        />
      </div>

      {/* Todos List */}
      <div className="space-y-4">
        {todos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-muted-foreground text-lg mb-2">No todos found</div>
              <div className="text-sm text-muted-foreground mb-4">
                {statusFilter !== "all" || priorityFilter !== "all"
                  ? "Try adjusting your filters or create a new todo"
                  : "Create your first todo to get started"}
              </div>
              <Button onClick={handleCreateTodo}>
                <Plus className="mr-2 h-4 w-4" />
                Create Todo
              </Button>
            </CardContent>
          </Card>
        ) : (
          todos.map((todo) => (
            <Card key={todo.id} className={`${todo.completed ? "opacity-75" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => handleToggleComplete(todo)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h3 className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p
                          className={`text-sm mt-1 ${todo.completed ? "line-through text-muted-foreground" : "text-muted-foreground"}`}
                        >
                          {todo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={getPriorityColor(todo.priority)}>{todo.priority}</Badge>
                        {todo.due_date && (
                          <div
                            className={`flex items-center text-xs ${
                              isOverdue(todo.due_date) && !todo.completed ? "text-red-600" : "text-muted-foreground"
                            }`}
                          >
                            <Calendar className="mr-1 h-3 w-3" />
                            {format(new Date(todo.due_date), "MMM d, yyyy")}
                            {isOverdue(todo.due_date) && !todo.completed && (
                              <span className="ml-1 font-medium">(Overdue)</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditTodo(todo)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteTodo(todo.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <TodoForm open={formOpen} onOpenChange={setFormOpen} todo={editingTodo} onSave={handleFormSave} />
    </div>
  )
}
