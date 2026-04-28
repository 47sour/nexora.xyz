import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("nexora_token")?.value

    if (token) {
      const user = verifyToken(token)

      if (user) {
        await db.query("UPDATE users SET status = 'offline' WHERE id = ?", [
          user.id,
        ])
      }
    }

    const response = NextResponse.json({ success: true })

    response.cookies.set("nexora_token", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    })

    return response
  } catch (error) {
    const response = NextResponse.json({ success: true })

    response.cookies.set("nexora_token", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    })

    return response
  }
}