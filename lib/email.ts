import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string, name: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`
  const appName = process.env.APP_NAME || "DeployHub"
  const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev"

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: `Verify your email address - ${appName}`,
      html: generateVerificationEmailHtml(verificationUrl, name, appName),
    })

    if (error) {
      console.error("Resend error:", error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    console.log("Verification email sent successfully:", data)
    return data
  } catch (error) {
    console.error("Email sending error:", error)
    throw error
  }
}

export function generateVerificationEmailHtml(verificationUrl: string, name: string, appName = "DeployHub") {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .title {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .subtitle {
          color: #6b7280;
          font-size: 16px;
        }
        .content {
          margin: 30px 0;
        }
        .button {
          display: inline-block;
          background: #3b82f6;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          margin: 20px 0;
        }
        .button:hover {
          background: #2563eb;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
          text-align: center;
        }
        .link {
          color: #3b82f6;
          word-break: break-all;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">${appName}</div>
          <h1 class="title">Verify Your Email</h1>
          <p class="subtitle">Welcome to ${appName}! Please verify your email address to get started.</p>
        </div>
        
        <div class="content">
          <p>Hi ${name},</p>
          <p>Thank you for signing up for ${appName}! To complete your registration and start using your account, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>
          
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p><a href="${verificationUrl}" class="link">${verificationUrl}</a></p>
          
          <p><strong>Important:</strong> This verification link will expire in 1 hour for security reasons.</p>
          
          <p>If you didn't create an account with ${appName}, you can safely ignore this email.</p>
        </div>
        
        <div class="footer">
          <p>This email was sent by ${appName}. If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function sendEmail(options: {
  to: string
  subject: string
  html: string
}) {
  const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev"

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [options.to],
      subject: options.subject,
      html: options.html,
    })

    if (error) {
      console.error("Resend error:", error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("Email sending error:", error)
    throw error
  }
}
