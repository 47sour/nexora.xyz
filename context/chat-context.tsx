"use client"

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { io, type Socket } from "socket.io-client"
import { useAuth } from "@/context/auth-context"

export type GlobalMessage = {
  id: number
  senderId: number
  senderUsername: string
  senderLevel: number
  content: string
  timestamp: Date
}

type ChatContextType = {
  globalMessages: GlobalMessage[]
  isGlobalChatOpen: boolean
  isConnected: boolean
  chatError: string
  sendGlobalMessage: (message: string) => void
  toggleGlobalChat: () => void
  closeGlobalChat: () => void
  openGlobalChat: () => void
}

const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const socketRef = useRef<Socket | null>(null)

  const [globalMessages, setGlobalMessages] = useState<GlobalMessage[]>([])
  const [isGlobalChatOpen, setIsGlobalChatOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [chatError, setChatError] = useState("")

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated || !user) {
      socketRef.current?.disconnect()
      socketRef.current = null
      setIsConnected(false)
      setGlobalMessages([])
      return
    }

    const socket = io({
      path: "/socket.io",
      withCredentials: true,
      transports: ["websocket", "polling"],
    })

    socketRef.current = socket

    socket.on("connect", () => {
      setIsConnected(true)
      setChatError("")
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
    })

    socket.on("connect_error", () => {
      setIsConnected(false)
      setChatError("Chat-Verbindung fehlgeschlagen.")
    })

    socket.on("global:history", (messages) => {
      setGlobalMessages(
        messages.map((message: any) => ({
          id: Number(message.id),
          senderId: Number(message.senderId),
          senderUsername: String(message.senderUsername),
          senderLevel: Number(message.senderLevel || 1),
          content: String(message.content),
          timestamp: new Date(message.createdAt),
        }))
      )
    })

    socket.on("global:message", (message) => {
      setGlobalMessages((prev) => {
        const exists = prev.some((item) => item.id === Number(message.id))

        if (exists) return prev

        return [
          ...prev,
          {
            id: Number(message.id),
            senderId: Number(message.senderId),
            senderUsername: String(message.senderUsername),
            senderLevel: Number(message.senderLevel || 1),
            content: String(message.content),
            timestamp: new Date(message.createdAt),
          },
        ].slice(-100)
      })
    })

    socket.on("global:error", (message) => {
      setChatError(String(message))
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
      setIsConnected(false)
    }
  }, [isLoading, isAuthenticated, user])

  function sendGlobalMessage(message: string) {
    const content = message.trim()

    if (!content) return

    if (!socketRef.current || !isConnected) {
      setChatError("Chat ist nicht verbunden.")
      return
    }

    socketRef.current.emit("global:message", {
      content,
    })
  }

  function toggleGlobalChat() {
    setIsGlobalChatOpen((prev) => !prev)
  }

  function closeGlobalChat() {
    setIsGlobalChatOpen(false)
  }

  function openGlobalChat() {
    setIsGlobalChatOpen(true)
  }

  return (
    <ChatContext.Provider
      value={{
        globalMessages,
        isGlobalChatOpen,
        isConnected,
        chatError,
        sendGlobalMessage,
        toggleGlobalChat,
        closeGlobalChat,
        openGlobalChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)

  if (!context) {
    throw new Error("useChat must be used inside ChatProvider")
  }

  return context
}