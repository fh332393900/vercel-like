-- 调试会话表的脚本
-- 检查会话表结构和数据

-- 查看会话表结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'sessions';

-- 查看最近的会话记录
SELECT s.id, s.user_id, s.expires_at, s.created_at, u.email, u.name
FROM sessions s
JOIN users u ON s.user_id = u.id
ORDER BY s.created_at DESC
LIMIT 10;

-- 查看过期的会话
SELECT COUNT(*) as expired_sessions
FROM sessions 
WHERE expires_at < NOW();

-- 清理过期会话
DELETE FROM sessions WHERE expires_at < NOW();

-- 检查用户表中的GitHub用户
SELECT id, email, name, github_id, email_verified, created_at
FROM users 
WHERE github_id IS NOT NULL
ORDER BY created_at DESC;
