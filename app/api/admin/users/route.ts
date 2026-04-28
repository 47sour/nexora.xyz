import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET() {
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

    const [rows] = await db.query(
      `SELECT 
        id,
        username,
        email,
        role,
        xp,
        level,
        status,
        joined,
        ban_reason AS banReason,
        timeout_until AS timeoutUntil
      FROM users
      ORDER BY joined DESC`
    )

    return NextResponse.json({
      users: rows,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "User konnten nicht geladen werden." },
      { status: 500 }
    )
  }
}