"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TodoFiltersProps {
  onFilterChange: (filters: { status: string; priority: string }) => void
  currentFilters: { status: string; priority: string }
}

export function TodoFilters({ onFilterChange, currentFilters }: TodoFiltersProps) {
  const handleStatusChange = (value: string) => {
    onFilterChange({ ...currentFilters, status: value })
  }

  const handlePriorityChange = (value: string) => {
    onFilterChange({ ...currentFilters, priority: value })
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
      <Select value={currentFilters.status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={currentFilters.priority} onValueChange={handlePriorityChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
