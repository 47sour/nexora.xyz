"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useAuth } from './auth-context'

export interface ChatMessage {
  id: string
  senderId: string
  senderUsername: string
  senderLevel: number
  content: string
  timestamp: Date
  type: 'global' | 'private'
  recipientId?: string
}

export interface PrivateChat {
  oderId: string
  odreUsername: string
  isOpen: boolean
  isMinimized: boolean
  messages: ChatMessage[]
}

interface ChatContextType {
  globalMessages: ChatMessage[]
  privateChats: PrivateChat[]
  isGlobalChatOpen: boolean
  sendGlobalMessage: (content: string) => void
  sendPrivateMessage: (oderId: string, content: string) => void
  openPrivateChat: (oder: { id: string; username: string }) => void
  closePrivateChat: (oderId: string) => void
  toggleMinimizePrivateChat: (oderId: string) => void
  toggleGlobalChat: () => void
  closeGlobalChat: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Demo global messages
const demoGlobalMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: '3',
    senderUsername: 'ProGamer99',
    senderLevel: 42,
    content: 'Hey everyone! Anyone up for some Neon Racing?',
    timestamp: new Date(Date.now() - 300000),
    type: 'global'
  },
  {
    id: '2',
    senderId: '4',
    senderUsername: 'ShadowBlade',
    senderLevel: 38,
    content: 'Just hit level 38! Let\'s go!',
    timestamp: new Date(Date.now() - 240000),
    type: 'global'
  },
  {
    id: '3',
    senderId: '5',
    senderUsername: 'PixelQueen',
    senderLevel: 55,
    content: 'GG to everyone in the last Cyber Arena match',
    timestamp: new Date(Date.now() - 180000),
    type: 'global'
  },
  {
    id: '4',
    senderId: '6',
    senderUsername: 'NightHawk',
    senderLevel: 29,
    content: 'Anyone want to team up for the new puzzle game?',
    timestamp: new Date(Date.now() - 120000),
    type: 'global'
  },
  {
    id: '5',
    senderId: '7',
    senderUsername: 'CryptoKing',
    senderLevel: 61,
    content: 'The new update is amazing!',
    timestamp: new Date(Date.now() - 60000),
    type: 'global'
  }
]

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [globalMessages, setGlobalMessages] = useState<ChatMessage[]>(demoGlobalMessages)
  const [privateChats, setPrivateChats] = useState<PrivateChat[]>([])
  const [isGlobalChatOpen, setIsGlobalChatOpen] = useState(false)

  const sendGlobalMessage = useCallback((content: string) => {
    if (!user || !content.trim()) return

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: user.id,
      senderUsername: user.username,
      senderLevel: user.level,
      content: content.trim(),
      timestamp: new Date(),
      type: 'global'
    }

    setGlobalMessages(prev => [...prev, newMessage])
  }, [user])

  const sendPrivateMessage = useCallback((oderId: string, content: string) => {
    if (!user || !content.trim()) return

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: user.id,
      senderUsername: user.username,
      senderLevel: user.level,
      content: content.trim(),
      timestamp: new Date(),
      type: 'private',
      recipientId: oderId
    }

    setPrivateChats(prev => prev.map(chat => 
      chat.oderId === oderId 
        ? { ...chat, messages: [...chat.messages, newMessage] }
        : chat
    ))

    // Simulate a response after a short delay (demo only)
    setTimeout(() => {
      const chat = privateChats.find(c => c.oderId === oderId)
      if (chat) {
        const responses = [
          'Hey! What\'s up?',
          'Sure, sounds good!',
          'I\'m in a game right now, give me 5 min',
          'Haha nice one!',
          'Let\'s do it!'
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        
        const responseMessage: ChatMessage = {
          id: crypto.randomUUID(),
          senderId: oderId,
          senderUsername: chat.odreUsername,
          senderLevel: Math.floor(Math.random() * 50) + 10,
          content: randomResponse,
          timestamp: new Date(),
          type: 'private',
          recipientId: user.id
        }

        setPrivateChats(prev => prev.map(c => 
          c.oderId === oderId 
            ? { ...c, messages: [...c.messages, responseMessage] }
            : c
        ))
      }
    }, 1500 + Math.random() * 2000)
  }, [user, privateChats])

  const openPrivateChat = useCallback((oder: { id: string; username: string }) => {
    setPrivateChats(prev => {
      const existingChat = prev.find(c => c.oderId === oder.id)
      if (existingChat) {
        return prev.map(c => 
          c.oderId === oder.id 
            ? { ...c, isOpen: true, isMinimized: false }
            : c
        )
      }
      return [...prev, {
        oderId: oder.id,
        odreUsername: oder.username,
        isOpen: true,
        isMinimized: false,
        messages: []
      }]
    })
  }, [])

  const closePrivateChat = useCallback((oderId: string) => {
    setPrivateChats(prev => prev.filter(c => c.oderId !== oderId))
  }, [])

  const toggleMinimizePrivateChat = useCallback((oderId: string) => {
    setPrivateChats(prev => prev.map(c => 
      c.oderId === oderId 
        ? { ...c, isMinimized: !c.isMinimized }
        : c
    ))
  }, [])

  const toggleGlobalChat = useCallback(() => {
    setIsGlobalChatOpen(prev => !prev)
  }, [])

  const closeGlobalChat = useCallback(() => {
    setIsGlobalChatOpen(false)
  }, [])

  return (
    <ChatContext.Provider value={{
      globalMessages,
      privateChats,
      isGlobalChatOpen,
      sendGlobalMessage,
      sendPrivateMessage,
      openPrivateChat,
      closePrivateChat,
      toggleMinimizePrivateChat,
      toggleGlobalChat,
      closeGlobalChat
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
