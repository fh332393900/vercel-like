import type { Metadata } from "next"
import Link from "next/link"
import { Rocket } from "lucide-react"

import { AuthForm } from "@/components/auth/auth-form"

export const metadata: Metadata = {
  title: "Sign Up | DeployHub",
  description: "Create a new DeployHub account",
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]"></div>
        <div className="absolute h-[40rem] w-[40rem] -translate-y-1/2 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl filter animate-blob"></div>
        <div className="absolute right-0 top-0 h-[30rem] w-[30rem] translate-x-1/3 -translate-y-1/4 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-3xl filter animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 h-[35rem] w-[35rem] translate-y-1/4 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-3xl filter animate-blob animation-delay-4000"></div>
      </div>

      <Link href="/" className="absolute left-8 top-8 flex items-center gap-2 transition-transform hover:scale-105">
        <Rocket className="h-6 w-6 text-purple-600 animate-pulse" />
        <span className="text-xl font-bold">DeployHub</span>
      </Link>

      <div className="relative z-10 w-full max-w-md p-4">
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-500/10 blur-2xl"></div>

        <AuthForm mode="signup" />
      </div>
    </div>
  )
}
