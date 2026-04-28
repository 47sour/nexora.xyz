import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthUser } from "@/lib/get-auth-user"

export async function GET() {
  try {
    const authUser = await getAuthUser()

    if (!authUser) {
      return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 })
    }

    const [incomingRows] = await db.query(
      `SELECT 
        fr.id,
        fr.sender_id AS senderId,
        fr.receiver_id AS receiverId,
        fr.status,
        fr.created_at AS createdAt,
        u.username,
        u.email,
        u.role,
        u.xp,
        u.level,
        u.status AS userStatus
      FROM friend_requests fr
      INNER JOIN users u ON u.id = fr.sender_id
      WHERE fr.receiver_id = ?
        AND fr.status = 'pending'
      ORDER BY fr.created_at DESC`,
      [authUser.id]
    )

    const [outgoingRows] = await db.query(
      `SELECT 
        fr.id,
        fr.sender_id AS senderId,
        fr.receiver_id AS receiverId,
        fr.status,
        fr.created_at AS createdAt,
        u.username,
        u.email,
        u.role,
        u.xp,
        u.level,
        u.status AS userStatus
      FROM friend_requests fr
      INNER JOIN users u ON u.id = fr.receiver_id
      WHERE fr.sender_id = ?
        AND fr.status = 'pending'
      ORDER BY fr.created_at DESC`,
      [authUser.id]
    )

    return NextResponse.json({
      incoming: incomingRows,
      outgoing: outgoingRows,
    })
  } catch {
    return NextResponse.json(
      { error: "Freundschaftsanfragen konnten nicht geladen werden." },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const authUser = await getAuthUser()

    if (!authUser) {
      return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 })
    }

    const { receiverId } = await req.json()
    const targetId = Number(receiverId)

    if (!targetId) {
      return NextResponse.json({ error: "Ungültiger User." }, { status: 400 })
    }

    if (targetId === authUser.id) {
      return NextResponse.json(
        { error: "Du kannst dir selbst keine Anfrage schicken." },
        { status: 400 }
      )
    }

    const [targetRows] = await db.query(
      `SELECT id FROM users WHERE id = ? LIMIT 1`,
      [targetId]
    )

    const targets = targetRows as any[]

    if (targets.length === 0) {
      return NextResponse.json({ error: "User nicht gefunden." }, { status: 404 })
    }

    const [friendRows] = await db.query(
      `SELECT id FROM friends WHERE user_id = ? AND friend_id = ? LIMIT 1`,
      [authUser.id, targetId]
    )

    const existingFriends = friendRows as any[]

    if (existingFriends.length > 0) {
      return NextResponse.json(
        { error: "Ihr seid bereits Freunde." },
        { status: 409 }
      )
    }

    const [incomingRows] = await db.query(
      `SELECT id FROM friend_requests 
       WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'
       LIMIT 1`,
      [targetId, authUser.id]
    )

    const incoming = incomingRows as any[]

    if (incoming.length > 0) {
      return NextResponse.json(
        { error: "Dieser User hat dir bereits eine Anfrage geschickt." },
        { status: 409 }
      )
    }

    await db.query(
      `INSERT INTO friend_requests (sender_id, receiver_id, status)
       VALUES (?, ?, 'pending')
       ON DUPLICATE KEY UPDATE status = 'pending', updated_at = CURRENT_TIMESTAMP`,
      [authUser.id, targetId]
    )

    return NextResponse.json({
      success: true,
    })
  } catch {
    return NextResponse.json(
      { error: "Anfrage konnte nicht gesendet werden." },
      { status: 500 }
    )
  }
}