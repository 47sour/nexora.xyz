"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { ChatProvider } from '@/context/chat-context'
import { Navbar } from '@/components/navbar'
import { GlobalChat } from '@/components/global-chat'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <ChatProvider>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <GlobalChat />
      </div>
    </ChatProvider>
  )
}
