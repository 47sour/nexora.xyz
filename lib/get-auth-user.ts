import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export type ServerAuthUser = {
  id: number
  username: string
  email: string
  role: "user" | "admin"
  xp: number
  level: number
  status: string
  joined: string
}

export async function getAuthUser(): Promise<ServerAuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("nexora_token")?.value

  if (!token) {
    return null
  }

  const tokenUser = verifyToken(token)

  if (!tokenUser) {
    return null
  }

  const [rows] = await db.query(
    `SELECT id, username, email, role, xp, level, status, joined
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [tokenUser.id]
  )

  const users = rows as ServerAuthUser[]

  if (users.length === 0) {
    return null
  }

  return users[0]
}