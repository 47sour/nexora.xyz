"use client"

import { useAuth } from '@/context/auth-context'
import { DashboardCard } from '@/components/dashboard-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { userStats, achievements } from '@/data/user-stats'
import { 
  User, 
  Trophy, 
  Gamepad2, 
  Clock, 
  TrendingUp,
  Target,
  Flame,
  Star,
  Award,
  Zap,
  Crown,
  Medal,
  Settings,
  Edit
} from 'lucide-react'
import { cn } from '@/lib/utils'

const rarityColors = {
  common: 'border-muted-foreground/30 bg-muted/30 text-muted-foreground',
  rare: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  epic: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
  legendary: 'border-amber-500/30 bg-amber-500/10 text-amber-400'
}

const achievementIcons: Record<string, React.ElementType> = {
  trophy: Trophy,
  zap: Zap,
  puzzle: Target,
  users: User,
  flame: Flame,
  crown: Crown,
  clock: Clock,
  award: Award
}

export default function ProfilePage() {
  const { user } = useAuth()

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const xpProgress = (userStats.xp / userStats.xpToNextLevel) * 100

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="mb-8">
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              {/* Avatar */}
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 ring-4 ring-primary/30 neon-glow">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <Badge 
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground"
                >
                  Lvl {user?.level || userStats.level}
                </Badge>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="mb-1 text-2xl font-bold">{user?.username || 'Player'}</h1>
                <p className="mb-2 text-muted-foreground">{user?.email}</p>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    <Star className="mr-1 h-3 w-3" />
                    {userStats.totalGamesPlayed} Games Played
                  </Badge>
                  {user?.role === 'admin' && (
                    <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">
                      <Crown className="mr-1 h-3 w-3" />
                      Admin
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* XP Progress */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Level {user?.level || userStats.level} Progress</span>
                <span>{userStats.xp.toLocaleString()} / {userStats.xpToNextLevel.toLocaleString()} XP</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {(userStats.xpToNextLevel - userStats.xp).toLocaleString()} XP until Level {(user?.level || userStats.level) + 1}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Games Played"
          value={userStats.totalGamesPlayed}
          icon={Gamepad2}
          variant="primary"
        />
        <DashboardCard
          title="Total Play Time"
          value={userStats.totalPlayTime}
          icon={Clock}
          variant="secondary"
        />
        <DashboardCard
          title="Games This Week"
          value={userStats.gamesThisWeek}
          icon={TrendingUp}
        />
        <DashboardCard
          title="Longest Session"
          value={userStats.longestSession}
          icon={Flame}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Achievements */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-primary" />
                  Achievements
                </span>
                <Badge variant="secondary">
                  {unlockedCount}/{achievements.length} Unlocked
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {achievements.map((achievement) => {
                  const Icon = achievementIcons[achievement.icon] || Award
                  return (
                    <div
                      key={achievement.id}
                      className={cn(
                        "rounded-lg border p-4 transition-all",
                        achievement.unlocked
                          ? rarityColors[achievement.rarity]
                          : "border-border/50 bg-muted/20 opacity-60"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                          achievement.unlocked ? "bg-current/10" : "bg-muted"
                        )}>
                          <Icon className={cn(
                            "h-5 w-5",
                            achievement.unlocked ? "text-current" : "text-muted-foreground"
                          )} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="truncate font-medium">{achievement.name}</h4>
                            <Badge 
                              variant="outline" 
                              className="shrink-0 text-[10px] capitalize"
                            >
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                          {!achievement.unlocked && achievement.progress !== undefined && (
                            <div className="mt-2">
                              <div className="mb-1 flex justify-between text-xs">
                                <span>Progress</span>
                                <span>{achievement.progress} / {achievement.maxProgress}</span>
                              </div>
                              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                <div 
                                  className="h-full rounded-full bg-primary"
                                  style={{ 
                                    width: `${Math.min((achievement.progress! / achievement.maxProgress!) * 100, 100)}%` 
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          {achievement.unlocked && achievement.unlockedAt && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Unlocked {achievement.unlockedAt}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Games</span>
                  <span className="font-medium">{userStats.totalGamesPlayed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Play Time</span>
                  <span className="font-medium">{userStats.totalPlayTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Favorite Game</span>
                  <span className="font-medium">{userStats.favoriteGame}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Games This Week</span>
                  <span className="font-medium">{userStats.gamesThisWeek}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Longest Session</span>
                  <span className="font-medium">{userStats.longestSession}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Username</span>
                  <span className="font-medium">{user?.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="truncate font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-medium">{user?.createdAt || '2024-01-01'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <Badge variant="outline" className="capitalize">{user?.role}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level</span>
                  <Badge className="bg-primary text-primary-foreground">
                    {user?.level || userStats.level}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prototype Notice */}
          <Card className="border-dashed border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <p className="text-center text-sm text-muted-foreground">
                <span className="font-medium text-primary">Profile Placeholder</span>
                <br />
                Real profile editing will be added in a future update.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
