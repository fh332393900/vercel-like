"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Github, Upload, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const [avatarSrc, setAvatarSrc] = useState<string>("/placeholder.svg?height=100&width=100")
  const [name, setName] = useState<string>("Jane Doe")
  const [email, setEmail] = useState<string>("jane@example.com")
  const [isGithubConnected, setIsGithubConnected] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true)
  const [deploymentNotifications, setDeploymentNotifications] = useState<boolean>(true)
  const [marketingEmails, setMarketingEmails] = useState<boolean>(false)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, this would upload the file to a server
      // For now, we'll just create a local URL
      const url = URL.createObjectURL(file)
      setAvatarSrc(url)

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      })
    }
  }

  const handleSaveProfile = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      })
    }, 1000)
  }

  const handleDisconnectGithub = () => {
    setIsGithubConnected(false)
    toast({
      title: "GitHub disconnected",
      description: "Your GitHub account has been disconnected.",
      variant: "destructive",
    })
  }

  const handleConnectGithub = () => {
    setIsGithubConnected(true)
    toast({
      title: "GitHub connected",
      description: "Your GitHub account has been connected successfully.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="ml-auto">
            <Button onClick={handleSaveProfile} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="container">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto">
              <TabsTrigger
                value="profile"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none px-4 py-2"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="connections"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none px-4 py-2"
              >
                Connections
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:shadow-none px-4 py-2"
              >
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your profile information and avatar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={avatarSrc || "/placeholder.svg"} alt={name} />
                        <AvatarFallback className="text-lg">
                          {name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="relative">
                        <Input
                          type="file"
                          id="avatar"
                          className="hidden"
                          accept="image/*"
                          onChange={handleAvatarChange}
                        />
                        <Label
                          htmlFor="avatar"
                          className="inline-flex items-center gap-2 text-sm cursor-pointer text-purple-600 hover:text-purple-700"
                        >
                          <Upload className="h-4 w-4" />
                          Change Avatar
                        </Label>
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="connections" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>Manage your connected accounts and services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black">
                        <Github className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">GitHub</h3>
                        <p className="text-sm text-muted-foreground">
                          {isGithubConnected ? "Connected to github.com/janedoe" : "Not connected"}
                        </p>
                      </div>
                    </div>
                    {isGithubConnected ? (
                      <Button variant="outline" onClick={handleDisconnectGithub} className="gap-2">
                        <X className="h-4 w-4" />
                        Disconnect
                      </Button>
                    ) : (
                      <Button onClick={handleConnectGithub} className="gap-2">
                        <Github className="h-4 w-4" />
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how and when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Deployment Notifications</h3>
                        <p className="text-sm text-muted-foreground">Get notified when deployments succeed or fail</p>
                      </div>
                      <Switch checked={deploymentNotifications} onCheckedChange={setDeploymentNotifications} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Marketing Emails</h3>
                        <p className="text-sm text-muted-foreground">Receive updates about new features and offers</p>
                      </div>
                      <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
