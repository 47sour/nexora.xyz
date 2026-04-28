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
        gi.id,
        gi.sender_id AS senderId,
        gi.receiver_id AS receiverId,
        gi.game_id AS gameId,
        gi.game_name AS gameName,
        gi.status,
        gi.created_at AS createdAt,
        u.username AS senderUsername,
        u.email AS senderEmail,
        u.level AS senderLevel,
        u.xp AS senderXp,
        u.status AS senderStatus
      FROM game_invitations gi
      INNER JOIN users u ON u.id = gi.sender_id
      WHERE gi.receiver_id = ?
        AND gi.status = 'pending'
      ORDER BY gi.created_at DESC`,
      [authUser.id]
    )

    const [outgoingRows] = await db.query(
      `SELECT 
        gi.id,
        gi.sender_id AS senderId,
        gi.receiver_id AS receiverId,
        gi.game_id AS gameId,
        gi.game_name AS gameName,
        gi.status,
        gi.created_at AS createdAt,
        u.username AS receiverUsername,
        u.email AS receiverEmail,
        u.level AS receiverLevel,
        u.xp AS receiverXp,
        u.status AS receiverStatus
      FROM game_invitations gi
      INNER JOIN users u ON u.id = gi.receiver_id
      WHERE gi.sender_id = ?
        AND gi.status = 'pending'
      ORDER BY gi.created_at DESC`,
      [authUser.id]
    )

    return NextResponse.json({
      incoming: incomingRows,
      outgoing: outgoingRows,
    })
  } catch {
    return NextResponse.json(
      { error: "Invitations konnten nicht geladen werden." },
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

    const { receiverId, gameId, gameName } = await req.json()

    const targetId = Number(receiverId)

    if (!targetId || !gameId || !gameName) {
      return NextResponse.json(
        { error: "receiverId, gameId und gameName sind erforderlich." },
        { status: 400 }
      )
    }

    if (targetId === authUser.id) {
      return NextResponse.json(
        { error: "Du kannst dich nicht selbst einladen." },
        { status: 400 }
      )
    }

    const [friendRows] = await db.query(
      `SELECT id FROM friends
       WHERE user_id = ?
         AND friend_id = ?
       LIMIT 1`,
      [authUser.id, targetId]
    )

    const friends = friendRows as any[]

    if (friends.length === 0) {
      return NextResponse.json(
        { error: "Du kannst nur Freunde einladen." },
        { status: 403 }
      )
    }

    const [existingRows] = await db.query(
      `SELECT id FROM game_invitations
       WHERE sender_id = ?
         AND receiver_id = ?
         AND game_id = ?
         AND status = 'pending'
       LIMIT 1`,
      [authUser.id, targetId, gameId]
    )

    const existing = existingRows as any[]

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Es gibt bereits eine offene Einladung für dieses Spiel." },
        { status: 409 }
      )
    }

    await db.query(
      `INSERT INTO game_invitations 
        (sender_id, receiver_id, game_id, game_name, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [authUser.id, targetId, gameId, gameName]
    )

    return NextResponse.json({
      success: true,
    })
  } catch {
    return NextResponse.json(
      { error: "Invitation konnte nicht gesendet werden." },
      { status: 500 }
    )
  }
}