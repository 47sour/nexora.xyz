import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthUser } from "@/lib/get-auth-user"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser()

    if (!authUser) {
      return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 })
    }

    const { id } = await params
    const inviteId = Number(id)

    if (!inviteId) {
      return NextResponse.json({ error: "Ungültige Einladung." }, { status: 400 })
    }

    const { action } = await req.json()

    if (!["accept", "decline", "cancel"].includes(action)) {
      return NextResponse.json({ error: "Ungültige Aktion." }, { status: 400 })
    }

    const [rows] = await db.query(
      `SELECT id, sender_id, receiver_id, status
       FROM game_invitations
       WHERE id = ?
       LIMIT 1`,
      [inviteId]
    )

    const invitations = rows as any[]

    if (invitations.length === 0) {
      return NextResponse.json(
        { error: "Einladung nicht gefunden." },
        { status: 404 }
      )
    }

    const invitation = invitations[0]

    if (invitation.status !== "pending") {
      return NextResponse.json(
        { error: "Diese Einladung wurde bereits bearbeitet." },
        { status: 409 }
      )
    }

    if (action === "cancel") {
      if (invitation.sender_id !== authUser.id) {
        return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 })
      }

      await db.query(
        `UPDATE game_invitations
         SET status = 'cancelled'
         WHERE id = ?`,
        [inviteId]
      )

      return NextResponse.json({ success: true })
    }

    if (invitation.receiver_id !== authUser.id) {
      return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 })
    }

    const newStatus = action === "accept" ? "accepted" : "declined"

    await db.query(
      `UPDATE game_invitations
       SET status = ?
       WHERE id = ?`,
      [newStatus, inviteId]
    )

    return NextResponse.json({
      success: true,
      accepted: action === "accept",
    })
  } catch {
    return NextResponse.json(
      { error: "Invitation konnte nicht bearbeitet werden." },
      { status: 500 }
    )
  }
}