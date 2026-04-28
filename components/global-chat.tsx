"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@/context/chat-context"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  X,
  Minus,
  Send,
  Users,
  ChevronUp,
  Wifi,
  WifiOff,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function GlobalChat() {
  const { user } = useAuth()
  const {
    globalMessages,
    isGlobalChatOpen,
    isConnected,
    chatError,
    sendGlobalMessage,
    toggleGlobalChat,
    closeGlobalChat,
  } = useChat()

  const [message, setMessage] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isGlobalChatOpen && !isMinimized) {
      scrollToBottom()
    }
  }, [globalMessages, isGlobalChatOpen, isMinimized])

  function handleSend() {
    if (!message.trim()) return

    sendGlobalMessage(message)
    setMessage("")
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!user) {
    return null
  }

  if (!isGlobalChatOpen) {
    return (
      <Button
        onClick={toggleGlobalChat}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary shadow-lg hover:bg-primary/90 neon-glow"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />

        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-secondary-foreground">
          {globalMessages.length > 99 ? "99+" : globalMessages.length}
        </span>

        <span
          className={cn(
            "absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-card",
            isConnected ? "bg-green-500" : "bg-red-500"
          )}
        />
      </Button>
    )
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex w-80 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl transition-all duration-200 sm:w-96",
        isMinimized ? "h-12" : "h-[500px]"
      )}
    >
      <div
        className="flex cursor-pointer items-center justify-between border-b border-border bg-muted/50 px-4 py-3"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
            <Users className="h-4 w-4 text-primary" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">Global Chat</h3>

              {isConnected ? (
                <Wifi className="h-3 w-3 text-green-400" />
              ) : (
                <WifiOff className="h-3 w-3 text-red-400" />
              )}
            </div>

            {!isMinimized && (
              <p className="text-[10px] text-muted-foreground">
                {isConnected ? "Live connected" : "Disconnected"} ·{" "}
                {globalMessages.length} messages
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation()
              setIsMinimized(!isMinimized)
            }}
          >
            {isMinimized ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <Minus className="h-4 w-4" />
            )}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              closeGlobalChat()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4">
            {chatError && (
              <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-400">
                <AlertTriangle className="h-4 w-4" />
                {chatError}
              </div>
            )}

            {globalMessages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                <MessageCircle className="mb-2 h-8 w-8 opacity-50" />
                <p className="text-sm">No messages yet</p>
                <p className="text-xs">Start the global conversation.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {globalMessages.map((msg) => {
                  const isOwn = msg.senderId === user?.id

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col",
                        isOwn ? "items-end" : "items-start"
                      )}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        {!isOwn && (
                          <>
                            <span className="text-xs font-medium text-primary">
                              {msg.senderUsername}
                            </span>

                            <Badge
                              variant="outline"
                              className="h-4 border-primary/30 px-1 text-[9px] text-primary"
                            >
                              Lvl {msg.senderLevel}
                            </Badge>
                          </>
                        )}

                        <span className="text-[10px] text-muted-foreground">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>

                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-2",
                          isOwn
                            ? "rounded-br-sm bg-primary text-primary-foreground"
                            : "rounded-bl-sm bg-muted"
                        )}
                      >
                        <p className="break-words text-sm">{msg.content}</p>
                      </div>
                    </div>
                  )
                })}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="border-t border-border p-3">
            <div className="flex gap-2">
              <Input
                placeholder={isConnected ? "Type a message..." : "Connecting..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-background text-sm"
                maxLength={500}
                disabled={!isConnected}
              />

              <Button
                size="icon"
                onClick={handleSend}
                disabled={!message.trim() || !isConnected}
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <p className="mt-1 text-[10px] text-muted-foreground">
              {message.length}/500
            </p>
          </div>
        </>
      )}
    </div>
  )
}