/**
 * NEXORA - Demo Authentication Configuration
 * 
 * This is a PROTOTYPE authentication system for demo purposes only.
 */

export interface DemoUser {
  id: string
  username: string
  email: string
  password: string
  avatar: string
  role: 'admin' | 'user'
  level: number
  xp: number
  createdAt: string
  status: 'active' | 'banned' | 'timeout'
  banReason?: string
  timeoutUntil?: string
}

export const demoUsers: DemoUser[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@nexora.dev",
    password: "admin123",
    avatar: "/avatars/admin.png",
    role: "admin",
    level: 50,
    xp: 250000,
    createdAt: "2024-01-01",
    status: "active"
  },
  {
    id: "2",
    username: "player",
    email: "player@nexora.dev",
    password: "player123",
    avatar: "/avatars/player.png",
    role: "user",
    level: 24,
    xp: 7840,
    createdAt: "2024-02-15",
    status: "active"
  },
  {
    id: "3",
    username: "gamer42",
    email: "gamer42@nexora.dev",
    password: "gamer123",
    avatar: "/avatars/gamer.png",
    role: "user",
    level: 15,
    xp: 2250,
    createdAt: "2024-03-10",
    status: "active"
  },
  {
    id: "4",
    username: "ProPlayer99",
    email: "proplayer@nexora.dev",
    password: "pro123",
    avatar: "/avatars/proplayer.png",
    role: "user",
    level: 38,
    xp: 14440,
    createdAt: "2024-01-20",
    status: "active"
  },
  {
    id: "5",
    username: "NightOwl",
    email: "nightowl@nexora.dev",
    password: "night123",
    avatar: "/avatars/nightowl.png",
    role: "user",
    level: 8,
    xp: 640,
    createdAt: "2024-04-01",
    status: "timeout",
    timeoutUntil: "2024-12-20"
  },
  {
    id: "6",
    username: "ToxicUser",
    email: "toxic@nexora.dev",
    password: "toxic123",
    avatar: "/avatars/toxic.png",
    role: "user",
    level: 12,
    xp: 1440,
    createdAt: "2024-02-28",
    status: "banned",
    banReason: "Harassment and toxic behavior"
  },
  {
    id: "7",
    username: "CasualGamer",
    email: "casual@nexora.dev",
    password: "casual123",
    avatar: "/avatars/casual.png",
    role: "user",
    level: 5,
    xp: 250,
    createdAt: "2024-05-15",
    status: "active"
  },
  {
    id: "8",
    username: "SpeedRunner",
    email: "speed@nexora.dev",
    password: "speed123",
    avatar: "/avatars/speed.png",
    role: "user",
    level: 42,
    xp: 17640,
    createdAt: "2024-01-05",
    status: "active"
  }
]

/**
 * Validates login credentials against demo users
 */
export function validateLogin(usernameOrEmail: string, password: string): DemoUser | null {
  const user = demoUsers.find(
    (u) =>
      (u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
        u.email.toLowerCase() === usernameOrEmail.toLowerCase()) &&
      u.password === password
  )
  return user || null
}

/**
 * Checks if a username is already taken
 */
export function isUsernameTaken(username: string): boolean {
  return demoUsers.some((u) => u.username.toLowerCase() === username.toLowerCase())
}

/**
 * Checks if an email is already registered
 */
export function isEmailTaken(email: string): boolean {
  return demoUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())
}

/**
 * Get user by ID
 */
export function getUserById(id: string): DemoUser | null {
  return demoUsers.find((u) => u.id === id) || null
}

/**
 * Get all users (for admin panel)
 */
export function getAllUsers(): DemoUser[] {
  return demoUsers
}

/**
 * Get users by status
 */
export function getUsersByStatus(status: DemoUser['status']): DemoUser[] {
  return demoUsers.filter((u) => u.status === status)
}

// Storage key for localStorage
export const AUTH_STORAGE_KEY = 'nexora_auth_user'
