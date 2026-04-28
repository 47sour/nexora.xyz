import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("nexora_token")?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const tokenUser = verifyToken(token)

    if (!tokenUser) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const [rows] = await db.query(
      `SELECT id, username, email, role, xp, level, status, joined
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [tokenUser.id]
    )

    const users = rows as any[]

    if (users.length === 0) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({
      user: users[0],
    })
  } catch (error) {
    return NextResponse.json(
      { user: null, error: "Session konnte nicht geladen werden." },
      { status: 500 }
    )
  }
}