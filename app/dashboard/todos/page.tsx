"use client"

import * as React from "react"
import { PlusCircle } from "lucide-react"

import type { Todo } from "@/types/todo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { TodoFilters } from "@/components/todos/todo-filters"
import { TodoForm } from "@/components/todos/todo-form"
import { TodoItem } from "@/components/todos/todo-item"

export default function TodosPage() {
  const [todos, setTodos] = React.useState<Todo[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [editingTodo, setEditingTodo] = React.useState<Todo | undefined>(undefined)
  const [filters, setFilters] = React.useState({ status: "all", priority: "all" })
  const { toast } = useToast()

  const fetchTodos = React.useCallback(async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (filters.status !== "all") {
        queryParams.append("completed", filters.status === "completed" ? "true" : "false")
      }
      if (filters.priority !== "all") {
        queryParams.append("priority", filters.priority)
      }

      const res = await fetch(`/api/todos?${queryParams.toString()}`)
      if (!res.ok) {
        throw new Error("Failed to fetch todos")
      }
      const data = await res.json()
      setTodos(data.todos)
    } catch (error) {
      console.error("Error fetching todos:", error)
      toast({
        title: "Error",
        description: "Failed to load todos. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [filters, toast])

  React.useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const handleSaveTodo = async (todoData: Partial<Todo>) => {
    setIsSaving(true)
    try {
      let res: Response
      if (editingTodo) {
        res = await fetch(`/api/todos/${editingTodo.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(todoData),
        })
      } else {
        res = await fetch("/api/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(todoData),
        })
      }

      if (!res.ok) {
        throw new Error("Failed to save todo")
      }

      toast({
        title: "Success",
        description: `Todo ${editingTodo ? "updated" : "created"} successfully.`,
      })
      setOpenDialog(false)
      setEditingTodo(undefined)
      fetchTodos()
    } catch (error) {
      console.error("Error saving todo:", error)
      toast({
        title: "Error",
        description: `Failed to save todo. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      })

      if (!res.ok) {
        throw new Error("Failed to update todo status")
      }

      setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, completed } : todo)))
      toast({
        title: "Success",
        description: `Todo marked as ${completed ? "completed" : "pending"}.`,
      })
    } catch (error) {
      console.error("Error toggling complete:", error)
      toast({
        title: "Error",
        description: "Failed to update todo status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTodo = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) {
      return
    }
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete todo")
      }

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
      toast({
        title: "Success",
        description: "Todo deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting todo:", error)
      toast({
        title: "Error",
        description: "Failed to delete todo. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo)
    setOpenDialog(true)
  }

  const handleUpdatePriority = async (id: number, priority: "low" | "medium" | "high") => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority }),
      })

      if (!res.ok) {
        throw new Error("Failed to update todo priority")
      }

      setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, priority } : todo)))
      toast({
        title: "Success",
        description: `Todo priority updated to ${priority}.`,
      })
    } catch (error) {
      console.error("Error updating priority:", error)
      toast({
        title: "Error",
        description: "Failed to update todo priority. Please try again.",
        variant: "destructive",
      })
    }
  }

  const completedTodos = todos.filter((todo) => todo.completed).length
  const pendingTodos = todos.filter((todo) => !todo.completed).length
  const overdueTodos = todos.filter(
    (todo) => todo.due_date && new Date(todo.due_date) < new Date() && !todo.completed,
  ).length

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Todos</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingTodo(undefined)
                setOpenDialog(true)
              }}
            >
              <PlusCircle className="mr-2 size-4" /> New Todo
            </Button>
          </DialogTrigger>
          <TodoForm
            todo={editingTodo}
            onSave={handleSaveTodo}
            onClose={() => setOpenDialog(false)}
            isSaving={isSaving}
            open={openDialog}
          />
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Todos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTodos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTodos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTodos}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Todos</CardTitle>
        </CardHeader>
        <CardContent>
          <TodoFilters currentFilters={filters} onFilterChange={setFilters} />
          <Separator className="my-4" />
          {loading ? (
            <div className="text-center text-muted-foreground">Loading todos...</div>
          ) : todos.length === 0 ? (
            <div className="text-center text-muted-foreground">No todos found.</div>
          ) : (
            <div className="grid gap-3">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditTodo}
                  onDelete={handleDeleteTodo}
                  onUpdatePriority={handleUpdatePriority}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
