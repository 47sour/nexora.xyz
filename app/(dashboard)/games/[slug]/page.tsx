"use client"

import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getGameBySlug, games } from '@/data/games'
import { PlaceholderPanel } from '@/components/placeholder-panel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  ArrowLeft, 
  Gamepad2, 
  Users, 
  Star, 
  Clock,
  Send,
  Play,
  Maximize2
} from 'lucide-react'

interface GameDetailPageProps {
  params: Promise<{ slug: string }>
}

export default function GameDetailPage({ params }: GameDetailPageProps) {
  const { slug } = use(params)
  const game = getGameBySlug(slug)

  if (!game) {
    notFound()
  }

  const handlePlaySolo = () => {
    alert('Starting Solo Mode... (Demo - no actual game)')
  }

  const handleInviteFriend = () => {
    alert('Opening friend invite... (Demo - no actual invite)')
  }

  // Get related games (same genre, excluding current)
  const relatedGames = games
    .filter((g) => g.genre === game.genre && g.id !== game.id)
    .slice(0, 3)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link href="/games">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Game Header with Preview */}
          <div className="mb-6">
            {/* Large Preview Thumbnail */}
            <div className="relative mb-6 aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
              {game.thumbnail ? (
                <Image
                  src={game.thumbnail}
                  alt={game.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Gamepad2 className="h-24 w-24 text-primary/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-3 bg-background/80 backdrop-blur-sm">
                      <Clock className="mr-1 h-3 w-3" />
                      {game.status === 'coming-soon' ? 'Coming Soon' : game.status}
                    </Badge>
                    <h1 className="text-3xl font-bold">{game.name}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {game.rating}
                      </span>
                      <span>{game.genre}</span>
                      <span className="flex items-center gap-1 capitalize">
                        <Users className="h-4 w-4" />
                        {game.mode === 'both' ? 'Solo & Multiplayer' : game.mode}
                      </span>
                    </div>
                  </div>
                  <Button size="icon" variant="secondary" className="h-10 w-10 shrink-0">
                    <Maximize2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground">{game.description}</p>
          </div>

          {/* Game Placeholder Area */}
          <PlaceholderPanel
            title={`${game.name} - Game Area`}
            description="Game Placeholder - Real game logic will be added later. This area will contain the actual game interface."
            variant="game"
            height="lg"
          />

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            {(game.mode === 'solo' || game.mode === 'both') && (
              <Button 
                size="lg" 
                className="neon-glow"
                onClick={handlePlaySolo}
              >
                <Play className="mr-2 h-5 w-5" />
                Play Solo
              </Button>
            )}
            {(game.mode === 'multiplayer' || game.mode === 'both') && (
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleInviteFriend}
              >
                <Send className="mr-2 h-5 w-5" />
                Invite Friend
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Game Info Card */}
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <h3 className="mb-4 font-semibold">Game Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Genre</span>
                  <span className="font-medium">{game.genre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mode</span>
                  <span className="font-medium capitalize">
                    {game.mode === 'both' ? 'Solo & Multiplayer' : game.mode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Players</span>
                  <span className="font-medium">{game.players}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {game.rating}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {game.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard Placeholder */}
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <h3 className="mb-4 font-semibold">Top Players</h3>
              <div className="space-y-3">
                {[
                  { name: 'NeonKnight', level: 32, score: 1000 },
                  { name: 'CyberWolf', level: 28, score: 850 },
                  { name: 'PixelMaster', level: 45, score: 700 }
                ].map((player, i) => (
                  <div key={player.name} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm">{player.name}</span>
                    <Badge variant="outline" className="border-primary/30 text-xs text-primary">
                      Lvl {player.level}
                    </Badge>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Leaderboard placeholder - real data coming soon
              </p>
            </CardContent>
          </Card>

          {/* Related Games */}
          {relatedGames.length > 0 && (
            <div>
              <h3 className="mb-4 font-semibold">Similar Games</h3>
              <div className="space-y-3">
                {relatedGames.map((relatedGame) => (
                  <Link
                    key={relatedGame.id}
                    href={`/games/${relatedGame.slug}`}
                    className="card-hover group flex items-center gap-3 overflow-hidden rounded-lg border border-border bg-card"
                  >
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                      {relatedGame.thumbnail ? (
                        <Image
                          src={relatedGame.thumbnail}
                          alt={relatedGame.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Gamepad2 className="h-6 w-6 text-primary/50" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 py-2 pr-3">
                      <p className="truncate text-sm font-medium">{relatedGame.name}</p>
                      <p className="text-xs text-muted-foreground">{relatedGame.genre}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
