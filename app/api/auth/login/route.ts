import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { createToken } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json()

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Username/Email und Passwort sind erforderlich." },
        { status: 400 }
      )
    }

    const [rows] = await db.query(
      `SELECT id, username, email, password, role, xp, level, status, joined
       FROM users
       WHERE username = ? OR email = ?
       LIMIT 1`,
      [identifier, identifier]
    )

    const users = rows as any[]

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Ungültige Login-Daten." },
        { status: 401 }
      )
    }

    const user = users[0]
    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return NextResponse.json(
        { error: "Ungültige Login-Daten." },
        { status: 401 }
      )
    }

    await db.query("UPDATE users SET status = 'online' WHERE id = ?", [user.id])

    const token = createToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        xp: user.xp,
        level: user.level,
        status: "online",
        joined: user.joined,
      },
    })

    response.cookies.set("nexora_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: "Serverfehler beim Login." },
      { status: 500 }
    )
  }
}