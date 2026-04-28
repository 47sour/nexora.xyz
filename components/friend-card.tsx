"use client"

import { Friend } from '@/data/friends'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Gamepad2, Clock, Send, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FriendCardProps {
  friend: Friend
  onInvite?: (friendId: string) => void
  onChat?: (friend: { id: string; username: string }) => void
  compact?: boolean
}

const statusColors = {
  online: 'bg-green-500',
  'in-game': 'bg-secondary',
  away: 'bg-amber-500',
  offline: 'bg-muted-foreground/50'
}

const statusLabels = {
  online: 'Online',
  'in-game': 'In Game',
  away: 'Away',
  offline: 'Offline'
}

export function FriendCard({ friend, onInvite, onChat, compact = false }: FriendCardProps) {
  const isOnline = friend.status === 'online' || friend.status === 'in-game'

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <User className="h-5 w-5 text-primary" />
          </div>
          <span 
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
              statusColors[friend.status]
            )}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium">{friend.username}</p>
            <Badge variant="outline" className="h-5 shrink-0 border-primary/30 px-1.5 text-[10px] text-primary">
              Lvl {friend.level}
            </Badge>
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {friend.status === 'in-game' && friend.currentGame
              ? `Playing ${friend.currentGame}`
              : statusLabels[friend.status]}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {onChat && (
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 shrink-0 text-secondary hover:bg-secondary/20 hover:text-secondary"
              onClick={() => onChat({ id: friend.id, username: friend.username })}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          )}
          {isOnline && onInvite && (
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 shrink-0"
              onClick={() => onInvite(friend.id)}
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="card-hover border-border bg-card">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20">
              <User className="h-7 w-7 text-primary" />
            </div>
            <span 
              className={cn(
                "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-card",
                statusColors[friend.status]
              )}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold">{friend.username}</h3>
              <Badge variant="outline" className="shrink-0 border-primary/30 text-xs text-primary">
                Lvl {friend.level}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {friend.status === 'in-game' && friend.currentGame ? (
                <>
                  <Gamepad2 className="h-4 w-4 text-secondary" />
                  <span className="truncate">Playing {friend.currentGame}</span>
                </>
              ) : friend.status === 'offline' && friend.lastOnline ? (
                <>
                  <Clock className="h-4 w-4" />
                  <span>Last online {friend.lastOnline}</span>
                </>
              ) : (
                <span className="capitalize">{statusLabels[friend.status]}</span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          {onChat && (
            <Button 
              className="flex-1" 
              variant="outline"
              onClick={() => onChat({ id: friend.id, username: friend.username })}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Message
            </Button>
          )}
          {isOnline && onInvite && (
            <Button 
              className="flex-1" 
              variant={onChat ? "default" : "outline"}
              onClick={() => onInvite(friend.id)}
            >
              <Send className="mr-2 h-4 w-4" />
              Invite
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
