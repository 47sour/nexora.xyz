"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

export type User = {
  id: number
  username: string
  email: string
  role: "user" | "admin"
  xp: number
  level: number
  status: "online" | "offline" | "busy"
  joined: string
}

type AuthResult = {
  success: boolean
  error?: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (identifier: string, password: string) => Promise<AuthResult>
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<AuthResult>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        })

        if (!res.ok) {
          setUser(null)
          return
        }

        const data = await res.json()
        setUser(data.user)
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  async function login(
    identifier: string,
    password: string
  ): Promise<AuthResult> {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          identifier,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        return {
          success: false,
          error: data.error || "Login fehlgeschlagen.",
        }
      }

      setUser(data.user)

      return { success: true }
    } catch {
      return {
        success: false,
        error: "Serververbindung fehlgeschlagen.",
      }
    }
  }

  async function register(
    username: string,
    email: string,
    password: string
  ): Promise<AuthResult> {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        return {
          success: false,
          error: data.error || "Registrierung fehlgeschlagen.",
        }
      }

      setUser(data.user)

      return { success: true }
    } catch {
      return {
        success: false,
        error: "Serververbindung fehlgeschlagen.",
      }
    }
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } finally {
      setUser(null)
      window.location.href = "/login"
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}