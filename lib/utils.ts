import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a "Last, First" name (as returned by the school directory) into
 * "First Last". Names with no comma are returned unchanged.
 */
export function formatDisplayName(name: string | null | undefined): string {
  if (!name) return ""
  const [last, first] = name.split(",").map((part) => part.trim())
  return first ? `${first} ${last}` : name.trim()
}
