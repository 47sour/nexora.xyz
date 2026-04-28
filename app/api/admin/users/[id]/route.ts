import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

function getTimeoutDate(duration: string) {
  const now = new Date()

  const values: Record<string, number> = {
    "1h": 1,
    "6h": 6,
    "12h": 12,
    "24h": 24,
    "7d": 24 * 7,
    "30d": 24 * 30,
  }

  const hours = values[duration] || 1
  now.setHours(now.getHours() + hours)

  return now
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("nexora_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 })
    }

    const authUser = verifyToken(token)

    if (!authUser) {
      return NextResponse.json({ error: "Ungültige Session." }, { status: 401 })
    }

    const [adminRows] = await db.query(
      `SELECT id, role FROM users WHERE id = ? LIMIT 1`,
      [authUser.id]
    )

    const adminUsers = adminRows as any[]

    if (adminUsers.length === 0 || adminUsers[0].role !== "admin") {
      return NextResponse.json({ error: "Kein Zugriff." }, { status: 403 })
    }

    const { id } = await params
    const targetUserId = Number(id)

    if (!targetUserId) {
      return NextResponse.json({ error: "Ungültige User-ID." }, { status: 400 })
    }

    if (targetUserId === authUser.id) {
      return NextResponse.json(
        { error: "Du kannst dich nicht selbst bearbeiten." },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { action, reason, duration } = body

    if (action === "ban") {
      await db.query(
        `UPDATE users 
         SET status = 'banned', ban_reason = ?, timeout_until = NULL 
         WHERE id = ?`,
        [reason || "No reason provided", targetUserId]
      )
    } else if (action === "timeout") {
      const timeoutUntil = getTimeoutDate(duration || "1h")

      await db.query(
        `UPDATE users 
         SET status = 'timeout', timeout_until = ?, ban_reason = NULL 
         WHERE id = ?`,
        [timeoutUntil, targetUserId]
      )
    } else if (action === "unban") {
      await db.query(
        `UPDATE users 
         SET status = 'active', ban_reason = NULL, timeout_until = NULL 
         WHERE id = ?`,
        [targetUserId]
      )
    } else {
      return NextResponse.json({ error: "Ungültige Aktion." }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "User konnte nicht aktualisiert werden." },
      { status: 500 }
    )
  }
}