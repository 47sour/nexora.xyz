"use client"

import { useState } from 'react'
import { FriendCard } from '@/components/friend-card'
import { friends, getOnlineFriends, getOfflineFriends } from '@/data/friends'
import { getFriendRequests } from '@/data/invites'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  UserPlus, 
  Search,
  Check,
  X,
  User
} from 'lucide-react'

export default function FriendsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [addFriendInput, setAddFriendInput] = useState('')
  
  const onlineFriends = getOnlineFriends()
  const offlineFriends = getOfflineFriends()
  const friendRequests = getFriendRequests(user?.id || '2')

  const filteredOnline = onlineFriends.filter((f) =>
    f.username.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredOffline = offlineFriends.filter((f) =>
    f.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInvite = (friendId: string) => {
    const friend = friends.find((f) => f.id === friendId)
    console.log('[Nexora Demo] Sending invite to:', friend?.username)
    alert(`Game invite sent to ${friend?.username}! (Demo - no actual invite sent)`)
  }

  const handleAddFriend = () => {
    if (!addFriendInput.trim()) return
    console.log('[Nexora Demo] Adding friend:', addFriendInput)
    alert(`Friend request sent to "${addFriendInput}"! (Demo - no actual request sent)`)
    setAddFriendInput('')
  }

  const handleAcceptRequest = (requestId: string) => {
    console.log('[Nexora Demo] Accept friend request:', requestId)
    alert('Friend request accepted! (Demo)')
  }

  const handleDeclineRequest = (requestId: string) => {
    console.log('[Nexora Demo] Decline friend request:', requestId)
    alert('Friend request declined! (Demo)')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 neon-glow">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Friends</h1>
            <p className="text-muted-foreground">
              Manage your friends and send game invites
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Friends List */}
        <div className="space-y-6 lg:col-span-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card pl-9"
            />
          </div>

          {/* Online Friends */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-lg font-semibold">Online</h2>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                {filteredOnline.length}
              </Badge>
            </div>
            {filteredOnline.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredOnline.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    onInvite={handleInvite}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center py-8 text-center">
                  <Users className="mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-muted-foreground">
                    {searchQuery ? 'No online friends match your search' : 'No friends online'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Offline Friends */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-lg font-semibold">Offline</h2>
              <Badge variant="secondary">
                {filteredOffline.length}
              </Badge>
            </div>
            {filteredOffline.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredOffline.map((friend) => (
                  <FriendCard key={friend.id} friend={friend} />
                ))}
              </div>
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center py-8 text-center">
                  <Users className="mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-muted-foreground">
                    {searchQuery ? 'No offline friends match your search' : 'All friends are online!'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Add Friend */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserPlus className="h-5 w-5 text-primary" />
                Add Friend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter username"
                  value={addFriendInput}
                  onChange={(e) => setAddFriendInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFriend()}
                  className="bg-background"
                />
                <Button 
                  onClick={handleAddFriend}
                  disabled={!addFriendInput.trim()}
                >
                  Add
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Send a friend request by username
              </p>
            </CardContent>
          </Card>

          {/* Friend Requests */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-secondary" />
                Friend Requests
                {friendRequests.length > 0 && (
                  <Badge variant="secondary" className="ml-auto bg-secondary/20 text-secondary">
                    {friendRequests.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {friendRequests.length > 0 ? (
                <div className="space-y-3">
                  {friendRequests.map((request) => (
                    <div key={request.id} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {request.from.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Wants to be friends
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-green-500 hover:bg-green-500/20 hover:text-green-400"
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-500 hover:bg-red-500/20 hover:text-red-400"
                          onClick={() => handleDeclineRequest(request.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  No pending requests
                </p>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{friends.length}</p>
                  <p className="text-xs text-muted-foreground">Total Friends</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">{onlineFriends.length}</p>
                  <p className="text-xs text-muted-foreground">Online Now</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
