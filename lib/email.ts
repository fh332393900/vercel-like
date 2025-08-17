import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable is not set")
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string, name: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev"
  const appName = process.env.APP_NAME || "DeployHub"

  const verificationUrl = `${appUrl}/verify-email?token=${token}`

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: `Welcome to ${appName} - Verify your email`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify your email</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                text-align: center;
                padding: 20px 0;
                border-bottom: 1px solid #eee;
              }
              .content {
                padding: 30px 0;
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #7c3aed;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 500;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                padding: 20px 0;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 14px;
              }
              .code {
                background-color: #f5f5f5;
                padding: 2px 6px;
                border-radius: 4px;
                font-family: monospace;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${appName}</h1>
            </div>
            
            <div class="content">
              <h2>Welcome to ${appName}, ${name}!</h2>
              
              <p>Thank you for signing up! To complete your registration and start using ${appName}, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
              <p class="code">${verificationUrl}</p>
              
              <p><strong>Important:</strong> This verification link will expire in 1 hour for security reasons.</p>
              
              <p>If you didn't create an account with ${appName}, you can safely ignore this email.</p>
            </div>
            
            <div class="footer">
              <p>This email was sent by ${appName}</p>
              <p>If you have any questions, please contact our support team.</p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error("Failed to send email:", error)
      throw new Error(`Failed to send verification email: ${error.message}`)
    }

    console.log("Verification email sent successfully:", data)
    return data
  } catch (error) {
    console.error("Email sending error:", error)
    throw error
  }
}
