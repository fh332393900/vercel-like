"use client"

import { ArrowDown, Clock, Cpu, Zap } from "lucide-react"

import { AnalyticsCard } from "@/components/analytics/analytics-card"
import { ChartComponent } from "@/components/analytics/chart-component"

// Mock data for performance metrics
const performanceData = [
  { date: "Jan", ttfb: 120, lcp: 2500, cls: 0.12, fid: 80 },
  { date: "Feb", ttfb: 115, lcp: 2400, cls: 0.11, fid: 75 },
  { date: "Mar", ttfb: 105, lcp: 2300, cls: 0.1, fid: 70 },
  { date: "Apr", ttfb: 95, lcp: 2200, cls: 0.09, fid: 65 },
  { date: "May", ttfb: 90, lcp: 2100, cls: 0.08, fid: 60 },
  { date: "Jun", ttfb: 85, lcp: 2000, cls: 0.07, fid: 55 },
  { date: "Jul", ttfb: 80, lcp: 1900, cls: 0.06, fid: 50 },
]

// Mock data for regional performance
const regionalData = [
  { region: "North America", ttfb: 75, users: 45 },
  { region: "Europe", ttfb: 85, users: 30 },
  { region: "Asia", ttfb: 110, users: 15 },
  { region: "South America", ttfb: 120, users: 5 },
  { region: "Africa", ttfb: 140, users: 3 },
  { region: "Oceania", ttfb: 95, users: 2 },
]

export function PerformanceMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          title="Time to First Byte"
          value="80ms"
          description="Global average"
          icon={<Clock className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
        />
        <AnalyticsCard
          title="Largest Contentful Paint"
          value="1.9s"
          description="Global average"
          icon={<Zap className="h-4 w-4" />}
          trend={{ value: 8, isPositive: true }}
        />
        <AnalyticsCard
          title="Cumulative Layout Shift"
          value="0.06"
          description="Global average"
          icon={<ArrowDown className="h-4 w-4" />}
          trend={{ value: 15, isPositive: true }}
        />
        <AnalyticsCard
          title="First Input Delay"
          value="50ms"
          description="Global average"
          icon={<Cpu className="h-4 w-4" />}
          trend={{ value: 10, isPositive: true }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartComponent
          title="Core Web Vitals"
          description="Performance metrics over time"
          data={performanceData}
          type="line"
          xKey="date"
          yKeys={[
            { key: "ttfb", name: "TTFB (ms)", color: "#8884d8" },
            { key: "lcp", name: "LCP (ms)", color: "#82ca9d" },
            { key: "fid", name: "FID (ms)", color: "#ffc658" },
          ]}
          allowChangeType
        />
        <ChartComponent
          title="Regional Performance"
          description="TTFB by region (ms)"
          data={regionalData}
          type="bar"
          xKey="region"
          yKeys={[
            { key: "ttfb", name: "TTFB (ms)", color: "#8884d8" },
            { key: "users", name: "Users (%)", color: "#82ca9d" },
          ]}
          allowChangeType
        />
      </div>
    </div>
  )
}
