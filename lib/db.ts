import "server-only"
import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Export query as an alias for sql for compatibility
export const query = sql

// Test database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`
    console.log("Database connected successfully:", result[0].current_time)
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

// Database utility functions
export async function createUser(userData: {
  email: string
  name: string
  passwordHash?: string
  githubId?: string
  avatarUrl?: string
  emailVerified?: boolean
}) {
  const [user] = await sql`
    INSERT INTO users (email, name, password_hash, github_id, avatar_url, email_verified)
    VALUES (${userData.email}, ${userData.name}, ${userData.passwordHash || null}, ${userData.githubId || null}, ${userData.avatarUrl || null}, ${userData.emailVerified || !!userData.githubId})
    RETURNING id, email, name, avatar_url, github_id, email_verified, created_at
  `
  return user
}

export async function getUserByEmail(email: string) {
  const [user] = await sql`
    SELECT id, email, name, password_hash, avatar_url, github_id, email_verified, created_at
    FROM users 
    WHERE email = ${email}
  `
  return user
}

export async function getUserById(id: string) {
  const [user] = await sql`
    SELECT id, email, name, avatar_url, github_id, email_verified, created_at
    FROM users 
    WHERE id = ${id}
  `
  return user
}

export async function getUserByGithubId(githubId: string) {
  const [user] = await sql`
    SELECT id, email, name, avatar_url, github_id, email_verified, created_at
    FROM users 
    WHERE github_id = ${githubId}
  `
  return user
}

export async function createSession(userId: string, token: string, expiresAt: Date) {
  try {
    console.log("Creating session in database:", { userId, expiresAt: expiresAt.toISOString() })

    const [session] = await sql`
      INSERT INTO sessions (user_id, token, expires_at)
      VALUES (${userId}, ${token}, ${expiresAt.toISOString()})
      RETURNING id, token, expires_at
    `

    console.log("Session created successfully:", { id: session.id })
    return session
  } catch (error) {
    console.error("Error creating session in database:", error)
    throw error
  }
}

export async function getSessionByToken(token: string) {
  try {
    console.log("Querying session by token:", token.substring(0, 10) + "...")

    // Use token field instead of id field for session lookup
    const [session] = await sql`
      SELECT s.id, s.user_id, s.token, s.expires_at, u.email, u.name, u.avatar_url, u.github_id, u.email_verified
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ${token} AND s.expires_at > NOW()
    `

    console.log("Session query result:", session ? "found" : "not found")
    if (session) {
      console.log("Session details:", {
        user_id: session.user_id,
        expires_at: session.expires_at,
        email: session.email,
      })
    }

    return session
  } catch (error) {
    console.error("Error querying session:", error)
    throw error
  }
}

export async function deleteSession(token: string) {
  await sql`
    DELETE FROM sessions 
    WHERE token = ${token}
  `
}

export async function updateUser(
  id: string,
  updates: {
    name?: string
    email?: string
    avatarUrl?: string
  },
) {
  const setClause = []
  const values = []

  if (updates.name) {
    setClause.push("name = $" + (values.length + 2))
    values.push(updates.name)
  }
  if (updates.email) {
    setClause.push("email = $" + (values.length + 2))
    values.push(updates.email)
  }
  if (updates.avatarUrl) {
    setClause.push("avatar_url = $" + (values.length + 2))
    values.push(updates.avatarUrl)
  }

  if (setClause.length === 0) return null

  const [user] = await sql`
    UPDATE users 
    SET ${sql.unsafe(setClause.join(", "))}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, email, name, avatar_url, email_verified
  `
  return user
}

export async function getUserProjects(userId: string) {
  const projects = await sql`
    SELECT p.*, COUNT(d.id) as deployment_count
    FROM projects p
    LEFT JOIN deployments d ON p.id = d.project_id
    WHERE p.user_id = ${userId}
    GROUP BY p.id
    ORDER BY p.updated_at DESC
  `
  return projects
}

export async function createProject(projectData: {
  userId: string
  name: string
  repository: string
  domain?: string
  framework?: string
}) {
  const [project] = await sql`
    INSERT INTO projects (user_id, name, repository, domain, framework)
    VALUES (${projectData.userId}, ${projectData.name}, ${projectData.repository}, ${projectData.domain || null}, ${projectData.framework || null})
    RETURNING *
  `
  return project
}
