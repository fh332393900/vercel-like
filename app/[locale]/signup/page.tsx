import type { Metadata } from "next"
import SignupClientPage from "./signup-client-page"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Sign Up | DeployHub",
  description: "Create a new DeployHub account",
}

export default function SignupPage() {
  return <SignupClientPage />
}
