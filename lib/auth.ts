import "server-only"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET!

export interface User {
  id: number
  email: string
  name: string
  avatar_url?: string
  github_id?: string
  email_verified?: boolean
  email_verified_at?: Date
  password_hash?: string
  created_at: Date
  updated_at: Date
}

export interface SessionUser {
  id: number
  email: string
  name: string
  avatar_url?: string
}

// Create JWT token
export function createToken(user: SessionUser): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

// Verify JWT token
export function verifyToken(token: string): SessionUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      avatar_url: decoded.avatar_url,
    }
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

// Create user session
export async function createUserSession(user: SessionUser) {
  const token = createToken(user)
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  try {
    // Store session in database
    await sql`
    INSERT INTO sessions (id, user_id, token, expires_at, created_at, updated_at)
    VALUES (${sessionId}, ${user.id}, ${token}, ${expiresAt}, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
      token = EXCLUDED.token,
      expires_at = EXCLUDED.expires_at,
      updated_at = NOW()
  `

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    })

    console.log("Session created successfully:", { sessionId, userId: user.id })
  } catch (error) {
    console.error("Failed to create session:", error)
    throw new Error("Failed to create session")
  }
}

// Get current user from session
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session")?.value

    if (!sessionId) {
      console.log("No session cookie found")
      return null
    }

    // Get session from database
    const sessions = await sql`
    SELECT s.token, s.expires_at, u.id, u.email, u.name, u.avatar_url
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.id = ${sessionId} AND s.expires_at > NOW()
  `

    if (sessions.length === 0) {
      console.log("No valid session found in database")
      return null
    }

    const session = sessions[0]

    // Verify token
    const user = verifyToken(session.token)
    if (!user) {
      console.log("Token verification failed")
      return null
    }

    console.log("User authenticated successfully:", { id: user.id, email: user.email })
    return user
  } catch (error) {
    console.error("Failed to get current user:", error)
    return null
  }
}

// Login with email and password
export async function loginUser(email: string, password: string): Promise<User> {
  const users = await sql`
  SELECT * FROM users WHERE email = ${email}
`

  if (users.length === 0) {
    throw new Error("Invalid credentials")
  }

  const user = users[0] as User

  if (!user.password_hash) {
    throw new Error("Please use GitHub login for this account")
  }

  const isValid = await bcrypt.compare(password, user.password_hash)
  if (!isValid) {
    throw new Error("Invalid credentials")
  }

  return user
}

// Register new user (now only used for GitHub OAuth)
export async function registerUser(email: string, password: string, name: string): Promise<User> {
  // Check if user already exists
  const existingUsers = await sql`
  SELECT id FROM users WHERE email = ${email}
`

  if (existingUsers.length > 0) {
    throw new Error("User already exists")
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12)

  // Create user with email verification required
  const users = await sql`
  INSERT INTO users (email, password_hash, name, email_verified, created_at, updated_at)
  VALUES (${email}, ${passwordHash}, ${name}, false, NOW(), NOW())
  RETURNING *
`

  return users[0] as User
}

// Login or create user with GitHub
export async function loginWithGithub(githubUser: {
  id: string
  email: string
  name: string
  avatar_url: string
  login: string
}): Promise<User> {
  try {
    console.log("Attempting GitHub login for:", githubUser.email)

    // Check if user exists by email or GitHub ID
    const existingUsers = await sql`
    SELECT * FROM users 
    WHERE email = ${githubUser.email} OR github_id = ${githubUser.id}
  `

    if (existingUsers.length > 0) {
      const user = existingUsers[0] as User
      console.log("Existing user found:", user.id)

      // Update GitHub info if not set and mark email as verified
      if (!user.github_id) {
        await sql`
        UPDATE users 
        SET github_id = ${githubUser.id}, 
            avatar_url = ${githubUser.avatar_url},
            email_verified = true,
            email_verified_at = NOW(),
            updated_at = NOW()
        WHERE id = ${user.id}
      `
        console.log("Updated existing user with GitHub info")
      }

      return user
    }

    // Create new user (GitHub users are automatically verified)
    console.log("Creating new user from GitHub data")
    const newUsers = await sql`
    INSERT INTO users (email, name, github_id, avatar_url, email_verified, email_verified_at, created_at, updated_at)
    VALUES (${githubUser.email}, ${githubUser.name}, ${githubUser.id}, ${githubUser.avatar_url}, true, NOW(), NOW(), NOW())
    RETURNING *
  `

    const newUser = newUsers[0] as User
    console.log("New user created:", newUser.id)
    return newUser
  } catch (error) {
    console.error("GitHub login error:", error)
    throw new Error("Failed to login with GitHub")
  }
}

// Logout user
export async function logoutUser() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session")?.value

    if (sessionId) {
      // Delete session from database
      await sql`DELETE FROM sessions WHERE id = ${sessionId}`
    }

    // Clear cookie
    cookieStore.delete("session")
  } catch (error) {
    console.error("Logout error:", error)
  }
}

// Alias so other modules can import { logout }
export const logout = logoutUser
