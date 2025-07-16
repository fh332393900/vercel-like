import { type NextRequest, NextResponse } from "next/server"
import { getSessionByToken } from "./lib/db"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes, static files, and auth pages
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname === "/" ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Check for session token
  const sessionToken = request.cookies.get("session")?.value

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    // Verify session
    const session = await getSessionByToken(sessionToken)

    if (!session) {
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("session")
      return response
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("session")
    return response
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|signup|$).*)"],
}
