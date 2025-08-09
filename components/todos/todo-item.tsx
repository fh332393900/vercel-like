"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Clock, Edit2, MoreHorizontal, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const [isToggling, setIsToggling] = useState(false)

  const handleToggle = async () => {
    setIsToggling(true)
    await onToggle(todo.id, !todo.completed)
    setIsToggling(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const isOverdue = todo.due_date && new Date(todo.due_date) < new Date() && !todo.completed

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border transition-colors",
        todo.completed ? "bg-muted/50" : "bg-background",
        isOverdue ? "border-red-200 bg-red-50/50" : "",
      )}
    >
      <Checkbox checked={todo.completed} onCheckedChange={handleToggle} disabled={isToggling} className="mt-1" />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className={cn("font-medium text-sm", todo.completed ? "line-through text-muted-foreground" : "")}>
              {todo.title}
            </h3>
            {todo.description && (
              <p
                className={cn(
                  "text-sm mt-1",
                  todo.completed ? "line-through text-muted-foreground" : "text-muted-foreground",
                )}
              >
                {todo.description}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(todo)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(todo.id)} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className={getPriorityColor(todo.priority)}>
            {todo.priority}
          </Badge>

          {todo.due_date && (
            <div
              className={cn("flex items-center gap-1 text-xs", isOverdue ? "text-red-600" : "text-muted-foreground")}
            >
              <Calendar className="h-3 w-3" />
              <span>Due {format(new Date(todo.due_date), "MMM d, yyyy")}</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Created {format(new Date(todo.created_at), "MMM d")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
