import type { Metadata } from "next"

import LoginClientPage from "./login-client-page"

export const metadata: Metadata = {
  title: "Login | DeployHub",
  description: "Login to your DeployHub account",
}

export default function LoginPage() {
  return <LoginClientPage />
}
