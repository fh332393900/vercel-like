"use client"

import { useState, useEffect } from "react"
import { Plus, ListTodo } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { TodoItem } from "@/components/todos/todo-item"
import { TodoForm } from "@/components/todos/todo-form"
import { TodoFilters } from "@/components/todos/todo-filters"

interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  due_date?: string
  created_at: string
  updated_at: string
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [completedFilter, setCompletedFilter] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const params = new URLSearchParams()
      if (completedFilter !== null) params.append("completed", completedFilter)
      if (priorityFilter !== null) params.append("priority", priorityFilter)

      const response = await fetch(`/api/todos?${params}`)
      if (!response.ok) throw new Error("Failed to fetch todos")

      const data = await response.json()
      setTodos(data.todos)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch todos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [completedFilter, priorityFilter])

  // Create todo
  const handleCreateTodo = async (data: {
    title: string
    description: string
    priority: string
    due_date?: string
  }) => {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to create todo")

      const result = await response.json()
      setTodos([result.todo, ...todos])
      toast({
        title: "Success",
        description: "Todo created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create todo",
        variant: "destructive",
      })
    }
  }

  // Update todo
  const handleUpdateTodo = async (data: {
    title: string
    description: string
    priority: string
    due_date?: string
  }) => {
    if (!editingTodo) return

    try {
      const response = await fetch(`/api/todos/${editingTodo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to update todo")

      const result = await response.json()
      setTodos(todos.map((todo) => (todo.id === editingTodo.id ? result.todo : todo)))
      setEditingTodo(null)
      toast({
        title: "Success",
        description: "Todo updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      })
    }
  }

  // Toggle todo completion
  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      })

      if (!response.ok) throw new Error("Failed to toggle todo")

      const result = await response.json()
      setTodos(todos.map((todo) => (todo.id === id ? result.todo : todo)))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      })
    }
  }

  // Delete todo
  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete todo")

      setTodos(todos.filter((todo) => todo.id !== id))
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      })
    }
  }

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingTodo(null)
  }

  const completedCount = todos.filter((todo) => todo.completed).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading todos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Todo List</h1>
          <p className="text-muted-foreground">Manage your tasks and stay organized</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Todo
        </Button>
      </div>

      <TodoFilters
        completedFilter={completedFilter}
        priorityFilter={priorityFilter}
        onCompletedFilterChange={setCompletedFilter}
        onPriorityFilterChange={setPriorityFilter}
        totalCount={todos.length}
        completedCount={completedCount}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5" />
            Your Todos
          </CardTitle>
          <CardDescription>
            {todos.length === 0
              ? "No todos found. Create your first todo to get started!"
              : `${todos.length} todo${todos.length === 1 ? "" : "s"} found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <ListTodo className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No todos yet</h3>
              <p className="text-muted-foreground mb-4">Create your first todo to start organizing your tasks</p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Todo
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onEdit={handleEditTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <TodoForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        todo={editingTodo}
        onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
      />
    </div>
  )
}
