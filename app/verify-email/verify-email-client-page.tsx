"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function VerifyEmailClientPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("No verification token provided")
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await response.json()

        if (response.ok) {
          setStatus("success")
          setMessage("Email verified successfully! Redirecting to dashboard...")
          setTimeout(() => {
            router.push("/dashboard")
          }, 2000)
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
  }, [token, router])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          {status === "loading" && (
            <div className="bg-blue-100 rounded-full p-3">
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            </div>
          )}
          {status === "success" && (
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          )}
          {status === "error" && (
            <div className="bg-red-100 rounded-full p-3">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          )}
        </div>
        <CardTitle>
          {status === "loading" && "Verifying Email..."}
          {status === "success" && "Email Verified!"}
          {status === "error" && "Verification Failed"}
        </CardTitle>
        <CardDescription>
          {status === "loading" && "Please wait while we verify your email address."}
          {status === "success" && "Your account has been successfully verified."}
          {status === "error" && "We couldn't verify your email address."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant={status === "error" ? "destructive" : "default"}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
        {status === "error" && (
          <div className="mt-4 space-y-2">
            <Button onClick={() => router.push("/signup")} className="w-full">
              Try Registering Again
            </Button>
            <Button variant="outline" onClick={() => router.push("/login")} className="w-full">
              Back to Login
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
