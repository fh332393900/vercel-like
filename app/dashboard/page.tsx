"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bell, Plus, Rocket, Search, Settings, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { NewProjectDialog } from "@/components/new-project-dialog"
import { SessionDebug } from "@/components/debug/session-debug"

// Mock data for projects
const mockProjects = [
  {
    id: "1",
    name: "E-commerce Website",
    repo: "user/ecommerce",
    status: "deployed",
    url: "ecommerce-site.deployhub.app",
    updatedAt: "2 hours ago",
  },
  {
    id: "2",
    name: "Personal Blog",
    repo: "user/blog",
    status: "deployed",
    url: "my-blog.deployhub.app",
    updatedAt: "1 day ago",
  },
  {
    id: "3",
    name: "Portfolio",
    repo: "user/portfolio",
    status: "building",
    updatedAt: "Just now",
  },
]

// Mock notifications
const mockNotifications = [
  {
    id: "1",
    title: "Deployment Successful",
    description: "Your E-commerce Website has been deployed successfully.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    title: "Build Failed",
    description: "Portfolio build failed. Check logs for details.",
    time: "3 hours ago",
    read: false,
  },
  {
    id: "3",
    title: "New Feature Available",
    description: "Custom domains are now available for all projects.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "4",
    title: "Maintenance Scheduled",
    description: "System maintenance scheduled for tomorrow at 2 AM UTC.",
    time: "2 days ago",
    read: true,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [projects, setProjects] = useState(mockProjects)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const handleLogout = () => {
    // In a real app, this would handle logout logic
    window.location.href = "/login"
  }

  const handleNewProject = () => {
    setNewProjectDialogOpen(true)
  }

  const handleProjectCreated = (projectId: string) => {
    // In a real app, we would fetch the new project data
    // For now, we'll add a mock project to the list
    const newProject = {
      id: projectId,
      name: "New Project",
      repo: "user/new-project",
      status: "deployed",
      url: "new-project.deployhub.app",
      updatedAt: "Just now",
    }

    setProjects([newProject, ...projects])

    // Navigate to the new project page
    setTimeout(() => {
      router.push(`/dashboard/projects/${projectId}`)
    }, 500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold">DeployHub</span>
          </div>
          <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:gap-4">
            <form className="flex w-full max-w-sm items-center gap-2">
              <Input type="search" placeholder="Search projects..." className="h-9" />
              <Button type="submit" size="icon" variant="ghost" className="h-9 w-9">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </form>

            {/* Notifications Dropdown */}
            <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-[10px]"
                      variant="destructive"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-2">
                  <h3 className="font-medium">Notifications</h3>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto text-xs px-2">
                      Mark all as read
                    </Button>
                  )}
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b last:border-b-0 ${notification.read ? "" : "bg-muted/50"}`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{notification.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                      </div>
                    ))
                  )}
                </div>
                <DropdownMenuSeparator />
                <div className="p-2 text-center">
                  <Link href="/dashboard/notifications" className="text-xs text-purple-600 hover:underline">
                    View all notifications
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/dashboard/settings">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>

            {/* User Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full overflow-hidden">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Jane Doe</span>
                    <span className="text-xs text-muted-foreground">jane@example.com</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="container">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Projects</h1>
            <Button className="gap-2" onClick={handleNewProject}>
              <Plus className="h-4 w-4" /> New Project
            </Button>
          </div>
          <Tabs defaultValue="all" className="mt-6">
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="recent">Recently Updated</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link href={`/dashboard/projects/${project.id}`} key={project.id}>
                  <Card className="h-full transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between">
                        {project.name}
                        <div
                          className={`h-2 w-2 rounded-full ${project.status === "deployed" ? "bg-green-500" : "bg-amber-500"}`}
                        />
                      </CardTitle>
                      <CardDescription>{project.repo}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        {project.status === "deployed" ? (
                          <p className="text-green-600">Live at: {project.url}</p>
                        ) : (
                          <p className="text-amber-600">Building...</p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
                      Updated {project.updatedAt}
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </TabsContent>
            <TabsContent value="recent" className="mt-4">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Your recently updated projects will appear here.</p>
              </div>
            </TabsContent>
            <TabsContent value="favorites" className="mt-4">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Your favorite projects will appear here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        {process.env.NODE_ENV === "development" && (
          <div className="container mt-8">
            <SessionDebug />
          </div>
        )}
      </main>

      {/* New Project Dialog */}
      <NewProjectDialog
        open={newProjectDialogOpen}
        onOpenChange={setNewProjectDialogOpen}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  )
}
