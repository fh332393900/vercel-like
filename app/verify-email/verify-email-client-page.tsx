"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

export default function VerifyEmailClientPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const { refreshUser } = useAuth()

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      setStatus("error")
      setMessage("Invalid verification link. Please check your email and try again.")
      return
    }

    // Verify email
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await response.json()


        if (response.ok) {
          setStatus("success")
          setMessage(data.message)
          
          // Redirect to dashboard after 3 seconds
          setTimeout(async () => {
            await refreshUser()
            router.push("/dashboard")
          }, 3000)
        } else {
          setStatus("error")
          setMessage(data.error || "Failed to verify email")
        }
      } catch (error) {
        console.error("Verification error:", error)
        setStatus("error")
        setMessage("Network error. Please try again.")
      }
    }

    verifyEmail()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === "loading" && <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />}
            {status === "success" && <CheckCircle className="h-16 w-16 text-green-500" />}
            {status === "error" && <XCircle className="h-16 w-16 text-red-500" />}
          </div>
          <CardTitle className="text-2xl font-bold">
            {status === "loading" && "Verifying your email..."}
            {status === "success" && "Email verified!"}
            {status === "error" && "Verification failed"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Please wait while we verify your email address."}
            {status === "success" && "Your account has been successfully created and verified."}
            {status === "error" && "There was a problem verifying your email address."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert variant={status === "error" ? "destructive" : "default"}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>

          {status === "success" && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                You will be automatically redirected to your dashboard in a few seconds.
              </p>
              <Button onClick={() => router.push("/dashboard")} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-2">
              <Button onClick={() => router.push("/signup")} className="w-full">
                Try signing up again
              </Button>
              <Button variant="outline" onClick={() => router.push("/login")} className="w-full">
                Back to login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
