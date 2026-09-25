-- Local test fixtures. Requires the schema to be applied first (see scripts/reset-db.sh).
--   * Miku Club: fully populated (sponsor, president, VP, officer, member, posts, tags, a like)
--   * A coordinator (user_roles) who isn't in any club
--   * Clubby McClubface: unclaimed, no members/posts, for testing empty states
-- The users below are also the demo-mode personas (NEXT_PUBLIC_DEMO_PERSONA, see lib/demo-mode.ts):
-- demo mode signs in as one of them by email, so this file is the only place they're defined.
-- Uses fixed UUIDs + ON CONFLICT DO NOTHING, so re-running never overwrites existing rows.
-- To pick up edits to rows that already exist, reset the database instead: scripts/reset-db.sh
-- Run: psql school_social_app -f database/test-data.sql

-- Users
INSERT INTO users (id, email, name, role, grade, user_type) VALUES
  ('00000000-0000-0000-0000-000000000001', 'test.sponsor@berkeleyprep.org', 'Quincy Sponsor', 'sponsor', NULL, 'teacher'),
  ('00000000-0000-0000-0000-000000000002', 'test.president@berkeleyprep.org', 'Gwen President', 'student', '12', 'student'),
  ('00000000-0000-0000-0000-000000000003', 'test.vp@berkeleyprep.org', 'Obyn VP', 'student', '11', 'student'),
  ('00000000-0000-0000-0000-000000000004', 'test.officer@berkeleyprep.org', 'Striker Officer', 'student', '10', 'student'),
  ('00000000-0000-0000-0000-000000000005', 'test.member@berkeleyprep.org', 'Churchill Member', 'student', '9', 'student'),
  ('00000000-0000-0000-0000-000000000006', 'test.coordinator@berkeleyprep.org', 'Benjamin Coordinator', 'admin', NULL, 'teacher')
ON CONFLICT (id) DO NOTHING;

-- Coordinator (site-wide admin; deliberately not a member of any club).
-- user_roles has no unique constraint, so guard re-runs with NOT EXISTS instead of ON CONFLICT.
INSERT INTO user_roles (user_id, role)
SELECT '00000000-0000-0000-0000-000000000006', 'coordinator'
WHERE NOT EXISTS (
  SELECT 1 FROM user_roles WHERE user_id = '00000000-0000-0000-0000-000000000006' AND role = 'coordinator'
);

-- Miku Club (Filled)
INSERT INTO clubs (id, name, description, category, meeting_time, location, image_url, is_claimed, president_id) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Miku Club', 'The world is hers', 'hobby', 'Always', 'U000', '/uploads/mikuClub.jpg', true, '00000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- Clubby McClubface (Empty)
INSERT INTO clubs (id, name, description, category, meeting_time, location, image_url, is_claimed) VALUES
  ('10000000-0000-0000-0000-000000000002', 'Clubby McClubface', 'Its Clubby McClubface. What more could you want?', 'hobby', 'Never', 'U999', '', false)
ON CONFLICT DO NOTHING;

-- Members (getUserRoles() reads the president from club_members, not clubs.president_id)
INSERT INTO club_members (club_id, user_id, role) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'president'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'vice_president'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'officer'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'member')
ON CONFLICT (club_id, user_id) DO NOTHING;

-- Sponsor (this is what makes isSponsor true)
INSERT INTO club_sponsors (club_id, user_id, status) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'active')
ON CONFLICT (club_id, user_id) DO NOTHING;

-- Posts (title is nullable)
INSERT INTO posts (id, club_id, user_id, title, content, created_at) VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'World is Mine', 'Sekaide ichiban ohime sama!', now() - interval '3 days'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', NULL, 'Untitled Post Test', now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;

-- A like
INSERT INTO post_likes (post_id, user_id) VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003')
ON CONFLICT (post_id, user_id) DO NOTHING;
