// The single source of truth for what each role may do inside a club.
//
// This file is deliberately pure (no database or server imports) so both the
// API routes and the React components can import it. The server enforces these
// rules (see club-permissions.ts); the UI reads the same list to decide which
// buttons to show, so the two can't drift apart.
//
// To change what a role can do, edit ROLE_PERMISSIONS below and nothing else.

export type ClubRole = "member" | "officer" | "vice_president" | "president" | "sponsor" | "coordinator"

export type Permission =
  | "post" // create posts in the club
  | "deleteAnyPost" // delete other people's posts (everyone can delete their own)
  | "editClub" // edit description, image, meeting time, location
  | "manageTags"
  | "manageMembers" // promote, demote and add officers / VPs
  | "emailAll" // email every member of the club

const CLUB_MANAGER: readonly Permission[] = [
  "post",
  "deleteAnyPost",
  "editClub",
  "manageTags",
  "manageMembers",
  "emailAll",
]

const without = (permissions: readonly Permission[], ...removed: Permission[]) =>
  permissions.filter((permission) => !removed.includes(permission))

export const ROLE_PERMISSIONS: Record<ClubRole, readonly Permission[]> = {
  member: [],
  officer: ["post", "emailAll"],
  // VPs run the club day to day but can't change who's in leadership.
  vice_president: without(CLUB_MANAGER, "manageMembers"),
  president: CLUB_MANAGER,
  sponsor: CLUB_MANAGER,
  // Coordinators are site admins: they moderate clubs but don't post as one.
  coordinator: without(CLUB_MANAGER, "post"),
}

// A user's roles for one club come from three different places: their
// club_members row, club_sponsors, and the site-wide coordinator list.
export function rolesFor({
  memberRole,
  isSponsor = false,
  isCoordinator = false,
}: {
  memberRole?: string | null
  isSponsor?: boolean
  isCoordinator?: boolean
}): ClubRole[] {
  const roles: ClubRole[] = []
  if (memberRole && Object.prototype.hasOwnProperty.call(ROLE_PERMISSIONS, memberRole)) {
    roles.push(memberRole as ClubRole)
  }
  if (isSponsor) roles.push("sponsor")
  if (isCoordinator) roles.push("coordinator")
  return roles
}

// Someone with several roles (say, a sponsor who also joined the club) gets the
// union of what each role allows.
export function permissionsForRoles(roles: readonly ClubRole[]): Permission[] {
  return [...new Set(roles.flatMap((role) => ROLE_PERMISSIONS[role]))]
}
