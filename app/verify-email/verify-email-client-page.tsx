"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function VerifyEmailClientPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Invalid verification link. Please check your email and try again.")
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (response.ok) {
          setStatus("success")
          setMessage(data.message)

          toast({
            title: "Email verified successfully!",
            description: "Welcome to DeployHub. You are now logged in.",
          })

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push("/dashboard")
            router.refresh()
          }, 2000)
        } else {
          setStatus("error")
          setMessage(data.error || "Verification failed")
        }
      } catch (error) {
        console.error("Verification error:", error)
        setStatus("error")
        setMessage("An error occurred during verification. Please try again.")
      }
    }

    verifyEmail()
  }, [token, router, toast])

  const getIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case "error":
        return <XCircle className="h-16 w-16 text-red-500" />
    }
  }

  const getTitle = () => {
    switch (status) {
      case "loading":
        return "Verifying your email..."
      case "success":
        return "Email verified successfully!"
      case "error":
        return "Verification failed"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md border-none bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">{getIcon()}</div>
          <CardTitle className="text-2xl font-bold">{getTitle()}</CardTitle>
          <CardDescription className="text-base">{message}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === "success" && (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">Redirecting to dashboard in a few seconds...</p>
              <Button onClick={() => router.push("/dashboard")} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/signup">
                    <Mail className="mr-2 h-4 w-4" />
                    Try signing up again
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/login">Back to login</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
