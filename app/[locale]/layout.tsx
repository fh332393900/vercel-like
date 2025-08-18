import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth/auth-provider"
import {NextIntlClientProvider} from 'next-intl'
import {notFound} from 'next/navigation'
import { getMessages } from "next-intl/server"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DeployHub - Deploy your code with confidence",
  description: "A Vercel-like deployment platform for your projects",
    generator: 'v0.app'
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode,
  params: any;
}>) {
  const { locale } = await params;
  const messages = await getMessages()
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
