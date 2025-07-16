"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Github, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AuthFormProps {
  mode: "login" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isGithubLoading, setIsGithubLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })

  const error = searchParams.get("error")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register"
      const body =
        mode === "login"
          ? { email: formData.email, password: formData.password }
          : { email: formData.email, password: formData.password, name: formData.name }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed")
      }

      toast({
        title: mode === "login" ? "Login successful" : "Account created",
        description: mode === "login" ? "Welcome back to DeployHub!" : "Your account has been created successfully.",
      })

      // Redirect to dashboard
      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubAuth = async () => {
    setIsGithubLoading(true)
    try {
      // Redirect to GitHub OAuth
      window.location.href = "/api/auth/github"
    } catch (error) {
      toast({
        title: "GitHub authentication failed",
        description: "Unable to connect to GitHub. Please try again.",
        variant: "destructive",
      })
      setIsGithubLoading(false)
    }
  }

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "github_auth_failed":
        return "GitHub authentication failed. Please try again."
      case "github_email_required":
        return "GitHub account must have a public email address."
      case "access_denied":
        return "GitHub access was denied. Please try again."
      default:
        return "An error occurred during authentication."
    }
  }

  return (
    <Card className="w-full max-w-md border-none bg-white/80 backdrop-blur-sm shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">{mode === "login" ? "Welcome Back" : "Create an Account"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Sign in to your account to access your projects"
            : "Sign up for DeployHub to start deploying your projects"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{getErrorMessage(error)}</AlertDescription>
          </Alert>
        )}

        {/* GitHub OAuth Button */}
        <Button
          variant="outline"
          className="w-full gap-2 bg-black text-white hover:bg-gray-800 border-black mb-4"
          onClick={handleGithubAuth}
          disabled={isLoading || isGithubLoading}
        >
          {isGithubLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
          {mode === "login" ? "Sign in with GitHub" : "Sign up with GitHub"}
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading || isGithubLoading}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading || isGithubLoading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {mode === "login" && (
                <Link href="/forgot-password" className="text-xs text-purple-600 hover:text-purple-700">
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading || isGithubLoading}
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || isGithubLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || isGithubLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "login" ? "Signing in..." : "Creating account..."}
              </>
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <Link
            href={mode === "login" ? "/signup" : "/login"}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
