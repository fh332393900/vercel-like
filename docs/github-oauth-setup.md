# GitHub OAuth Setup Guide

Follow these steps to set up GitHub OAuth for your DeployHub application.

## 1. Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: `DeployHub` (or your preferred name)
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Application description**: `A Vercel-like deployment platform`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/github/callback`

4. Click "Register application"

## 2. Get Your OAuth Credentials

After creating the app, you'll see:
- **Client ID**: Copy this value
- **Client Secret**: Click "Generate a new client secret" and copy the value

## 3. Configure Environment Variables

Add these to your `.env.local` file:

\`\`\`env
GITHUB_CLIENT_ID="your_client_id_here"
GITHUB_CLIENT_SECRET="your_client_secret_here"
GITHUB_REDIRECT_URI="http://localhost:3000/api/auth/github/callback"
\`\`\`

## 4. Production Setup

For production deployment:

1. Update your GitHub OAuth app settings:
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: `https://your-domain.com/api/auth/github/callback`

2. Update environment variables:
   \`\`\`env
   GITHUB_REDIRECT_URI="https://your-domain.com/api/auth/github/callback"
   NEXT_PUBLIC_APP_URL="https://your-domain.com"
   \`\`\`

## 5. Testing

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/login`
3. Click "Sign in with GitHub"
4. Authorize the application
5. You should be redirected to the dashboard

## Security Features

- **State parameter**: Prevents CSRF attacks
- **Secure cookies**: HTTP-only, secure in production
- **Email verification**: Requires verified email from GitHub
- **Error handling**: Comprehensive error messages and logging

## Troubleshooting

### Common Issues

1. **"Application not found"**: Check your Client ID
2. **"Bad verification code"**: Check your Client Secret
3. **"Redirect URI mismatch"**: Ensure the callback URL matches exactly
4. **"No email found"**: User's GitHub email must be public or verified

### Debug Mode

Enable debug logging by adding to your environment:
\`\`\`env
DEBUG=github-oauth
