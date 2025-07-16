-- Check all sessions
SELECT 
  s.id,
  s.user_id,
  u.email,
  u.name,
  s.expires_at,
  s.created_at,
  CASE 
    WHEN s.expires_at > NOW() THEN 'Active'
    ELSE 'Expired'
  END as status
FROM sessions s
JOIN users u ON s.user_id = u.id
ORDER BY s.created_at DESC;

-- Check users with GitHub info
SELECT 
  id,
  email,
  name,
  github_id,
  avatar_url,
  created_at
FROM users
ORDER BY created_at DESC;

-- Clean up expired sessions
DELETE FROM sessions WHERE expires_at < NOW();
