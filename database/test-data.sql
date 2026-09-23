-- Local test fixtures. Requires the schema to be applied first (see scripts/reset-db.sh).
--   * Clubby McClubface: fully populated (sponsor, president, officer, members, posts, tags, a like)
--   * Clubby McClubface II: unclaimed, no members/posts, for testing empty states
-- Uses fixed UUIDs + ON CONFLICT DO NOTHING, so re-running never overwrites existing rows.
-- To pick up edits to rows that already exist, reset the database instead: scripts/reset-db.sh
-- Run: psql school_social_app -f database/test-data.sql

-- Users
INSERT INTO users (id, email, name, role, grade, user_type) VALUES
  ('00000000-0000-0000-0000-000000000001', 'test.sponsor@berkeleyprep.org', 'Quincy Teacher', 'sponsor', NULL, 'teacher'),
  ('00000000-0000-0000-0000-000000000002', 'test.president@berkeleyprep.org', 'Gwendolin President', 'student', '12', 'student'),
  ('00000000-0000-0000-0000-000000000003', 'test.member1@berkeleyprep.org', 'Obyn Eleven', 'student', '11', 'student'),
  ('00000000-0000-0000-0000-000000000004', 'test.member2@berkeleyprep.org', 'Striker Ten', 'student', '10', 'student'),
  ('00000000-0000-0000-0000-000000000005', 'test.member3@berkeleyprep.org', 'Churchill Nine', 'student', '9', 'student')
ON CONFLICT (id) DO NOTHING;

-- Clubby McClubface (Filled)
INSERT INTO clubs (id, name, description, category, meeting_time, location, is_claimed, president_id) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Clubby McClubface', 'Its Clubby McClubface. What more could you want?', 'hobby', 'Always', 'U000', true, '00000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- Clubby McClubface II (Empty)
INSERT INTO clubs (id, name, description, category, meeting_time, location, image_url, is_claimed) VALUES
  ('10000000-0000-0000-0000-000000000002', 'Clubby McClubface II', 'Its Clubby McClubface. What more could you want? This ones a bit lonely though.', 'hobby', 'Never', 'U999', '', false)
ON CONFLICT DO NOTHING;

-- Members (getUserRoles() reads the president from club_members, not clubs.president_id)
INSERT INTO club_members (club_id, user_id, role) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'president'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'officer'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'member'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'member')
ON CONFLICT (club_id, user_id) DO NOTHING;

-- Sponsor assignment (this is what makes isSponsor true)
INSERT INTO club_sponsors (club_id, user_id, status) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'active')
ON CONFLICT (club_id, user_id) DO NOTHING;

-- Tags
INSERT INTO club_tags (club_id, tag) VALUES
  ('10000000-0000-0000-0000-000000000001', 'robotics'),
  ('10000000-0000-0000-0000-000000000001', 'stem')
ON CONFLICT (club_id, tag) DO NOTHING;

-- Posts (title is nullable, so include one without to check older posts still render)
INSERT INTO posts (id, club_id, user_id, title, content, created_at) VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Welcome!', 'First meeting is this Wednesday.', now() - interval '3 days'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', NULL, 'Untitled post, to check that old-style posts still render.', now() - interval '1 day'),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Competition sign-ups', 'Sign up by Friday.', now() - interval '2 hours')
ON CONFLICT (id) DO NOTHING;

-- A like
INSERT INTO post_likes (post_id, user_id) VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003')
ON CONFLICT (post_id, user_id) DO NOTHING;
