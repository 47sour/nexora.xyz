import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthUser } from "@/lib/get-auth-user"

export async function GET() {
  try {
    const authUser = await getAuthUser()

    if (!authUser) {
      return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 })
    }

    const [rows] = await db.query(
      `SELECT 
        u.id,
        u.username,
        u.email,
        u.role,
        u.xp,
        u.level,
        u.status,
        u.joined,
        f.created_at AS friendsSince
      FROM friends f
      INNER JOIN users u ON u.id = f.friend_id
      WHERE f.user_id = ?
      ORDER BY 
        CASE 
          WHEN u.status = 'online' THEN 1
          WHEN u.status = 'busy' THEN 2
          WHEN u.status = 'active' THEN 3
          ELSE 4
        END,
        u.username ASC`,
      [authUser.id]
    )

    return NextResponse.json({
      friends: rows,
    })
  } catch {
    return NextResponse.json(
      { error: "Freunde konnten nicht geladen werden." },
      { status: 500 }
    )
  }
}