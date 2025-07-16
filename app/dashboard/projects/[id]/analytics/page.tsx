"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Calendar, ChevronDown, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DeploymentActivity } from "@/components/analytics/deployment-activity"
import { PerformanceMetrics } from "@/components/analytics/performance-metrics"

export default function ProjectAnalyticsPage() {
  const params = useParams<{ id: string }>()
  const [dateRange, setDateRange] = useState<string>("30d")

  // In a real app, we would fetch project data based on the ID
  const projectName =
    params.id === "1"
      ? "E-commerce Website"
      : params.id === "2"
        ? "Personal Blog"
        : params.id === "3"
          ? "Portfolio"
          : "Project"

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{projectName} Analytics</h2>
          <p className="text-muted-foreground">Monitor deployment performance and website metrics for this project</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Calendar className="h-4 w-4" />
            <span>{dateRange === "30d" ? "Last 30 days" : dateRange === "90d" ? "Last 90 days" : "All time"}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
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
