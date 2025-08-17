import type { Metadata } from "next"
import VerifyEmailClientPage from "./verify-email-client-page"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Verify Email | DeployHub",
  description: "Verify your email address to complete registration",
}

export default function VerifyEmailPage() {
  return <VerifyEmailClientPage />
}
