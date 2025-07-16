"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  BarChart,
  Clock,
  Code,
  ExternalLink,
  Globe,
  MoreHorizontal,
  RefreshCw,
  Settings,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartComponent } from "@/components/analytics/chart-component"

// Mock data for project analytics
const deploymentData = [
  { date: "Mon", deployments: 2, builds: 3 },
  { date: "Tue", deployments: 1, builds: 1 },
  { date: "Wed", deployments: 3, builds: 4 },
  { date: "Thu", deployments: 2, builds: 2 },
  { date: "Fri", deployments: 4, builds: 5 },
  { date: "Sat", deployments: 1, builds: 1 },
  { date: "Sun", deployments: 0, builds: 0 },
]

export default function ProjectPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [domain, setDomain] = useState("ecommerce-site.deployhub.app")
  const [customDomain, setCustomDomain] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  // In a real app, we would fetch project data based on the ID
  const projectName =
    params.id === "1"
      ? "E-commerce Website"
      : params.id === "2"
        ? "Personal Blog"
        : params.id === "3"
          ? "Portfolio"
          : "Project"

  const handleAddDomain = () => {
    if (customDomain) {
      setDomain(customDomain)
      setCustomDomain("")
      setIsAdding(false)
    }
  }

  const viewAnalytics = () => {
    router.push(`/dashboard/projects/${params.id}/analytics`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Projects</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Redeploy
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Project Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="container">
          <div className="grid gap-6">
            <div>
              <h1 className="text-3xl font-bold">{projectName}</h1>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Code className="h-4 w-4" />
                <span>user/ecommerce</span>
                <span className="text-green-600 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-600"></span>
                  Production
                </span>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Domains
                  </CardTitle>
                  <CardDescription>Configure the domains for your project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{domain}</p>
                        <p className="text-sm text-muted-foreground">Production domain</p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Visit
                      </Button>
                    </div>
                    {isAdding ? (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter custom domain"
                          value={customDomain}
                          onChange={(e) => setCustomDomain(e.target.value)}
                        />
                        <Button onClick={handleAddDomain}>Add</Button>
                        <Button variant="outline" onClick={() => setIsAdding(false)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" onClick={() => setIsAdding(true)}>
                        Add Custom Domain
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    Analytics
                  </CardTitle>
                  <CardDescription>View deployment and performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ChartComponent
                    title="Recent Deployments"
                    data={deploymentData}
                    type="bar"
                    xKey="date"
                    yKeys={[
                      { key: "deployments", name: "Deployments", color: "#8884d8" },
                      { key: "builds", name: "Builds", color: "#82ca9d" },
                    ]}
                  />
                  <Button onClick={viewAnalytics} className="w-full">
                    View Detailed Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Deployments
                </CardTitle>
                <CardDescription>View your recent deployment history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">Production</p>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Logs
                    </Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">Preview</p>
                      <p className="text-sm text-muted-foreground">1 day ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Logs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Deployment Logs</CardTitle>
                <CardDescription>View the logs for your latest deployment</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="build">
                  <TabsList>
                    <TabsTrigger value="build">Build Logs</TabsTrigger>
                    <TabsTrigger value="runtime">Runtime Logs</TabsTrigger>
                  </TabsList>
                  <TabsContent value="build" className="mt-4">
                    <div className="rounded-lg bg-black p-4 font-mono text-xs text-white">
                      <p>$ git clone https://github.com/user/ecommerce.git</p>
                      <p>Cloning into 'ecommerce'...</p>
                      <p>$ cd ecommerce</p>
                      <p>$ npm install</p>
                      <p>Installing dependencies...</p>
                      <Separator className="my-2 bg-white/20" />
                      <p>$ npm run build</p>
                      <p>Creating an optimized production build...</p>
                      <p className="text-green-400">✓ Build completed successfully</p>
                      <Separator className="my-2 bg-white/20" />
                      <p>$ npm run deploy</p>
                      <p>Deploying to production...</p>
                      <p className="text-green-400">✓ Deployment successful!</p>
                      <p className="text-blue-400">🚀 Your project is live at: https://ecommerce-site.deployhub.app</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="runtime" className="mt-4">
                    <div className="rounded-lg bg-black p-4 font-mono text-xs text-white">
                      <p>[2023-04-15 10:15:23] Server started on port 3000</p>
                      <p>[2023-04-15 10:15:24] Connected to database</p>
                      <p>[2023-04-15 10:15:25] Initializing cache</p>
                      <p>[2023-04-15 10:15:26] Application ready</p>
                      <p>[2023-04-15 10:16:30] GET /api/products 200 15ms</p>
                      <p>[2023-04-15 10:16:35] GET /api/products/1 200 8ms</p>
                      <p>[2023-04-15 10:17:40] GET /api/categories 200 12ms</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
