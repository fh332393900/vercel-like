import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import {
  createUser,
  getUserByEmail,
  getUserByGithubId,
  createSession,
  getSessionByToken,
  deleteSession,
  sql,
} from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  github_id?: string
  email_verified: boolean
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(): string {
  return jwt.sign({ timestamp: Date.now() }, JWT_SECRET)
}

export async function createUserSession(user: User): Promise<string> {
  const token = generateToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  console.log("Creating session for user:", user.id, "token:", token.substring(0, 10) + "...")

  try {
    await createSession(user.id, token, expiresAt)
    console.log("Session created in database")

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    })

    console.log("Session cookie set")
    return token
  } catch (error) {
    console.error("Error creating session:", error)
    throw error
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value

    console.log("Getting current user, session token:", sessionToken ? "exists" : "missing")

    if (!sessionToken) {
      console.log("No session token found")
      return null
    }

    const session = await getSessionByToken(sessionToken)
    console.log("Session query result:", session ? "found" : "not found")

    if (!session) {
      console.log("Session not found or expired")
      return null
    }

    const user = {
      id: session.user_id,
      email: session.email,
      name: session.name,
      avatar_url: session.avatar_url,
      github_id: session.github_id,
      email_verified: session.email_verified,
    }

    console.log("Returning user:", { id: user.id, email: user.email })
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session")?.value

  if (sessionToken) {
    await deleteSession(sessionToken)
  }

  cookieStore.delete("session")
}

export async function registerUser(email: string, password: string, name: string): Promise<User> {
  // Check if user already exists
  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash password
  const passwordHash = await hashPassword(password)

  // Create user
  const user = await createUser({
    email,
    name,
    passwordHash,
  })

  return user
}

export async function loginUser(email: string, password: string): Promise<User> {
  const user = await getUserByEmail(email)

  if (!user || !user.password_hash) {
    throw new Error("Invalid credentials")
  }

  const isValidPassword = await verifyPassword(password, user.password_hash)

  if (!isValidPassword) {
    throw new Error("Invalid credentials")
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar_url: user.avatar_url,
    github_id: user.github_id,
    email_verified: user.email_verified,
  }
}

export async function loginWithGithub(githubUser: {
  id: string
  email: string
  name: string
  avatar_url: string
  login?: string
}): Promise<User> {
  try {
    // Check if user exists by GitHub ID
    let user = await getUserByGithubId(githubUser.id)

    if (!user) {
      // Check if user exists by email
      user = await getUserByEmail(githubUser.email)

      if (user) {
        // Update existing user with GitHub info
        await sql`
          UPDATE users 
          SET github_id = ${githubUser.id}, avatar_url = ${githubUser.avatar_url}, email_verified = true, updated_at = NOW()
          WHERE id = ${user.id}
        `

        // Fetch updated user
        user = await getUserByGithubId(githubUser.id)
      } else {
        // Create new user
        user = await createUser({
          email: githubUser.email,
          name: githubUser.name,
          githubId: githubUser.id,
          avatarUrl: githubUser.avatar_url,
        })
      }
    } else {
      // Update existing GitHub user's info
      await sql`
        UPDATE users 
        SET name = ${githubUser.name}, avatar_url = ${githubUser.avatar_url}, email = ${githubUser.email}, updated_at = NOW()
        WHERE github_id = ${githubUser.id}
      `

      // Fetch updated user
      user = await getUserByGithubId(githubUser.id)
    }

    if (!user) {
      throw new Error("Failed to create or update user")
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      github_id: user.github_id,
      email_verified: user.email_verified,
    }
  } catch (error) {
    console.error("Error in loginWithGithub:", error)
    throw new Error("Failed to authenticate with GitHub")
  }
}
