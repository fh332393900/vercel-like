"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import type { Todo } from "@/types/todo"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface TodoFormProps {
  todo?: Todo
  onSave: (todo: Partial<Todo>) => Promise<void>
  onClose: () => void
  isSaving: boolean
  open: boolean
}

export function TodoForm({ todo, onSave, onClose, isSaving, open }: TodoFormProps) {
  const [title, setTitle] = React.useState(todo?.title || "")
  const [description, setDescription] = React.useState(todo?.description || "")
  const [completed, setCompleted] = React.useState(todo?.completed || false)
  const [priority, setPriority] = React.useState<"low" | "medium" | "high">(todo?.priority || "medium")
  const [dueDate, setDueDate] = React.useState<Date | undefined>(todo?.due_date ? new Date(todo.due_date) : undefined)
  const { toast } = useToast()

  React.useEffect(() => {
    if (open) {
      setTitle(todo?.title || "")
      setDescription(todo?.description || "")
      setCompleted(todo?.completed || false)
      setPriority(todo?.priority || "medium")
      setDueDate(todo?.due_date ? new Date(todo.due_date) : undefined)
    }
  }, [open, todo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Todo title cannot be empty.",
        variant: "destructive",
      })
      return
    }

    const todoData: Partial<Todo> = {
      title: title.trim(),
      description: description.trim() || null,
      completed,
      priority,
      due_date: dueDate?.toISOString() || null,
    }

    await onSave(todoData)
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{todo ? "Edit Todo" : "Create New Todo"}</DialogTitle>
        <DialogDescription>{todo ? "Make changes to your todo here." : "Add a new todo item."}</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <RadioGroup
              value={priority}
              onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}
              className="col-span-3 flex items-center gap-4"
            >
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
            </RadioGroup>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("col-span-3 justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                  type="button" // Prevent form submission
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          {todo && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="completed" className="text-right">
                Completed
              </Label>
              <Checkbox
                id="completed"
                checked={completed}
                onCheckedChange={(checked) => setCompleted(Boolean(checked))}
                className="col-span-3"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
