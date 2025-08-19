import createIntlMiddleware from "next-intl/middleware"
import { type NextRequest, NextResponse } from "next/server"
import { getSessionByToken } from "./lib/db"
import { locales } from './i18n/config'

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
})

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle internationalization for all routes first
  const response = intlMiddleware(request)
  // Skip auth middleware for API routes, static files, and auth pages
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes("/login") ||
    pathname.includes("/signup") ||
    pathname.includes("/verify-email") ||
    pathname.includes("/forgot-password") ||
    pathname === "/" ||
    locales.some((locale) => pathname === `/${locale}`) ||
    pathname.includes(".")
  ) {
    return response
  }

  // Extract locale from pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  )

  // If pathname is missing locale, let intl middleware handle it
  if (pathnameIsMissingLocale) {
    return response
  }

  // Check for session token for protected routes
  const sessionToken = request.cookies.get("session")?.value

  if (!sessionToken) {
    // Extract locale from current path to maintain it in redirect
    const locale = pathname.split("/")[1]
    const loginUrl = new URL(`/${locale}/login`, request.url)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Verify session
    const session = await getSessionByToken(sessionToken)

    if (!session) {
      const locale = pathname.split("/")[1]
      const loginUrl = new URL(`/${locale}/login`, request.url)
      const redirectResponse = NextResponse.redirect(loginUrl)
      redirectResponse.cookies.delete("session")
      return redirectResponse
    }

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    const locale = pathname.split("/")[1]
    const loginUrl = new URL(`/${locale}/login`, request.url)
    const redirectResponse = NextResponse.redirect(loginUrl)
    redirectResponse.cookies.delete("session")
    return redirectResponse
  }
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
