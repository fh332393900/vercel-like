import { kv } from "@vercel/kv"

export interface PendingUser {
  name: string
  email: string
  passwordHash: string
  createdAt: string
}

export async function storePendingUser(token: string, userData: PendingUser): Promise<void> {
  try {
    // Store with 1 hour expiration (3600 seconds)
    await kv.setex(`pending_user:${token}`, 3600, JSON.stringify(userData))
    console.log("Pending user stored in Redis:", { token: token.substring(0, 10) + "...", email: userData.email })
  } catch (error) {
    console.error("Failed to store pending user in Redis:", error)
    throw new Error("Failed to store registration data")
  }
}

export async function getPendingUser(token: string): Promise<PendingUser | null> {
  try {
    const data = await kv.get(`pending_user:${token}`)

    if (!data) {
      console.log("No pending user found for token:", token.substring(0, 10) + "...")
      return null
    }

    const userData = typeof data === "string" ? JSON.parse(data) : (data as PendingUser)
    console.log("Retrieved pending user from Redis:", { email: userData.email })
    return userData
  } catch (error) {
    console.error("Failed to retrieve pending user from Redis:", error)
    return null
  }
}

export async function deletePendingUser(token: string): Promise<void> {
  try {
    await kv.del(`pending_user:${token}`)
    console.log("Deleted pending user from Redis:", token.substring(0, 10) + "...")
  } catch (error) {
    console.error("Failed to delete pending user from Redis:", error)
    // Don't throw error here as it's not critical
  }
}
