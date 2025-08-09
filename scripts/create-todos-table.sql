-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);

-- Insert sample todos for demo user
INSERT INTO todos (user_id, title, description, completed, priority, due_date) 
SELECT 
  u.id,
  'Complete project documentation',
  'Write comprehensive documentation for the new deployment platform',
  false,
  'high',
  NOW() + INTERVAL '3 days'
FROM users u WHERE u.email = 'demo@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO todos (user_id, title, description, completed, priority, due_date) 
SELECT 
  u.id,
  'Review pull requests',
  'Review and merge pending pull requests from team members',
  false,
  'medium',
  NOW() + INTERVAL '1 day'
FROM users u WHERE u.email = 'demo@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO todos (user_id, title, description, completed, priority) 
SELECT 
  u.id,
  'Update dependencies',
  'Update all project dependencies to latest versions',
  true,
  'low'
FROM users u WHERE u.email = 'demo@example.com'
ON CONFLICT DO NOTHING;
