import "server-only"

// 使用Upstash KV
const KV_REST_API_URL = process.env.KV_REST_API_URL!
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN!

if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
  throw new Error("KV_REST_API_URL and KV_REST_API_TOKEN must be set")
}

interface KVResponse<T = any> {
  result: T
}

async function kvRequest(command: string[], method: "GET" | "POST" = "POST") {
  const response = await fetch(KV_REST_API_URL, {
    method,
    headers: {
      Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  })

  if (!response.ok) {
    throw new Error(`KV request failed: ${response.statusText}`)
  }

  return response.json()
}

export async function setWithExpiry(key: string, value: any, expirySeconds: number) {
  const command = ["SET", key, JSON.stringify(value), "EX", expirySeconds.toString()]
  return kvRequest(command)
}

export async function get<T = any>(key: string): Promise<T | null> {
  const command = ["GET", key]
  const response: KVResponse<string | null> = await kvRequest(command)

  if (response.result === null) {
    return null
  }

  try {
    return JSON.parse(response.result)
  } catch {
    return response.result as T
  }
}

export async function del(key: string) {
  const command = ["DEL", key]
  return kvRequest(command)
}

export async function exists(key: string): Promise<boolean> {
  const command = ["EXISTS", key]
  const response: KVResponse<number> = await kvRequest(command)
  return response.result === 1
}
