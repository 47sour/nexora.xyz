import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { createToken } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json()

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, Email und Passwort sind erforderlich." },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Passwort muss mindestens 6 Zeichen lang sein." },
        { status: 400 }
      )
    }

    const [existingRows] = await db.query(
      `SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1`,
      [username, email]
    )

    const existingUsers = existingRows as any[]

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Username oder Email existiert bereits." },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await db.query(
      `INSERT INTO users (username, email, password, role, xp, level, status)
       VALUES (?, ?, ?, 'user', 0, 1, 'online')`,
      [username, email, hashedPassword]
    )

    const insertResult = result as any
    const userId = insertResult.insertId

    const user = {
      id: userId,
      username,
      email,
      role: "user" as const,
      xp: 0,
      level: 1,
      status: "online",
      joined: new Date().toISOString(),
    }

    const token = createToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({
      success: true,
      user,
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
      { error: "Serverfehler bei der Registrierung." },
      { status: 500 }
    )
  }
}