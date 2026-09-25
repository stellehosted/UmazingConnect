-- Migration: Add Admin System Tables
-- Date: 2025-11-30
-- Description: Adds tables for multi-role admin system including coordinators, sponsors, and leadership requests

-- 1. Global user roles (coordinators)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('coordinator')),
  assigned_by UUID,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- 2. Club sponsors (teachers)
CREATE TABLE IF NOT EXISTS club_sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL,
  user_id UUID NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'removed')),
  assigned_by UUID,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE(club_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_club_sponsors_club_id ON club_sponsors(club_id);
CREATE INDEX IF NOT EXISTS idx_club_sponsors_user_id ON club_sponsors(user_id);
CREATE INDEX IF NOT EXISTS idx_club_sponsors_status ON club_sponsors(status);

-- 3. Leadership change requests (for sponsor approval)
CREATE TABLE IF NOT EXISTS leadership_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL,
  requested_by UUID NOT NULL,
  target_user_id UUID NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('add_president', 'remove_president', 'add_officer', 'remove_officer')),
  previous_role TEXT,
  new_role TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID,
  reviewed_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
  FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_leadership_requests_club_id ON leadership_requests(club_id);
CREATE INDEX IF NOT EXISTS idx_leadership_requests_status ON leadership_requests(status);
CREATE INDEX IF NOT EXISTS idx_leadership_requests_created_at ON leadership_requests(created_at DESC);

-- 4. Audit log for admin actions
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'club', 'user', 'leadership_request')),
  target_id UUID,
  details TEXT,
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_target_type ON audit_log(target_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);

-- 5. Add user_type to users table (for sponsor verification)
-- Check if column exists before adding
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='user_type') THEN
    ALTER TABLE users ADD COLUMN user_type TEXT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
