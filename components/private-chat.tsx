"use client"

import { useState, useRef, useEffect } from 'react'
import { useChat, PrivateChat as PrivateChatType } from '@/context/chat-context'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  Minus,
  Send,
  User,
  ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PrivateChatWindowProps {
  chat: PrivateChatType
  index: number
}

function PrivateChatWindow({ chat, index }: PrivateChatWindowProps) {
  const { user } = useAuth()
  const { sendPrivateMessage, closePrivateChat, toggleMinimizePrivateChat } = useChat()
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (!chat.isMinimized) {
      scrollToBottom()
    }
  }, [chat.messages, chat.isMinimized])

  const handleSend = () => {
    if (!message.trim()) return
    sendPrivateMessage(chat.oderId, message)
    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // Calculate position - stack from right, below global chat
  const rightOffset = 24 + (index * 320) + (index * 16) + 400 // 400px for global chat space

  return (
    <div 
      className={cn(
        "fixed bottom-6 z-40 flex w-72 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl transition-all duration-200 sm:w-80",
        chat.isMinimized ? "h-12" : "h-96"
      )}
      style={{ right: `${rightOffset}px` }}
    >
      {/* Header */}
      <div 
        className="flex cursor-pointer items-center justify-between border-b border-border bg-secondary/10 px-3 py-2"
        onClick={() => toggleMinimizePrivateChat(chat.oderId)}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary/20">
              <User className="h-3.5 w-3.5 text-secondary" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-green-500" />
          </div>
          <span className="text-sm font-medium">{chat.odreUsername}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              toggleMinimizePrivateChat(chat.oderId)
            }}
          >
            {chat.isMinimized ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <Minus className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              closePrivateChat(chat.oderId)
            }}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      {!chat.isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-3">
            {chat.messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                  <User className="h-6 w-6 text-secondary" />
                </div>
                <p className="text-sm font-medium">{chat.odreUsername}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Start a conversation
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {chat.messages.map((msg) => {
                  const isOwn = msg.senderId === user?.id
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col",
                        isOwn ? "items-end" : "items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-3 py-2",
                          isOwn 
                            ? "rounded-br-sm bg-secondary text-secondary-foreground" 
                            : "rounded-bl-sm bg-muted"
                        )}
                      >
                        <p className="break-words text-sm">{msg.content}</p>
                      </div>
                      <span className="mt-0.5 text-[9px] text-muted-foreground">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-2">
            <div className="flex gap-2">
              <Input
                placeholder="Message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-8 bg-background text-sm"
                maxLength={500}
              />
              <Button 
                size="icon" 
                variant="secondary"
                className="h-8 w-8 shrink-0"
                onClick={handleSend}
                disabled={!message.trim()}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function PrivateChatContainer() {
  const { privateChats } = useChat()

  const openChats = privateChats.filter(c => c.isOpen)

  if (openChats.length === 0) return null

  return (
    <>
      {openChats.map((chat, index) => (
        <PrivateChatWindow key={chat.oderId} chat={chat} index={index} />
      ))}
    </>
  )
}
