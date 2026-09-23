-- Migration: Add optional title column to posts
-- Run this against the app database before deploying the post-title UI changes.
-- Nullable so existing posts (created before this migration) keep rendering.

ALTER TABLE posts ADD COLUMN IF NOT EXISTS title VARCHAR(200);
