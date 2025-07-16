"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SessionDebugInfo {
  authenticated: boolean
  user: any
  sessionCookie: string | null
  sessionInfo: any
  timestamp: string
}

export function SessionDebug() {
  const [debugInfo, setDebugInfo] = useState<SessionDebugInfo | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchDebugInfo = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/session")
      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      console.error("Failed to fetch debug info:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugInfo()
  }, [])

  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <Card className="mt-8 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm text-yellow-800">Session Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button onClick={fetchDebugInfo} disabled={loading} size="sm">
          {loading ? "Loading..." : "Refresh"}
        </Button>

        {debugInfo && (
          <div className="text-xs space-y-2">
            <div>
              <strong>Authenticated:</strong> {debugInfo.authenticated ? "Yes" : "No"}
            </div>

            {debugInfo.user && (
              <div>
                <strong>User:</strong> {debugInfo.user.name} ({debugInfo.user.email})
              </div>
            )}

            <div>
              <strong>Session Cookie:</strong> {debugInfo.sessionCookie || "None"}
            </div>

            {debugInfo.sessionInfo && (
              <div>
                <strong>Session DB:</strong> Expires {new Date(debugInfo.sessionInfo.expires_at).toLocaleString()}
              </div>
            )}

            <div>
              <strong>Timestamp:</strong> {new Date(debugInfo.timestamp).toLocaleString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
