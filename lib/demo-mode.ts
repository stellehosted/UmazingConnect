// Demo mode configuration for testing without Azure authentication.
//
// Demo mode skips the Microsoft login and signs in as a user that already exists
// in the database, looked up by email exactly like a real login. Who that user is
// (id, name, role, grade) is defined once, in database/test-data.sql; load it with
// scripts/reset-db.sh. This file only says which email each short persona name means.
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

export type DemoPersona = "coordinator" | "sponsor" | "president" | "vp" | "officer" | "member"

// Their roles come from the rows in test-data.sql: the president, vp, officer and
// member from club_members, the sponsor from club_sponsors, and the coordinator
// from user_roles (they aren't in Miku Club at all).
export const DEMO_PERSONA_EMAILS: Record<DemoPersona, string> = {
  coordinator: "test.coordinator@berkeleyprep.org",
  sponsor: "test.sponsor@berkeleyprep.org",
  president: "test.president@berkeleyprep.org",
  vp: "test.vp@berkeleyprep.org",
  officer: "test.officer@berkeleyprep.org",
  member: "test.member@berkeleyprep.org",
}

// Picks demo user's email from NEXT_PUBLIC_DEMO_PERSONA = coordinator | sponsor | president | vp | officer | member
// or sign in as any other user in the database via email
export function resolveDemoEmail(persona: string | undefined): string {
  const key = persona?.trim().toLowerCase()
  if (key && Object.prototype.hasOwnProperty.call(DEMO_PERSONA_EMAILS, key)) {
    return DEMO_PERSONA_EMAILS[key as DemoPersona]
  }
  if (key?.includes("@")) {
    return key
  }

  // Unset: Fallback to Member
  // Invalid Value: Notified
  if (persona) {
    console.warn(
      `Unknown NEXT_PUBLIC_DEMO_PERSONA "${persona}". Use coordinator, sponsor, president, vp, officer, member, or a user's email. Falling back to member.`
    )
  }
  return DEMO_PERSONA_EMAILS.member
}

export const DEMO_EMAIL: string = resolveDemoEmail(process.env.NEXT_PUBLIC_DEMO_PERSONA)
