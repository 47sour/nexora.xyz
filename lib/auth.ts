import jwt from "jsonwebtoken"

export type AuthUser = {
  id: number
  username: string
  email: string
  role: "user" | "admin"
}

export function createToken(user: AuthUser) {
  return jwt.sign(user, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  })
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as AuthUser
  } catch {
    return null
  }
}