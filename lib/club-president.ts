// clubs.president_id is the club's "primary" president (shown on club cards and
// the admin dashboard, and used by the leave-club check). The real list of
// presidents is the club_members rows with role = 'president', so any route that
// adds or removes a president should call this afterwards to keep the two in step.
//
// The current primary stays if they're still a president; otherwise the
// longest-serving remaining president takes over, or it's cleared if none is left.
//
// Pass a transaction client as `db` to run it inside a transaction, so it sees
// that transaction's uncommitted role changes.

import pool from "@/lib/db"

export async function syncPrimaryPresident(
  clubId: string,
  db: { query: (text: string, params?: any[]) => Promise<any> } = pool
): Promise<void> {
  await db.query(
    `UPDATE clubs c
     SET president_id = (
       SELECT cm.user_id
       FROM club_members cm
       WHERE cm.club_id = c.id AND cm.role = 'president'
       ORDER BY (cm.user_id = c.president_id) DESC NULLS LAST, cm.joined_at ASC
       LIMIT 1
     ),
     updated_at = CURRENT_TIMESTAMP
     WHERE c.id = $1`,
    [clubId]
  )
}
