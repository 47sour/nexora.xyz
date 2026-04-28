import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthUser } from "@/lib/get-auth-user"

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
    const friendId = Number(id)

    if (!friendId) {
      return NextResponse.json({ error: "Ungültiger Freund." }, { status: 400 })
    }

    await db.query(
      `DELETE FROM friends
       WHERE (user_id = ? AND friend_id = ?)
          OR (user_id = ? AND friend_id = ?)`,
      [authUser.id, friendId, friendId, authUser.id]
    )

    return NextResponse.json({
      success: true,
    })
  } catch {
    return NextResponse.json(
      { error: "Freund konnte nicht entfernt werden." },
      { status: 500 }
    )
  }
}