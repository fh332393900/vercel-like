import { Suspense } from "react"
import VerifyEmailClientPage from "./verify-email-client-page"

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailClientPage />
    </Suspense>
  )
}
