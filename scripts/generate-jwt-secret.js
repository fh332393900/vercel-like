// 运行这个脚本来生成安全的 JWT_SECRET
// 使用命令: node scripts/generate-jwt-secret.js

const crypto = require("crypto")

function generateJWTSecret() {
  // 方法1: 使用 crypto.randomBytes (推荐)
  const secret1 = crypto.randomBytes(64).toString("hex")

  // 方法2: 使用 crypto.randomUUID 组合
  const secret2 = crypto.randomUUID() + crypto.randomUUID() + crypto.randomUUID()

  // 方法3: 使用 base64 编码
  const secret3 = crypto.randomBytes(64).toString("base64")

  console.log("🔐 JWT Secret 生成器")
  console.log("==================")
  console.log("")
  console.log("方法1 (推荐 - Hex编码):")
  console.log(`JWT_SECRET="${secret1}"`)
  console.log("")
  console.log("方法2 (UUID组合):")
  console.log(`JWT_SECRET="${secret2}"`)
  console.log("")
  console.log("方法3 (Base64编码):")
  console.log(`JWT_SECRET="${secret3}"`)
  console.log("")
  console.log("💡 建议使用方法1的密钥，将其添加到你的 .env.local 文件中")
  console.log("⚠️  注意：请妥善保管这个密钥，不要提交到版本控制系统")
}

generateJWTSecret()
