import { Suspense } from "react"
import VerifyEmailClientPage from "./verify-email-client-page"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailClientPage />
      </Suspense>
    </div>
  )
}
