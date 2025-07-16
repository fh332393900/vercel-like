"use client"

import { Activity, ArrowDown, Clock, Server } from "lucide-react"

import { AnalyticsCard } from "@/components/analytics/analytics-card"
import { ChartComponent } from "@/components/analytics/chart-component"

// Mock data for deployment activity
const deploymentData = [
  { date: "Jan", deployments: 12, builds: 15, failures: 3 },
  { date: "Feb", deployments: 19, builds: 22, failures: 2 },
  { date: "Mar", deployments: 15, builds: 18, failures: 1 },
  { date: "Apr", deployments: 25, builds: 28, failures: 2 },
  { date: "May", deployments: 32, builds: 35, failures: 3 },
  { date: "Jun", deployments: 28, builds: 30, failures: 1 },
  { date: "Jul", deployments: 35, builds: 38, failures: 2 },
]

// Mock data for deployment times
const deploymentTimeData = [
  { date: "Jan", avgTime: 45 },
  { date: "Feb", avgTime: 42 },
  { date: "Mar", avgTime: 38 },
  { date: "Apr", avgTime: 35 },
  { date: "May", avgTime: 32 },
  { date: "Jun", avgTime: 30 },
  { date: "Jul", avgTime: 28 },
]

export function DeploymentActivity() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          title="Total Deployments"
          value="166"
          description="All-time deployments"
          icon={<Server className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
        />
        <AnalyticsCard
          title="Success Rate"
          value="98.2%"
          description="Last 30 days"
          icon={<Activity className="h-4 w-4" />}
          trend={{ value: 0.5, isPositive: true }}
        />
        <AnalyticsCard
          title="Avg. Build Time"
          value="28s"
          description="Last 30 days"
          icon={<Clock className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
        />
        <AnalyticsCard
          title="Failed Builds"
          value="14"
          description="Last 30 days"
          icon={<ArrowDown className="h-4 w-4" />}
          trend={{ value: 5, isPositive: false }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartComponent
          title="Deployment Activity"
          description="Number of deployments and builds over time"
          data={deploymentData}
          type="bar"
          xKey="date"
          yKeys={[
            { key: "deployments", name: "Deployments", color: "#8884d8" },
            { key: "builds", name: "Builds", color: "#82ca9d" },
            { key: "failures", name: "Failures", color: "#ff8042" },
          ]}
          allowChangeType
        />
        <ChartComponent
          title="Average Build Time"
          description="Average build time in seconds"
          data={deploymentTimeData}
          type="line"
          xKey="date"
          yKeys={[{ key: "avgTime", name: "Avg. Time (s)", color: "#8884d8" }]}
          allowChangeType
        />
      </div>
    </div>
  )
}
