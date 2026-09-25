// Server-side enforcement of the rules in permissions.ts. API routes call
// requireClubPermission() before doing anything a role restriction applies to.

import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { isCoordinator } from "@/lib/auth/roles"
import { permissionsForRoles, rolesFor, type Permission } from "@/lib/auth/permissions"

export async function getClubPermissions(userId: string, clubId: string): Promise<Permission[]> {
  const [membership, sponsor, coordinator] = await Promise.all([
    pool.query("SELECT role FROM club_members WHERE club_id = $1 AND user_id = $2", [clubId, userId]),
    pool.query(
      "SELECT id FROM club_sponsors WHERE club_id = $1 AND user_id = $2 AND status = 'active'",
      [clubId, userId]
    ),
    isCoordinator(userId),
  ])

  return permissionsForRoles(
    rolesFor({
      memberRole: membership.rows[0]?.role,
      isSponsor: sponsor.rows.length > 0,
      isCoordinator: coordinator,
    })
  )
}

export async function hasClubPermission(userId: string, clubId: string, permission: Permission): Promise<boolean> {
  return (await getClubPermissions(userId, clubId)).includes(permission)
}

const DENIED_MESSAGES: Record<Permission, string> = {
  post: "You don't have permission to post in this club",
  deleteAnyPost: "You don't have permission to delete this post",
  editClub: "You don't have permission to edit this club",
  manageTags: "You don't have permission to manage this club's tags",
  manageMembers: "You don't have permission to manage this club's members",
  emailAll: "You don't have permission to email this club's members",
}

// Returns the error response to send back when the user lacks the permission,
// or null when they have it:
//
//   const denied = await requireClubPermission(userId, clubId, "editClub")
//   if (denied) return denied
export async function requireClubPermission(
  userId: string | null | undefined,
  clubId: string,
  permission: Permission
): Promise<NextResponse | null> {
  if (!userId) {
    return NextResponse.json({ success: false, error: "User ID required" }, { status: 401 })
  }
  if (await hasClubPermission(userId, clubId, permission)) {
    return null
  }
  return NextResponse.json({ success: false, error: DENIED_MESSAGES[permission] }, { status: 403 })
}
