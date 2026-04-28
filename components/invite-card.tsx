"use client"

import { Invite } from '@/data/invites'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Gamepad2, UserPlus, Check, X } from 'lucide-react'

interface InviteCardProps {
  invite: Invite
  onAccept?: (inviteId: string) => void
  onDecline?: (inviteId: string) => void
}

export function InviteCard({ invite, onAccept, onDecline }: InviteCardProps) {
  const isGameInvite = invite.type === 'game'

  return (
    <Card className="card-hover border-border bg-card">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {isGameInvite ? (
                <Gamepad2 className="h-4 w-4 text-secondary" />
              ) : (
                <UserPlus className="h-4 w-4 text-accent" />
              )}
              <span className="text-sm font-medium">
                {isGameInvite ? 'Game Invite' : 'Friend Request'}
              </span>
            </div>
            <p className="mt-1 font-semibold">{invite.from.username}</p>
            {isGameInvite && invite.game && (
              <p className="text-sm text-muted-foreground">
                wants to play {invite.game}
              </p>
            )}
            {!isGameInvite && (
              <p className="text-sm text-muted-foreground">
                wants to be your friend
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onAccept?.(invite.id)}
          >
            <Check className="mr-1 h-4 w-4" />
            Accept
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={() => onDecline?.(invite.id)}
          >
            <X className="mr-1 h-4 w-4" />
            Decline
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
