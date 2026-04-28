"use client"

import { useState } from 'react'
import { useAuth } from '@/context/auth-context'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getAllUsers, DemoUser } from '@/config/auth-config'
import { games as allGames, Game } from '@/data/games'
import {
  Shield,
  Users,
  Search,
  MoreVertical,
  Ban,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Crown,
  Filter,
  UserX,
  UserCheck,
  Eye,
  Gamepad2,
  Settings,
  ToggleLeft,
  ToggleRight,
  Play,
  TrendingUp,
  Star,
  Activity,
  Bell,
  Mail,
  Globe,
  Lock,
  Database,
  Trash2,
  Edit3,
  Power,
  PowerOff
} from 'lucide-react'
import { cn } from '@/lib/utils'

type StatusFilter = 'all' | 'active' | 'banned' | 'timeout'
type ActionType = 'ban' | 'timeout' | 'unban' | 'view'
type AdminTab = 'users' | 'games' | 'settings'

interface ActionModalState {
  isOpen: boolean
  type: ActionType | null
  user: DemoUser | null
}

interface GameModalState {
  isOpen: boolean
  game: Game | null
  action: 'toggle' | 'edit' | 'delete' | null
}

const statusConfig = {
  active: {
    label: 'Active',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: CheckCircle
  },
  banned: {
    label: 'Banned',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: XCircle
  },
  timeout: {
    label: 'Timeout',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: Clock
  }
}

// Platform settings state
interface PlatformSettings {
  maintenanceMode: boolean
  registrationEnabled: boolean
  emailNotifications: boolean
  publicLeaderboards: boolean
  friendRequests: boolean
  chatEnabled: boolean
  maxPlayersPerLobby: number
  sessionTimeout: number
  minPasswordLength: number
}

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState<AdminTab>('users')
  const [searchQuery, setSearchQuery] = useState('')
  const [gameSearchQuery, setGameSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [actionModal, setActionModal] = useState<ActionModalState>({
    isOpen: false,
    type: null,
    user: null
  })
  const [gameModal, setGameModal] = useState<GameModalState>({
    isOpen: false,
    game: null,
    action: null
  })
  const [banReason, setBanReason] = useState('')
  const [timeoutDuration, setTimeoutDuration] = useState('1h')
  
  // Platform settings
  const [settings, setSettings] = useState<PlatformSettings>({
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    publicLeaderboards: true,
    friendRequests: true,
    chatEnabled: true,
    maxPlayersPerLobby: 8,
    sessionTimeout: 30,
    minPasswordLength: 8
  })

  // Redirect non-admins
  if (!isAuthenticated || user?.role !== 'admin') {
    redirect('/dashboard')
  }

  const allUsers = getAllUsers()
  
  // Filter users
  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch = 
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Filter games
  const filteredGames = allGames.filter((g) => 
    g.name.toLowerCase().includes(gameSearchQuery.toLowerCase()) ||
    g.genre.toLowerCase().includes(gameSearchQuery.toLowerCase())
  )

  const userStats = {
    total: allUsers.length,
    active: allUsers.filter((u) => u.status === 'active').length,
    banned: allUsers.filter((u) => u.status === 'banned').length,
    timeout: allUsers.filter((u) => u.status === 'timeout').length
  }

  const gameStats = {
    total: allGames.length,
    enabled: allGames.filter((g) => g.enabled).length,
    disabled: allGames.filter((g) => !g.enabled).length,
    totalPlays: allGames.reduce((acc, g) => acc + g.playCount, 0)
  }

  const openActionModal = (type: ActionType, targetUser: DemoUser) => {
    setActionModal({ isOpen: true, type, user: targetUser })
    setBanReason('')
    setTimeoutDuration('1h')
  }

  const closeModal = () => {
    setActionModal({ isOpen: false, type: null, user: null })
  }

  const openGameModal = (action: 'toggle' | 'edit' | 'delete', game: Game) => {
    setGameModal({ isOpen: true, game, action })
  }

  const closeGameModal = () => {
    setGameModal({ isOpen: false, game: null, action: null })
  }

  const handleAction = () => {
    if (!actionModal.user) return
    
    const action = actionModal.type
    const targetUser = actionModal.user
    
    if (action === 'ban') {
      alert(`[Demo] User "${targetUser.username}" would be banned.\nReason: ${banReason || 'No reason provided'}`)
    } else if (action === 'timeout') {
      alert(`[Demo] User "${targetUser.username}" would be timed out for ${timeoutDuration}`)
    } else if (action === 'unban') {
      alert(`[Demo] User "${targetUser.username}" would be unbanned/timeout removed`)
    }
    
    closeModal()
  }

  const handleGameAction = () => {
    if (!gameModal.game) return
    
    const action = gameModal.action
    const game = gameModal.game
    
    if (action === 'toggle') {
      alert(`[Demo] Game "${game.name}" would be ${game.enabled ? 'disabled' : 'enabled'}`)
    } else if (action === 'delete') {
      alert(`[Demo] Game "${game.name}" would be deleted`)
    }
    
    closeGameModal()
  }

  const handleSettingChange = (key: keyof PlatformSettings, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    // Demo: In real app, this would save to backend
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
            <Shield className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage users, games, and platform settings</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AdminTab)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:inline-flex">
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="games" className="gap-2">
            <Gamepad2 className="h-4 w-4" />
            <span className="hidden sm:inline">Games</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          {/* User Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userStats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
                  <UserCheck className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userStats.active}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20">
                  <Clock className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userStats.timeout}</p>
                  <p className="text-sm text-muted-foreground">Timed Out</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/20">
                  <UserX className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userStats.banned}</p>
                  <p className="text-sm text-muted-foreground">Banned</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Management Card */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                User Management
              </CardTitle>
              <CardDescription>View and manage all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="timeout">Timed Out</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* User Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">User</th>
                      <th className="pb-3 font-medium">Level</th>
                      <th className="pb-3 font-medium">Role</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="hidden pb-3 font-medium md:table-cell">Joined</th>
                      <th className="pb-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredUsers.map((targetUser) => {
                      const status = statusConfig[targetUser.status]
                      const StatusIcon = status.icon
                      const isCurrentUser = targetUser.id === user?.id
                      
                      return (
                        <tr key={targetUser.id} className="group">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{targetUser.username}</span>
                                  {isCurrentUser && (
                                    <Badge variant="outline" className="text-xs">You</Badge>
                                  )}
                                </div>
                                <span className="text-sm text-muted-foreground">{targetUser.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge variant="outline" className="border-primary/30 text-primary">
                              Lvl {targetUser.level}
                            </Badge>
                          </td>
                          <td className="py-4">
                            {targetUser.role === 'admin' ? (
                              <Badge className="bg-amber-500/20 text-amber-400">
                                <Crown className="mr-1 h-3 w-3" />
                                Admin
                              </Badge>
                            ) : (
                              <Badge variant="secondary">User</Badge>
                            )}
                          </td>
                          <td className="py-4">
                            <Badge variant="outline" className={cn("gap-1", status.color)}>
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </Badge>
                          </td>
                          <td className="hidden py-4 text-sm text-muted-foreground md:table-cell">
                            {targetUser.createdAt}
                          </td>
                          <td className="py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  disabled={isCurrentUser}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openActionModal('view', targetUser)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {targetUser.status === 'active' && (
                                  <>
                                    <DropdownMenuItem 
                                      onClick={() => openActionModal('timeout', targetUser)}
                                      className="text-amber-400 focus:text-amber-400"
                                    >
                                      <Clock className="mr-2 h-4 w-4" />
                                      Timeout
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => openActionModal('ban', targetUser)}
                                      className="text-red-400 focus:text-red-400"
                                    >
                                      <Ban className="mr-2 h-4 w-4" />
                                      Ban User
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {(targetUser.status === 'banned' || targetUser.status === 'timeout') && (
                                  <DropdownMenuItem 
                                    onClick={() => openActionModal('unban', targetUser)}
                                    className="text-green-400 focus:text-green-400"
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Remove {targetUser.status === 'banned' ? 'Ban' : 'Timeout'}
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="py-12 text-center">
                  <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No users found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Games Tab */}
        <TabsContent value="games" className="space-y-6">
          {/* Game Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                  <Gamepad2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{gameStats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Games</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
                  <Power className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{gameStats.enabled}</p>
                  <p className="text-sm text-muted-foreground">Enabled</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/20">
                  <PowerOff className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{gameStats.disabled}</p>
                  <p className="text-sm text-muted-foreground">Disabled</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/20">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{gameStats.totalPlays.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Plays</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game Management */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-primary" />
                Game Management
              </CardTitle>
              <CardDescription>Enable, disable, or modify games on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="mb-6">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search games..."
                    value={gameSearchQuery}
                    onChange={(e) => setGameSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Games Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredGames.map((game) => (
                  <div 
                    key={game.id}
                    className={cn(
                      "group relative overflow-hidden rounded-xl border bg-card transition-all",
                      game.enabled ? "border-border" : "border-red-500/30 opacity-60"
                    )}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden">
                      {game.thumbnail ? (
                        <Image
                          src={game.thumbnail}
                          alt={game.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <Gamepad2 className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      
                      {/* Status Badge */}
                      <div className="absolute right-2 top-2">
                        <Badge className={cn(
                          "text-xs",
                          game.enabled 
                            ? "bg-green-500/90 text-white" 
                            : "bg-red-500/90 text-white"
                        )}>
                          {game.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      
                      {/* Game Info Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-3">
                        <h3 className="font-bold text-white">{game.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-white/70">
                          <span>{game.genre}</span>
                          <span>|</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {game.rating}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between border-t border-border p-3">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{game.playCount.toLocaleString()}</span> plays
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={game.enabled ? "outline" : "default"}
                          className={cn(
                            "h-8",
                            !game.enabled && "bg-green-600 hover:bg-green-700"
                          )}
                          onClick={() => openGameModal('toggle', game)}
                        >
                          {game.enabled ? (
                            <>
                              <PowerOff className="mr-1 h-3 w-3" />
                              Disable
                            </>
                          ) : (
                            <>
                              <Power className="mr-1 h-3 w-3" />
                              Enable
                            </>
                          )}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Stats
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit3 className="mr-2 h-4 w-4" />
                              Edit Game
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-400 focus:text-red-400"
                              onClick={() => openGameModal('delete', game)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Game
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="py-12 text-center">
                  <Gamepad2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No games found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* General Settings */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  General Settings
                </CardTitle>
                <CardDescription>Configure platform-wide settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      Maintenance Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Disable access for all non-admin users
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(v) => handleSettingChange('maintenanceMode', v)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      User Registration
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register
                    </p>
                  </div>
                  <Switch
                    checked={settings.registrationEnabled}
                    onCheckedChange={(v) => handleSettingChange('registrationEnabled', v)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Public Leaderboards
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Show leaderboards to non-logged users
                    </p>
                  </div>
                  <Switch
                    checked={settings.publicLeaderboards}
                    onCheckedChange={(v) => handleSettingChange('publicLeaderboards', v)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Settings */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Social Features
                </CardTitle>
                <CardDescription>Manage social and communication features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Friend Requests
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to send friend requests
                    </p>
                  </div>
                  <Switch
                    checked={settings.friendRequests}
                    onCheckedChange={(v) => handleSettingChange('friendRequests', v)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      In-Game Chat
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enable chat in lobbies and games
                    </p>
                  </div>
                  <Switch
                    checked={settings.chatEnabled}
                    onCheckedChange={(v) => handleSettingChange('chatEnabled', v)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Send email notifications to users
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(v) => handleSettingChange('emailNotifications', v)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Security
                </CardTitle>
                <CardDescription>Security and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Select 
                    value={settings.sessionTimeout.toString()} 
                    onValueChange={(v) => handleSettingChange('sessionTimeout', parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="1440">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Minimum Password Length</Label>
                  <Select 
                    value={settings.minPasswordLength.toString()} 
                    onValueChange={(v) => handleSettingChange('minPasswordLength', parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 characters</SelectItem>
                      <SelectItem value="8">8 characters</SelectItem>
                      <SelectItem value="10">10 characters</SelectItem>
                      <SelectItem value="12">12 characters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lobby Settings */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                  Game Settings
                </CardTitle>
                <CardDescription>Configure game and lobby settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Max Players Per Lobby</Label>
                  <Select 
                    value={settings.maxPlayersPerLobby.toString()} 
                    onValueChange={(v) => handleSettingChange('maxPlayersPerLobby', parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 players</SelectItem>
                      <SelectItem value="4">4 players</SelectItem>
                      <SelectItem value="6">6 players</SelectItem>
                      <SelectItem value="8">8 players</SelectItem>
                      <SelectItem value="10">10 players</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-400" />
                    <div>
                      <p className="font-medium text-amber-400">Demo Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Settings changes are not persisted in this demo. Connect a database to enable persistent settings.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* User Action Modals */}
      <Dialog open={actionModal.isOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent>
          {actionModal.type === 'view' && actionModal.user && (
            <>
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>
                  Viewing details for {actionModal.user.username}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{actionModal.user.username}</h3>
                    <p className="text-muted-foreground">{actionModal.user.email}</p>
                  </div>
                </div>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium">{actionModal.user.level}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">XP</span>
                    <span className="font-medium">{actionModal.user.xp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-medium capitalize">{actionModal.user.role}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline" className={statusConfig[actionModal.user.status].color}>
                      {statusConfig[actionModal.user.status].label}
                    </Badge>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Joined</span>
                    <span className="font-medium">{actionModal.user.createdAt}</span>
                  </div>
                  {actionModal.user.banReason && (
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Ban Reason</span>
                      <span className="font-medium text-red-400">{actionModal.user.banReason}</span>
                    </div>
                  )}
                  {actionModal.user.timeoutUntil && (
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Timeout Until</span>
                      <span className="font-medium text-amber-400">{actionModal.user.timeoutUntil}</span>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeModal}>Close</Button>
              </DialogFooter>
            </>
          )}

          {actionModal.type === 'ban' && actionModal.user && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-400">
                  <Ban className="h-5 w-5" />
                  Ban User
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to ban {actionModal.user.username}?
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label className="mb-2 block">Reason for ban</Label>
                <Textarea
                  placeholder="Enter reason..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeModal}>Cancel</Button>
                <Button variant="destructive" onClick={handleAction}>
                  <Ban className="mr-2 h-4 w-4" />
                  Ban User
                </Button>
              </DialogFooter>
            </>
          )}

          {actionModal.type === 'timeout' && actionModal.user && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-amber-400">
                  <Clock className="h-5 w-5" />
                  Timeout User
                </DialogTitle>
                <DialogDescription>
                  Temporarily restrict {actionModal.user.username} from the platform.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label className="mb-2 block">Timeout Duration</Label>
                <Select value={timeoutDuration} onValueChange={setTimeoutDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="6h">6 Hours</SelectItem>
                    <SelectItem value="12h">12 Hours</SelectItem>
                    <SelectItem value="24h">24 Hours</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeModal}>Cancel</Button>
                <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleAction}>
                  <Clock className="mr-2 h-4 w-4" />
                  Apply Timeout
                </Button>
              </DialogFooter>
            </>
          )}

          {actionModal.type === 'unban' && actionModal.user && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  Remove Restriction
                </DialogTitle>
                <DialogDescription>
                  Remove {actionModal.user.status === 'banned' ? 'ban' : 'timeout'} from {actionModal.user.username}?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={closeModal}>Cancel</Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleAction}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Game Action Modal */}
      <Dialog open={gameModal.isOpen} onOpenChange={(open) => !open && closeGameModal()}>
        <DialogContent>
          {gameModal.action === 'toggle' && gameModal.game && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {gameModal.game.enabled ? (
                    <PowerOff className="h-5 w-5 text-red-400" />
                  ) : (
                    <Power className="h-5 w-5 text-green-400" />
                  )}
                  {gameModal.game.enabled ? 'Disable' : 'Enable'} Game
                </DialogTitle>
                <DialogDescription>
                  {gameModal.game.enabled 
                    ? `Disable "${gameModal.game.name}"? Users won't be able to play this game.`
                    : `Enable "${gameModal.game.name}"? Users will be able to play this game.`
                  }
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={closeGameModal}>Cancel</Button>
                <Button 
                  className={gameModal.game.enabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                  onClick={handleGameAction}
                >
                  {gameModal.game.enabled ? 'Disable' : 'Enable'} Game
                </Button>
              </DialogFooter>
            </>
          )}

          {gameModal.action === 'delete' && gameModal.game && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-400">
                  <Trash2 className="h-5 w-5" />
                  Delete Game
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{gameModal.game.name}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                <p className="text-sm text-red-400">
                  Warning: All player statistics and history for this game will be permanently deleted.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeGameModal}>Cancel</Button>
                <Button variant="destructive" onClick={handleGameAction}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Game
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
