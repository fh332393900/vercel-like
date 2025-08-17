-- Add email verification columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP;

-- Update existing users to have email_verified = true if they have github_id
UPDATE users 
SET email_verified = TRUE, email_verified_at = NOW() 
WHERE github_id IS NOT NULL AND email_verified IS FALSE;

-- Create index for email verification lookups
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Update sessions table to use TEXT for token instead of UUID
-- First, drop the existing sessions table if it exists
DROP TABLE IF EXISTS sessions CASCADE;

-- Recreate sessions table with proper token field
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for sessions
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
