import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

// GET /api/sponsor/clubs - Get all clubs sponsored by the user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID required" },
        { status: 400 }
      )
    }

    // Get all clubs where user is an active sponsor
    const result = await pool.query(
      `SELECT 
        c.*,
        cs.assigned_at as sponsor_since,
        (SELECT COUNT(*) FROM club_members WHERE club_id = c.id) as member_count,
        (SELECT COUNT(*) FROM leadership_requests WHERE club_id = c.id AND status = 'pending') as pending_requests
      FROM club_sponsors cs
      JOIN clubs c ON cs.club_id = c.id
      WHERE cs.user_id = $1 AND cs.status = 'active'
      ORDER BY c.name ASC`,
      [userId]
    )

    return NextResponse.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    console.error("Error fetching sponsored clubs:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch sponsored clubs" },
      { status: 500 }
    )
  }
}
