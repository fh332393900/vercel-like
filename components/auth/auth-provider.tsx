"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  avatar: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated on initial load
    const checkAuth = () => {
      const isAuth = localStorage.getItem("isAuthenticated") === "true"
      const userData = localStorage.getItem("user")

      if (isAuth && userData) {
        setUser(JSON.parse(userData))
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Redirect to login if not authenticated and trying to access protected routes
  useEffect(() => {
    if (!isLoading && !user) {
      const protectedRoutes = ["/dashboard", "/profile", "/settings", "/analytics"]
      const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

      if (isProtectedRoute) {
        router.push("/login")
      }
    }
  }, [isLoading, user, pathname, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      // In a real app, this would call an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser = {
        id: "user-1",
        name: "Jane Doe",
        email,
        avatar: "/placeholder.svg?height=40&width=40",
      }

      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("user", JSON.stringify(mockUser))

      setUser(mockUser)
      router.push("/dashboard")
    } catch (error) {
      throw new Error("Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
