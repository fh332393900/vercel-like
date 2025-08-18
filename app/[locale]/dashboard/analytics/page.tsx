"use client"

import { useState } from "react"
import { Calendar, ChevronDown, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DeploymentActivity } from "@/components/analytics/deployment-activity"
import { PerformanceMetrics } from "@/components/analytics/performance-metrics"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AnalyticsPage() {
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("30d")

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Monitor your deployment performance and website metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Calendar className="h-4 w-4" />
            <span>{dateRange === "30d" ? "Last 30 days" : dateRange === "90d" ? "Last 90 days" : "All time"}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="ecommerce">E-commerce Website</SelectItem>
              <SelectItem value="blog">Personal Blog</SelectItem>
              <SelectItem value="portfolio">Portfolio</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="deployments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="deployments" className="space-y-4">
          <DeploymentActivity />
        </TabsContent>
        <TabsContent value="performance" className="space-y-4">
          <PerformanceMetrics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
