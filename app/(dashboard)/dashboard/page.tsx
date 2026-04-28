"use client"

import Link from 'next/link'
import { useAuth } from '@/context/auth-context'
import { DashboardCard } from '@/components/dashboard-card'
import { GameCard } from '@/components/game-card'
import { FriendCard } from '@/components/friend-card'
import { InviteCard } from '@/components/invite-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { games } from '@/data/games'
import { getOnlineFriends } from '@/data/friends'
import { getPendingInvites } from '@/data/invites'
import { userStats } from '@/data/user-stats'
import { 
  Gamepad2, 
  Trophy, 
  Clock, 
  TrendingUp,
  Users,
  Swords,
  ChevronRight,
  Sparkles,
  Shield
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const onlineFriends = getOnlineFriends()
  const pendingInvites = getPendingInvites(user?.id || '2')
  const recentGames = games.slice(0, 4)

  const handleInviteFriend = (friendId: string) => {
    alert('Invite sent! (Demo - no actual invite sent)')
  }

  const handleAcceptInvite = (inviteId: string) => {
    alert('Invite accepted! (Demo - no actual action)')
  }

  const handleDeclineInvite = (inviteId: string) => {
    alert('Invite declined! (Demo - no actual action)')
  }

  const currentLevel = user?.level || userStats.level
  const currentXp = user?.xp || userStats.xp
  const xpProgress = (currentXp / userStats.xpToNextLevel) * 100

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-secondary" />
          Welcome back
        </div>
        <div className="mt-1 flex items-center gap-3">
          <h1 className="text-3xl font-bold">
            Hello, <span className="text-primary neon-text">{user?.username || 'Player'}</span>!
          </h1>
          {user?.role === 'admin' && (
            <Badge className="bg-amber-500/20 text-amber-400">
              <Shield className="mr-1 h-3 w-3" />
              Admin
            </Badge>
          )}
        </div>
        <p className="mt-2 text-muted-foreground">
          {"Ready to play? Here's what's happening on Nexora."}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Your Level"
          value={`Level ${currentLevel}`}
          icon={Trophy}
          description={`${currentXp.toLocaleString()} XP`}
          variant="primary"
        />
        <DashboardCard
          title="Total Games"
          value={userStats.totalGamesPlayed}
          icon={Gamepad2}
          description="games played"
          variant="secondary"
        />
        <DashboardCard
          title="Play Time"
          value={userStats.totalPlayTime}
          icon={Clock}
          description="total hours"
        />
        <DashboardCard
          title="This Week"
          value={userStats.gamesThisWeek}
          icon={TrendingUp}
          description="games played"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-8 lg:col-span-2">
          {/* Quick Actions */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Swords className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                <Button className="w-full neon-glow" asChild>
                  <Link href="/games">
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Play Now
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/friends">
                    <Users className="mr-2 h-4 w-4" />
                    Find Friends
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/lobby">
                    <Swords className="mr-2 h-4 w-4" />
                    Join Lobby
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Games Overview */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Games</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/games">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {recentGames.map((game) => (
                <GameCard key={game.id} game={game} variant="compact" />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Level Progress */}
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-semibold">Level {currentLevel}</span>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {currentXp.toLocaleString()} XP
                </Badge>
              </div>
              <div className="mb-2 h-3 overflow-hidden rounded-full bg-muted">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {(userStats.xpToNextLevel - currentXp).toLocaleString()} XP to Level {currentLevel + 1}
              </p>
            </CardContent>
          </Card>

          {/* Pending Invites */}
          {pendingInvites.length > 0 && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Swords className="h-5 w-5 text-secondary" />
                Invitations
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                  {pendingInvites.length}
                </span>
              </h3>
              <div className="space-y-3">
                {pendingInvites.slice(0, 2).map((invite) => (
                  <InviteCard
                    key={invite.id}
                    invite={invite}
                    onAccept={handleAcceptInvite}
                    onDecline={handleDeclineInvite}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Friends Online */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Users className="h-5 w-5 text-primary" />
                Friends Online
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                  {onlineFriends.length}
                </span>
              </h3>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/friends">
                  All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <Card className="border-border bg-card">
              <CardContent className="p-2">
                {onlineFriends.length > 0 ? (
                  <div className="space-y-1">
                    {onlineFriends.slice(0, 5).map((friend) => (
                      <FriendCard
                        key={friend.id}
                        friend={friend}
                        compact
                        onInvite={handleInviteFriend}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No friends online
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
