import "server-only"

interface EmailData {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailData) {
  // 使用Resend发送邮件
  const RESEND_API_KEY = process.env.RESEND_API_KEY

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured")
    throw new Error("Email service not configured")
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DeployHub <noreply@deployhub.dev>",
        to: [to],
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Failed to send email:", error)
      throw new Error("Failed to send email")
    }

    const result = await response.json()
    console.log("Email sent successfully:", result.id)
    return result
  } catch (error) {
    console.error("Email sending error:", error)
    throw error
  }
}

export function generateVerificationEmailHtml(verificationUrl: string, name: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - DeployHub</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to DeployHub!</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
        <h2 style="color: #333; margin-top: 0;">Hi ${name},</h2>
        
        <p style="font-size: 16px; margin-bottom: 25px;">
          Thank you for signing up for DeployHub! To complete your registration and start deploying your projects, please verify your email address.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    font-weight: bold; 
                    font-size: 16px; 
                    display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 25px;">
          If the button doesn't work, you can also copy and paste this link into your browser:
        </p>
        <p style="font-size: 14px; color: #667eea; word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">
          ${verificationUrl}
        </p>
        
        <p style="font-size: 14px; color: #666; margin-top: 25px;">
          This verification link will expire in 1 hour for security reasons.
        </p>
        
        <p style="font-size: 14px; color: #666; margin-top: 25px;">
          If you didn't create an account with DeployHub, you can safely ignore this email.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>© 2024 DeployHub. All rights reserved.</p>
      </div>
    </body>
    </html>
  `
}
