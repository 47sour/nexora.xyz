import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthUser } from "@/lib/get-auth-user"

export async function GET(req: Request) {
  try {
    const authUser = await getAuthUser()

    if (!authUser) {
      return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")?.trim() || ""

    if (query.length < 2) {
      return NextResponse.json({
        users: [],
      })
    }

    const search = `%${query}%`

    const [rows] = await db.query(
      `SELECT
        u.id,
        u.username,
        u.email,
        u.role,
        u.xp,
        u.level,
        u.status,
        CASE
          WHEN f.id IS NOT NULL THEN 'friends'
          WHEN sent.id IS NOT NULL THEN 'request_sent'
          WHEN received.id IS NOT NULL THEN 'request_received'
          ELSE 'none'
        END AS relationStatus
      FROM users u
      LEFT JOIN friends f
        ON f.user_id = ? AND f.friend_id = u.id
      LEFT JOIN friend_requests sent
        ON sent.sender_id = ? 
        AND sent.receiver_id = u.id 
        AND sent.status = 'pending'
      LEFT JOIN friend_requests received
        ON received.sender_id = u.id 
        AND received.receiver_id = ?
        AND received.status = 'pending'
      WHERE u.id != ?
        AND (u.username LIKE ? OR u.email LIKE ?)
      ORDER BY u.username ASC
      LIMIT 20`,
      [authUser.id, authUser.id, authUser.id, authUser.id, search, search]
    )

    return NextResponse.json({
      users: rows,
    })
  } catch {
    return NextResponse.json(
      { error: "Suche fehlgeschlagen." },
      { status: 500 }
    )
  }
}