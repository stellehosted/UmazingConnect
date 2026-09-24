// Demo mode configuration for testing without Azure authentication
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

export type DemoPersona = "sponsor" | "president" | "officer" | "member"

const demoUser = (id: string, email: string, name: string, role: string, grade: string, bio: string) => ({
  id,
  email,
  name,
  role,
  grade,
  bio,
  interests: ["Technology", "Science", "Music"],
  profilePicture: "/placeholder-user.jpg",
  createdAt: new Date(),
  updatedAt: new Date(),
})

// These IDs and emails match the users in database/test-data.sql (load it with
// scripts/reset-db.sh), so club, membership and role lookups hit real rows.
// The president/officer/member roles come from club_members, the sponsor's from club_sponsors.
export const DEMO_PERSONAS: Record<DemoPersona, any> = {
  sponsor: demoUser("00000000-0000-0000-0000-000000000001", "test.sponsor@berkeleyprep.org", "Quincy Teacher", "sponsor", "", "Demo sponsor for Miku Club."),
  president: demoUser("00000000-0000-0000-0000-000000000002", "test.president@berkeleyprep.org", "Gwen President", "student", "12", "Demo president of Miku Club."),
  officer: demoUser("00000000-0000-0000-0000-000000000003", "test.member1@berkeleyprep.org", "Obyn Eleven", "student", "11", "Demo officer of Miku Club."),
  member: demoUser("00000000-0000-0000-0000-000000000004", "test.member2@berkeleyprep.org", "Striker Ten", "student", "10", "Demo member of Miku Club."),
}

// Picks the demo user from NEXT_PUBLIC_DEMO_PERSONA (sponsor | president | officer | member).
export function resolveDemoUser(persona: string | undefined): any {
  if (persona && Object.prototype.hasOwnProperty.call(DEMO_PERSONAS, persona)) {
    return DEMO_PERSONAS[persona as DemoPersona]
  }

  // Unset is fine (default to a plain member), but a set-and-wrong value is almost certainly a typo, so say so instead of silently logging you in as someone else.
  if (persona) {
    console.warn(
      `Unknown NEXT_PUBLIC_DEMO_PERSONA "${persona}". Use sponsor, president, officer or member. Falling back to member.`
    )
  }
  return DEMO_PERSONAS.member
}

export const DEMO_USER: any = resolveDemoUser(process.env.NEXT_PUBLIC_DEMO_PERSONA)