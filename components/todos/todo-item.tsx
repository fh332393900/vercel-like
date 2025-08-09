"use client"
import { format } from "date-fns"
import { CalendarIcon, Edit, Trash2 } from "lucide-react"

import type { Todo } from "@/types/todo"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface TodoItemProps {
  todo: Todo
  onToggleComplete: (id: number, completed: boolean) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: number) => void
  onUpdatePriority: (id: number, priority: "low" | "medium" | "high") => void
}

export function TodoItem({ todo, onToggleComplete, onEdit, onDelete, onUpdatePriority }: TodoItemProps) {
  const isOverdue = todo.due_date && new Date(todo.due_date) < new Date() && !todo.completed

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md border p-3 transition-colors",
        todo.completed && "bg-muted/50 opacity-70",
        isOverdue && !todo.completed && "border-red-500 bg-red-50/50",
      )}
    >
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={(checked) => onToggleComplete(todo.id, Boolean(checked))}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? "incomplete" : "complete"}`}
      />
      <div className="grid flex-1 gap-1">
        <Label
          htmlFor={`todo-${todo.id}`}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            todo.completed && "line-through text-muted-foreground",
          )}
        >
          {todo.title}
        </Label>
        {todo.description && (
          <p className={cn("text-sm text-muted-foreground", todo.completed && "line-through")}>{todo.description}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {todo.due_date && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className={cn("flex items-center gap-1", isOverdue && "text-red-600 font-semibold")}>
                    <CalendarIcon className="size-3" />
                    {format(new Date(todo.due_date), "MMM dd, yyyy")}
                  </span>
                </TooltipTrigger>
                <TooltipContent>{isOverdue ? "Overdue" : "Due Date"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {todo.priority && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                todo.priority === "low" && "bg-green-100 text-green-800",
                todo.priority === "medium" && "bg-yellow-100 text-yellow-800",
                todo.priority === "high" && "bg-red-100 text-red-800",
              )}
            >
              {todo.priority}
            </span>
          )}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <Edit className="size-4" />
            <span className="sr-only">Edit Todo</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(todo)}>
            <Edit className="mr-2 size-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(todo.id)} className="text-red-600">
            <Trash2 className="mr-2 size-4" /> Delete
          </DropdownMenuItem>
          <DropdownMenuContent>
            <RadioGroup
              value={todo.priority}
              onValueChange={(value: "low" | "medium" | "high") => onUpdatePriority(todo.id, value)}
              className="p-2"
            >
              <Label className="mb-2 text-sm font-medium">Set Priority</Label>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="priority-low" />
                  <Label htmlFor="priority-low">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="priority-medium" />
                  <Label htmlFor="priority-medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="priority-high" />
                  <Label htmlFor="priority-high">High</Label>
                </div>
              </div>
            </RadioGroup>
          </DropdownMenuContent>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
