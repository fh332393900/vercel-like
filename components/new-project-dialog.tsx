"use client"

import type React from "react"

import { useState } from "react"
import { Check, Github, Loader2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock GitHub repositories
const mockRepositories = [
  {
    id: "1",
    name: "personal-website",
    fullName: "janedoe/personal-website",
    description: "My personal website built with Next.js",
    updatedAt: "Updated 2 days ago",
    language: "TypeScript",
    private: false,
  },
  {
    id: "2",
    name: "e-commerce",
    fullName: "janedoe/e-commerce",
    description: "E-commerce platform with React and Node.js",
    updatedAt: "Updated 1 week ago",
    language: "JavaScript",
    private: false,
  },
  {
    id: "3",
    name: "blog-platform",
    fullName: "janedoe/blog-platform",
    description: "A modern blogging platform",
    updatedAt: "Updated 3 weeks ago",
    language: "TypeScript",
    private: false,
  },
  {
    id: "4",
    name: "portfolio",
    fullName: "janedoe/portfolio",
    description: "My developer portfolio",
    updatedAt: "Updated 1 month ago",
    language: "JavaScript",
    private: false,
  },
  {
    id: "5",
    name: "task-manager",
    fullName: "janedoe/task-manager",
    description: "A simple task management application",
    updatedAt: "Updated 2 months ago",
    language: "TypeScript",
    private: true,
  },
  {
    id: "6",
    name: "weather-app",
    fullName: "janedoe/weather-app",
    description: "Weather forecast application",
    updatedAt: "Updated 3 months ago",
    language: "JavaScript",
    private: false,
  },
  {
    id: "7",
    name: "chat-application",
    fullName: "janedoe/chat-application",
    description: "Real-time chat application with Socket.io",
    updatedAt: "Updated 4 months ago",
    language: "TypeScript",
    private: true,
  },
]

interface NewProjectDialogProps {
  children?: React.ReactNode
  onProjectCreated?: (projectId: string) => void
}

export function NewProjectDialog({ children, onProjectCreated }: NewProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"select" | "configure" | "deploying">("select")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)
  const [framework, setFramework] = useState<string>("next")
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentProgress, setDeploymentProgress] = useState(0)

  const filteredRepositories = mockRepositories.filter((repo) =>
    repo.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSelectRepo = (repoId: string) => {
    setSelectedRepo(repoId)
  }

  const handleContinue = () => {
    if (step === "select" && selectedRepo) {
      setStep("configure")
    } else if (step === "configure") {
      setStep("deploying")
      startDeployment()
    }
  }

  const handleBack = () => {
    if (step === "configure") {
      setStep("select")
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Reset state when dialog closes
      setTimeout(() => {
        setStep("select")
        setSelectedRepo(null)
        setIsDeploying(false)
        setDeploymentProgress(0)
        setSearchQuery("")
        setFramework("next")
      }, 300)
    }
  }

  const startDeployment = () => {
    setIsDeploying(true)
    setDeploymentProgress(0)

    // Simulate deployment progress
    const interval = setInterval(() => {
      setDeploymentProgress((prev) => {
        const newProgress = prev + Math.random() * 15
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            // Simulate deployment completion
            if (onProjectCreated) {
              onProjectCreated("new-project-id")
            }
            handleOpenChange(false)
          }, 1000)
          return 100
        }
        return newProgress
      })
    }, 800)
  }

  const selectedRepository = mockRepositories.find((repo) => repo.id === selectedRepo)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        {step === "select" && (
          <>
            <DialogHeader>
              <DialogTitle>Create a New Project</DialogTitle>
              <DialogDescription>
                Select a GitHub repository to deploy. We'll automatically detect the framework and build settings.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search repositories..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <ScrollArea className="h-[320px] rounded-md border">
                <div className="p-4">
                  {filteredRepositories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="rounded-full bg-muted p-3">
                        <Github className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">No repositories found</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        We couldn't find any repositories matching your search.
                      </p>
                    </div>
                  ) : (
                    <RadioGroup value={selectedRepo || ""} onValueChange={handleSelectRepo}>
                      {filteredRepositories.map((repo) => (
                        <div key={repo.id} className="mb-4 last:mb-0">
                          <div
                            className={`flex items-start space-x-3 rounded-lg border p-3 transition-colors ${
                              selectedRepo === repo.id ? "border-purple-600 bg-purple-50" : ""
                            }`}
                          >
                            <RadioGroupItem value={repo.id} id={repo.id} className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor={repo.id} className="flex cursor-pointer items-center justify-between">
                                <span className="font-medium">{repo.fullName}</span>
                                {repo.private && (
                                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs">Private</span>
                                )}
                              </Label>
                              <p className="mt-1 text-sm text-muted-foreground">{repo.description}</p>
                              <div className="mt-2 flex items-center text-xs text-muted-foreground">
                                <span
                                  className="mr-3 h-2 w-2 rounded-full"
                                  style={{
                                    backgroundColor:
                                      repo.language === "TypeScript"
                                        ? "#3178c6"
                                        : repo.language === "JavaScript"
                                          ? "#f7df1e"
                                          : "#6e7681",
                                  }}
                                ></span>
                                <span>{repo.language}</span>
                                <span className="mx-2">•</span>
                                <span>{repo.updatedAt}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              </ScrollArea>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleContinue} disabled={!selectedRepo}>
                Continue
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "configure" && selectedRepository && (
          <>
            <DialogHeader>
              <DialogTitle>Configure Project</DialogTitle>
              <DialogDescription>Configure your project settings before deployment.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="flex items-center space-x-3 rounded-lg border p-3 bg-muted/30">
                <Github className="h-5 w-5" />
                <div>
                  <h3 className="font-medium">{selectedRepository.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedRepository.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="framework" className="text-base">
                    Framework
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    We've detected the following framework for your project.
                  </p>
                  <RadioGroup
                    id="framework"
                    value={framework}
                    onValueChange={setFramework}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:border-purple-600">
                      <RadioGroupItem value="next" id="next" />
                      <Label htmlFor="next" className="cursor-pointer">
                        Next.js
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:border-purple-600">
                      <RadioGroupItem value="react" id="react" />
                      <Label htmlFor="react" className="cursor-pointer">
                        React
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:border-purple-600">
                      <RadioGroupItem value="vue" id="vue" />
                      <Label htmlFor="vue" className="cursor-pointer">
                        Vue
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:border-purple-600">
                      <RadioGroupItem value="svelte" id="svelte" />
                      <Label htmlFor="svelte" className="cursor-pointer">
                        Svelte
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="root-directory" className="text-base">
                    Root Directory
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">The directory where your project is located.</p>
                  <Input id="root-directory" defaultValue="/" />
                </div>
              </div>
            </div>
            <DialogFooter className="flex items-center justify-between sm:justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleContinue}>Deploy</Button>
            </DialogFooter>
          </>
        )}

        {step === "deploying" && (
          <>
            <DialogHeader>
              <DialogTitle>Deploying Project</DialogTitle>
              <DialogDescription>We're setting up your project. This may take a few minutes.</DialogDescription>
            </DialogHeader>
            <div className="py-8 flex flex-col items-center justify-center">
              {isDeploying && deploymentProgress < 100 ? (
                <>
                  <div className="relative h-20 w-20 mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-medium">{Math.round(deploymentProgress)}%</span>
                    </div>
                  </div>
                  <div className="w-full max-w-md h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 transition-all duration-300 ease-in-out"
                      style={{ width: `${deploymentProgress}%` }}
                    ></div>
                  </div>
                  <div className="mt-6 space-y-2 w-full max-w-md">
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">Cloning repository</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">Installing dependencies</span>
                    </div>
                    <div className="flex items-center">
                      {deploymentProgress > 50 ? (
                        <Check className="h-4 w-4 text-green-600 mr-2" />
                      ) : (
                        <div className="h-4 w-4 mr-2 flex items-center justify-center">
                          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                        </div>
                      )}
                      <span className="text-sm">Building project</span>
                    </div>
                    <div className="flex items-center">
                      {deploymentProgress > 80 ? (
                        <Check className="h-4 w-4 text-green-600 mr-2" />
                      ) : (
                        <div className="h-4 w-4 mr-2"></div>
                      )}
                      <span className="text-sm">Deploying to production</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-green-100 p-3 mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Deployment Successful!</h3>
                  <p className="text-center text-muted-foreground mb-4">
                    Your project has been deployed and is now live.
                  </p>
                  <Button onClick={() => handleOpenChange(false)}>View Project</Button>
                </>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
