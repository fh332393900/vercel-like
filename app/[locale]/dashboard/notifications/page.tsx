"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Bell, Check, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Mock notifications
const initialNotifications = [
  {
    id: "1",
    title: "Deployment Successful",
    description: "Your E-commerce Website has been deployed successfully.",
    time: "2 hours ago",
    read: false,
    type: "success",
  },
  {
    id: "2",
    title: "Build Failed",
    description: "Portfolio build failed. Check logs for details.",
    time: "3 hours ago",
    read: false,
    type: "error",
  },
  {
    id: "3",
    title: "New Feature Available",
    description: "Custom domains are now available for all projects.",
    time: "1 day ago",
    read: true,
    type: "info",
  },
  {
    id: "4",
    title: "Maintenance Scheduled",
    description: "System maintenance scheduled for tomorrow at 2 AM UTC.",
    time: "2 days ago",
    read: true,
    type: "warning",
  },
  {
    id: "5",
    title: "Security Update",
    description: "We've updated our security protocols to better protect your data.",
    time: "3 days ago",
    read: true,
    type: "info",
  },
  {
    id: "6",
    title: "New Integration Available",
    description: "Connect your projects with our new MongoDB integration.",
    time: "5 days ago",
    read: true,
    type: "info",
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activeTab, setActiveTab] = useState("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : activeTab === "unread"
        ? notifications.filter((n) => !n.read)
        : notifications.filter((n) => n.read)

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return (
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <Check className="h-4 w-4" />
          </div>
        )
      case "error":
        return (
          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <Bell className="h-4 w-4" />
          </div>
        )
      case "warning":
        return (
          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <Bell className="h-4 w-4" />
          </div>
        )
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Bell className="h-4 w-4" />
          </div>
        )
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={clearAll} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="container">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your project activities</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Notifications</CardTitle>
                  <CardDescription>View and manage your notifications</CardDescription>
                </div>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {unreadCount} unread
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="read">Read</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  {filteredNotifications.length === 0 ? (
                    <div className="py-12 text-center">
                      <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium">No notifications</h3>
                      <p className="text-muted-foreground">
                        {activeTab === "all"
                          ? "You don't have any notifications yet."
                          : activeTab === "unread"
                            ? "You don't have any unread notifications."
                            : "You don't have any read notifications."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredNotifications.map((notification) => (
                        <div key={notification.id}>
                          <div
                            className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                              notification.read ? "bg-background" : "bg-muted/50"
                            }`}
                          >
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-medium">{notification.title}</h4>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {notification.time}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                            </div>
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Mark as read
                              </Button>
                            )}
                          </div>
                          <Separator />
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
