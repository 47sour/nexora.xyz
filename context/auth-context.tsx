"use client"

/**
 * NEXORA - Demo Authentication Context
 * 
 * PROTOTYPE ONLY - Not for production use
 * This provides a simple auth state management using React Context and localStorage.
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { DemoUser, validateLogin, getUserById, AUTH_STORAGE_KEY } from '@/config/auth-config'

interface AuthContextType {
  user: DemoUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY)
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        const validUser = getUserById(parsed.id)
        if (validUser && validUser.status === 'active') {
          setUser(validUser)
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY)
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (usernameOrEmail: string, password: string) => {
    // Simulate network delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    const validUser = validateLogin(usernameOrEmail, password)
    if (validUser) {
      // Check if user is banned or timed out
      if (validUser.status === 'banned') {
        return { 
          success: false, 
          error: `This account has been banned. Reason: ${validUser.banReason || 'No reason provided'}` 
        }
      }
      
      if (validUser.status === 'timeout') {
        return { 
          success: false, 
          error: `This account is timed out until ${validUser.timeoutUntil}` 
        }
      }

      // Don't store password in localStorage
      const safeUser = { ...validUser, password: undefined }
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safeUser))
      setUser(validUser)
      return { success: true }
    }
    return { success: false, error: 'Invalid username/email or password' }
  }

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
  }

  const register = async (username: string, email: string, password: string) => {
    // In prototype, just simulate registration
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    // For demo, create a new user session (won't persist across refreshes)
    const newUser: DemoUser = {
      id: `new_${Date.now()}`,
      username,
      email,
      password,
      avatar: '/avatars/default.png',
      role: 'user',
      level: 1,
      xp: 0,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    }
    
    const safeUser = { ...newUser, password: undefined }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safeUser))
    setUser(newUser)
    
    return { success: true }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
