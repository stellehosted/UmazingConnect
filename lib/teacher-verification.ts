// Teacher email verification using curated list
import teacherData from './teacher-emails.json'

// Extra teacher emails from the TEACHER_EMAILS env var (comma-separated), for
// environments that need teachers who aren't in the curated list, such as the
// demo sponsor in local testing. Production leaves it unset.
function extraTeacherEmails(): string[] {
  return (process.env.TEACHER_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Check if an email belongs to a verified teacher
 * Uses a curated list of teacher emails from teacher-emails.json,
 * plus any in the TEACHER_EMAILS env var
 */
export function isTeacherEmail(email: string): boolean {
  if (!email) return false
  const normalized = email.toLowerCase()
  return teacherData.teacherEmails.includes(normalized) || extraTeacherEmails().includes(normalized)
}

/**
 * Get the total count of verified teachers
 */
export function getTeacherCount(): number {
  return teacherData.teacherEmails.length
}

/**
 * Check if multiple emails are teachers (batch check)
 */
export function areTeacherEmails(emails: string[]): boolean[] {
  return emails.map(email => isTeacherEmail(email))
}
