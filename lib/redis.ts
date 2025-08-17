interface PendingUser {
  name: string
  email: string
  passwordHash: string
  createdAt: string
}

export async function storePendingUser(token: string, userData: PendingUser): Promise<void> {
  try {
    const response = await fetch(`${process.env.KV_REST_API_URL}/set/${encodeURIComponent(`pending:${token}`)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: JSON.stringify(userData),
        ex: 3600, // 1 hour expiry
      }),
    })

    if (!response.ok) {
      throw new Error(`Redis error: ${response.status} ${response.statusText}`)
    }

    console.log("Stored pending user in Redis:", { token: token.substring(0, 10) + "...", email: userData.email })
  } catch (error) {
    console.error("Error storing pending user:", error)
    throw error
  }
}

export async function getPendingUser(token: string): Promise<PendingUser | null> {
  try {
    const response = await fetch(`${process.env.KV_REST_API_URL}/get/${encodeURIComponent(`pending:${token}`)}`, {
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Redis error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    if (!data.result) {
      return null
    }

    const userData = JSON.parse(data.result)
    console.log("Retrieved pending user from Redis:", { token: token.substring(0, 10) + "...", email: userData.email })
    return userData
  } catch (error) {
    console.error("Error getting pending user:", error)
    throw error
  }
}

export async function deletePendingUser(token: string): Promise<void> {
  try {
    const response = await fetch(`${process.env.KV_REST_API_URL}/del/${encodeURIComponent(`pending:${token}`)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Redis error: ${response.status} ${response.statusText}`)
    }

    console.log("Deleted pending user from Redis:", { token: token.substring(0, 10) + "..." })
  } catch (error) {
    console.error("Error deleting pending user:", error)
    throw error
  }
}

export async function setWithExpiry(key: string, value: any, expirySeconds: number): Promise<void> {
  try {
    const response = await fetch(`${process.env.KV_REST_API_URL}/set/${encodeURIComponent(key)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: JSON.stringify(value),
        ex: expirySeconds,
      }),
    })

    if (!response.ok) {
      throw new Error(`Redis error: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error("Error setting value with expiry:", error)
    throw error
  }
}

export async function getValue(key: string): Promise<any> {
  try {
    const response = await fetch(`${process.env.KV_REST_API_URL}/get/${encodeURIComponent(key)}`, {
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Redis error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.result ? JSON.parse(data.result) : null
  } catch (error) {
    console.error("Error getting value:", error)
    throw error
  }
}
