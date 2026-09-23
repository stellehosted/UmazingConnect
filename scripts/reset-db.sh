#!/bin/bash
# Drop and recreate the local database, then apply the schema and load test data.
# Usage: scripts/reset-db.sh [database_name]   (default: school_social_app)
# Needs psql/createdb/dropdb on PATH and a local Postgres running.
# LOCAL DEV ONLY: this deletes everything in the target database.

set -euo pipefail

DB_NAME="${1:-school_social_app}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "Resetting database '$DB_NAME'..."
dropdb --if-exists "$DB_NAME"
createdb "$DB_NAME"

# Order matters: the admin migration references users, clubs and posts from schema.sql,
# and test-data.sql needs the admin tables (club_sponsors).
for f in database/schema.sql migrations/add_admin_system_tables.sql database/test-data.sql; do
  echo "Applying $f"
  psql "$DB_NAME" -v ON_ERROR_STOP=1 -q -f "$ROOT/$f" > /dev/null
done

echo "Done. Tables: $(psql "$DB_NAME" -Atc "select count(*) from information_schema.tables where table_schema='public'")"
