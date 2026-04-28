"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/auth-context'
import { PlaceholderPanel } from '@/components/placeholder-panel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { games } from '@/data/games'
import { getOnlineFriends } from '@/data/friends'
import { 
  Swords, 
  User, 
  Crown,
  Play,
  Copy,
  Users,
  Gamepad2,
  Check,
  Clock
} from 'lucide-react'

type LobbyStatus = 'waiting' | 'ready' | 'starting'

export default function LobbyPage() {
  const { user } = useAuth()
  const onlineFriends = getOnlineFriends()
  const [selectedGame, setSelectedGame] = useState(games[0])
  const [lobbyStatus, setLobbyStatus] = useState<LobbyStatus>('waiting')
  const [copied, setCopied] = useState(false)

  // Demo lobby data
  const lobbyCode = 'NEXORA-7X9K2'
  const players = [
    { id: '1', username: user?.username || 'Player', level: user?.level || 24, isHost: true, isReady: true },
    { id: '2', username: 'Waiting for player...', level: 0, isHost: false, isReady: false, isEmpty: true }
  ]

  const handleCopyCode = () => {
    navigator.clipboard.writeText(lobbyCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleStartMatch = () => {
    setLobbyStatus('starting')
    alert('Starting match... (Demo - no actual game)')
    setTimeout(() => setLobbyStatus('waiting'), 2000)
  }

  const handleInviteFriend = (friendId: string) => {
    const friend = onlineFriends.find((f) => f.id === friendId)
    console.log('[Nexora Demo] Inviting friend to lobby:', friend?.username)
    alert(`Invited ${friend?.username} to lobby! (Demo)`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20 neon-glow-secondary">
            <Swords className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Multiplayer Lobby</h1>
            <p className="text-muted-foreground">
              Create or join a lobby to play with friends
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Lobby Area */}
        <div className="space-y-6 lg:col-span-2">
          {/* Lobby Card */}
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-primary" />
                {selectedGame.name}
              </CardTitle>
              <Badge 
                variant="outline" 
                className={
                  lobbyStatus === 'ready' ? 'border-green-500 text-green-500' :
                  lobbyStatus === 'starting' ? 'border-secondary text-secondary' :
                  'border-amber-500 text-amber-500'
                }
              >
                <Clock className="mr-1 h-3 w-3" />
                {lobbyStatus === 'ready' ? 'Ready' : 
                 lobbyStatus === 'starting' ? 'Starting...' : 'Waiting for players'}
              </Badge>
            </CardHeader>
            <CardContent>
              {/* Lobby Code */}
              <div className="mb-6 flex items-center justify-between rounded-lg border border-dashed border-border bg-muted/30 p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Lobby Code</p>
                  <p className="font-mono text-xl font-bold tracking-wider">{lobbyCode}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleCopyCode}>
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              {/* Players */}
              <div className="mb-6 space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Players (1/2)</h3>
                {players.map((player, index) => (
                  <div 
                    key={player.id}
                    className={`flex items-center gap-4 rounded-lg border p-4 ${
                      player.isEmpty 
                        ? 'border-dashed border-border/50 bg-muted/20' 
                        : 'border-border bg-card'
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      player.isEmpty ? 'bg-muted/50' : 'bg-primary/20'
                    }`}>
                      {player.isEmpty ? (
                        <User className="h-6 w-6 text-muted-foreground/50" />
                      ) : (
                        <User className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`font-medium ${player.isEmpty ? 'text-muted-foreground/50' : ''}`}>
                          {player.username}
                        </p>
                        {!player.isEmpty && (
                          <Badge variant="outline" className="border-primary/30 text-xs text-primary">
                            Lvl {player.level}
                          </Badge>
                        )}
                        {player.isHost && (
                          <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">
                            <Crown className="mr-1 h-3 w-3" />
                            Host
                          </Badge>
                        )}
                      </div>
                      {!player.isEmpty && (
                        <p className="text-sm text-muted-foreground">
                          {player.isReady ? 'Ready' : 'Not ready'}
                        </p>
                      )}
                    </div>
                    {!player.isEmpty && (
                      <div className={`h-3 w-3 rounded-full ${
                        player.isReady ? 'bg-green-500' : 'bg-amber-500'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1 neon-glow" 
                  disabled={lobbyStatus === 'starting'}
                  onClick={handleStartMatch}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Match Placeholder
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/games">
                    Change Game
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Game Preview Placeholder */}
          <PlaceholderPanel
            title="Game Preview"
            description="Game preview and settings will be displayed here once real game logic is implemented."
            variant="game"
            height="md"
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Invite Friends */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Invite Friends
              </CardTitle>
            </CardHeader>
            <CardContent>
              {onlineFriends.length > 0 ? (
                <div className="space-y-2">
                  {onlineFriends.slice(0, 5).map((friend) => (
                    <div 
                      key={friend.id}
                      className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
                    >
                      <div className="relative">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{friend.username}</p>
                        <p className="text-xs text-muted-foreground">Level {friend.level}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleInviteFriend(friend.id)}
                      >
                        Invite
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  No friends online
                </p>
              )}
            </CardContent>
          </Card>

          {/* Game Selection */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gamepad2 className="h-5 w-5 text-secondary" />
                Select Game
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {games
                  .filter((g) => g.mode === 'multiplayer' || g.mode === 'both')
                  .map((game) => (
                    <button
                      key={game.id}
                      onClick={() => setSelectedGame(game)}
                      className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                        selectedGame.id === game.id
                          ? 'bg-primary/20 ring-1 ring-primary'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Gamepad2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{game.name}</p>
                        <p className="text-xs text-muted-foreground">{game.players} players</p>
                      </div>
                    </button>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Lobby Info */}
          <Card className="border-dashed border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <p className="text-center text-sm text-muted-foreground">
                <span className="font-medium text-primary">Multiplayer Placeholder</span>
                <br />
                Real multiplayer functionality will be added in a future update.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
