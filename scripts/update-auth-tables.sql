-- Update users table to ensure email_verified column exists
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- Update existing GitHub users to have verified emails
UPDATE users 
SET email_verified = TRUE 
WHERE github_id IS NOT NULL AND email_verified IS NULL;

-- Update existing regular users to have unverified emails by default
UPDATE users 
SET email_verified = FALSE 
WHERE github_id IS NULL AND email_verified IS NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);
CREATE INDEX IF NOT EXISTS idx_users_github_id ON users(github_id);
