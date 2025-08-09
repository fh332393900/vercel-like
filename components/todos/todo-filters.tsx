"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface TodoFiltersProps {
  completedFilter: string | null
  priorityFilter: string | null
  onCompletedFilterChange: (value: string | null) => void
  onPriorityFilterChange: (value: string | null) => void
  totalCount: number
  completedCount: number
}

export function TodoFilters({
  completedFilter,
  priorityFilter,
  onCompletedFilterChange,
  onPriorityFilterChange,
  totalCount,
  completedCount,
}: TodoFiltersProps) {
  const clearFilters = () => {
    onCompletedFilterChange(null)
    onPriorityFilterChange(null)
  }

  const hasActiveFilters = completedFilter !== null || priorityFilter !== null

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex items-center gap-2">
        <Badge variant="outline">{totalCount} total</Badge>
        <Badge variant="outline">{completedCount} completed</Badge>
        <Badge variant="outline">{totalCount - completedCount} pending</Badge>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={completedFilter || "all"}
          onValueChange={(value) => onCompletedFilterChange(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="false">Pending</SelectItem>
            <SelectItem value="true">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={priorityFilter || "all"}
          onValueChange={(value) => onPriorityFilterChange(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
