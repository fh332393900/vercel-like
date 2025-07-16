"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SessionDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkSession = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/session")
      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      console.error("Debug error:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkUserMe = async () => {
    try {
      const response = await fetch("/api/user/me")
      const data = await response.json()
      console.log("User me response:", data)
      setDebugInfo((prev) => ({ ...prev, userMeResponse: data }))
    } catch (error) {
      console.error("User me error:", error)
    }
  }

  useEffect(() => {
    checkSession()
  }, [])

  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Session Debug (Development Only)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={checkSession} disabled={loading} size="sm">
            Check Session
          </Button>
          <Button onClick={checkUserMe} size="sm" variant="outline">
            Test /api/user/me
          </Button>
        </div>

        {debugInfo && (
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
        )}
      </CardContent>
    </Card>
  )
}
