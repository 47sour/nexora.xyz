import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthUser } from "@/lib/get-auth-user"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const connection = await db.getConnection()

  try {
    const authUser = await getAuthUser()

    if (!authUser) {
      return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 })
    }

    const { id } = await params
    const requestId = Number(id)
    const { action } = await req.json()

    if (!requestId) {
      return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 })
    }

    if (!["accept", "decline"].includes(action)) {
      return NextResponse.json({ error: "Ungültige Aktion." }, { status: 400 })
    }

    const [rows] = await connection.query(
      `SELECT id, sender_id, receiver_id, status
       FROM friend_requests
       WHERE id = ?
         AND receiver_id = ?
         AND status = 'pending'
       LIMIT 1`,
      [requestId, authUser.id]
    )

    const requests = rows as any[]

    if (requests.length === 0) {
      return NextResponse.json(
        { error: "Anfrage nicht gefunden." },
        { status: 404 }
      )
    }

    const request = requests[0]

    if (action === "decline") {
      await connection.query(
        `UPDATE friend_requests SET status = 'declined' WHERE id = ?`,
        [requestId]
      )

      return NextResponse.json({
        success: true,
      })
    }

    await connection.beginTransaction()

    await connection.query(
      `UPDATE friend_requests SET status = 'accepted' WHERE id = ?`,
      [requestId]
    )

    await connection.query(
      `INSERT IGNORE INTO friends (user_id, friend_id)
       VALUES (?, ?), (?, ?)`,
      [request.sender_id, request.receiver_id, request.receiver_id, request.sender_id]
    )

    await connection.commit()

    return NextResponse.json({
      success: true,
    })
  } catch {
    await connection.rollback()

    return NextResponse.json(
      { error: "Anfrage konnte nicht bearbeitet werden." },
      { status: 500 }
    )
  } finally {
    connection.release()
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser()

    if (!authUser) {
      return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 })
    }

    const { id } = await params
    const requestId = Number(id)

    if (!requestId) {
      return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 })
    }

    await db.query(
      `DELETE FROM friend_requests
       WHERE id = ?
         AND sender_id = ?
         AND status = 'pending'`,
      [requestId, authUser.id]
    )

    return NextResponse.json({
      success: true,
    })
  } catch {
    return NextResponse.json(
      { error: "Anfrage konnte nicht gelöscht werden." },
      { status: 500 }
    )
  }
}