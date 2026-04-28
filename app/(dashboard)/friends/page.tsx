"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  UserPlus,
  Search,
  Check,
  X,
  User,
  Trash2,
  Gamepad2,
  RefreshCw,
  AlertTriangle,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

type FriendUser = {
  id: number
  username: string
  email: string
  role: "user" | "admin"
  xp: number
  level: number
  status: string
  joined: string
  friendsSince?: string
}

type SearchUser = {
  id: number
  username: string
  email: string
  role: "user" | "admin"
  xp: number
  level: number
  status: string
  relationStatus: "none" | "friends" | "request_sent" | "request_received"
}

type FriendRequest = {
  id: number
  senderId: number
  receiverId: number
  status: string
  createdAt: string
  username: string
  email: string
  role: "user" | "admin"
  xp: number
  level: number
  userStatus: string
}

function getStatusClass(status: string) {
  if (status === "online") return "bg-green-500"
  if (status === "busy") return "bg-amber-500"
  if (status === "offline") return "bg-muted-foreground"
  if (status === "banned") return "bg-red-500"
  if (status === "timeout") return "bg-orange-500"
  return "bg-green-500"
}

function getStatusLabel(status: string) {
  if (status === "online") return "Online"
  if (status === "busy") return "Busy"
  if (status === "offline") return "Offline"
  if (status === "banned") return "Banned"
  if (status === "timeout") return "Timeout"
  return "Active"
}

export default function FriendsPage() {
  const { user, isLoading: authLoading } = useAuth()

  const [friends, setFriends] = useState<FriendUser[]>([])
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([])
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([])
  const [searchUsers, setSearchUsers] = useState<SearchUser[]>([])

  const [searchQuery, setSearchQuery] = useState("")
  const [addFriendInput, setAddFriendInput] = useState("")
  const [error, setError] = useState("")

  const [friendsLoading, setFriendsLoading] = useState(true)
  const [requestsLoading, setRequestsLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)

  const onlineFriends = useMemo(
    () => friends.filter((friend) => friend.status === "online"),
    [friends]
  )

  const offlineFriends = useMemo(
    () => friends.filter((friend) => friend.status !== "online"),
    [friends]
  )

  const filteredOnline = onlineFriends.filter((friend) =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredOffline = offlineFriends.filter((friend) =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    if (!authLoading && user) {
      loadAll()
    }
  }, [authLoading, user])

  async function loadAll() {
    await Promise.all([loadFriends(), loadRequests()])
  }

  async function loadFriends() {
    setFriendsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/friends", {
        credentials: "include",
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Freunde konnten nicht geladen werden.")
        return
      }

      setFriends(data.friends || [])
    } catch {
      setError("Serververbindung fehlgeschlagen.")
    } finally {
      setFriendsLoading(false)
    }
  }

  async function loadRequests() {
    setRequestsLoading(true)

    try {
      const res = await fetch("/api/friends/requests", {
        credentials: "include",
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Anfragen konnten nicht geladen werden.")
        return
      }

      setIncomingRequests(data.incoming || [])
      setOutgoingRequests(data.outgoing || [])
    } catch {
      setError("Serververbindung fehlgeschlagen.")
    } finally {
      setRequestsLoading(false)
    }
  }

  async function searchForUsers(queryValue?: string) {
    const query = (queryValue ?? addFriendInput).trim()

    if (query.length < 2) {
      setSearchUsers([])
      return
    }

    setSearchLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/friends/search?q=${encodeURIComponent(query)}`, {
        credentials: "include",
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Suche fehlgeschlagen.")
        return
      }

      setSearchUsers(data.users || [])
    } catch {
      setError("Serververbindung fehlgeschlagen.")
    } finally {
      setSearchLoading(false)
    }
  }

  async function sendRequest(receiverId: number) {
    setActionLoadingId(receiverId)
    setError("")

    try {
      const res = await fetch("/api/friends/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          receiverId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Anfrage konnte nicht gesendet werden.")
        return
      }

      await loadRequests()
      await searchForUsers()
    } catch {
      setError("Serververbindung fehlgeschlagen.")
    } finally {
      setActionLoadingId(null)
    }
  }

  async function acceptRequest(requestId: number) {
    setActionLoadingId(requestId)
    setError("")

    try {
      const res = await fetch(`/api/friends/requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          action: "accept",
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Anfrage konnte nicht akzeptiert werden.")
        return
      }

      await loadAll()
      await searchForUsers()
    } catch {
      setError("Serververbindung fehlgeschlagen.")
    } finally {
      setActionLoadingId(null)
    }
  }

  async function declineRequest(requestId: number) {
    setActionLoadingId(requestId)
    setError("")

    try {
      const res = await fetch(`/api/friends/requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          action: "decline",
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Anfrage konnte nicht abgelehnt werden.")
        return
      }

      await loadRequests()
      await searchForUsers()
    } catch {
      setError("Serververbindung fehlgeschlagen.")
    } finally {
      setActionLoadingId(null)
    }
  }

  async function removeFriend(friendId: number) {
    const confirmed = window.confirm("Möchtest du diesen Freund wirklich entfernen?")
    if (!confirmed) return

    setActionLoadingId(friendId)
    setError("")

    try {
      const res = await fetch(`/api/friends/${friendId}`, {
        method: "DELETE",
        credentials: "include",
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Freund konnte nicht entfernt werden.")
        return
      }

      await loadAll()
      await searchForUsers()
    } catch {
      setError("Serververbindung fehlgeschlagen.")
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleAddFriend = async () => {
    await searchForUsers(addFriendInput)
  }

  const handleInvite = (friend: FriendUser) => {
    alert(`Game invite sent to ${friend.username}!`)
  }

  if (authLoading || friendsLoading || requestsLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Loading friends...
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
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

        <Button variant="outline" onClick={loadAll}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-red-500/30 bg-red-500/10">
          <CardContent className="flex items-center gap-3 p-4 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card pl-9"
            />
          </div>

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
                  <Card key={friend.id} className="border-border bg-card">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-primary/20">
                          <User className="h-5 w-5 text-primary" />
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
                        </div>

                        <div>
                          <p className="font-medium">{friend.username}</p>
                          <p className="text-sm text-muted-foreground">
                            Level {friend.level} · {friend.xp.toLocaleString()} XP
                          </p>
                        </div>
                      </div>

                      <Button size="sm" onClick={() => handleInvite(friend)}>
                        <Gamepad2 className="mr-2 h-4 w-4" />
                        Invite
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center py-8 text-center">
                  <Users className="mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-muted-foreground">
                    {searchQuery ? "No online friends match your search" : "No friends online"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-lg font-semibold">Offline / Away</h2>
              <Badge variant="secondary">{filteredOffline.length}</Badge>
            </div>

            {filteredOffline.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredOffline.map((friend) => (
                  <Card key={friend.id} className="border-border bg-card">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-primary/20">
                          <User className="h-5 w-5 text-primary" />
                          <span
                            className={cn(
                              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card",
                              getStatusClass(friend.status)
                            )}
                          />
                        </div>

                        <div>
                          <p className="font-medium">{friend.username}</p>
                          <p className="text-sm text-muted-foreground">
                            {getStatusLabel(friend.status)} · Level {friend.level}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={actionLoadingId === friend.id}
                        onClick={() => removeFriend(friend.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center py-8 text-center">
                  <Users className="mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-muted-foreground">
                    {searchQuery ? "No offline friends match your search" : "All friends are online!"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="space-y-6">
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
                  placeholder="Enter username or email"
                  value={addFriendInput}
                  onChange={(e) => setAddFriendInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddFriend()}
                  className="bg-background"
                />

                <Button onClick={handleAddFriend} disabled={addFriendInput.trim().length < 2}>
                  Search
                </Button>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Search a player and send a friend request.
              </p>

              {searchLoading && (
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Searching...
                </div>
              )}

              {searchUsers.length > 0 && (
                <div className="mt-4 space-y-3">
                  {searchUsers.map((searchUser) => (
                    <div
                      key={searchUser.id}
                      className="rounded-lg border border-border bg-background/60 p-3"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                          <User className="h-5 w-5 text-primary" />
                          <span
                            className={cn(
                              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card",
                              getStatusClass(searchUser.status)
                            )}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{searchUser.username}</p>
                          <p className="text-xs text-muted-foreground">Level {searchUser.level}</p>
                        </div>
                      </div>

                      {searchUser.relationStatus === "none" && (
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => sendRequest(searchUser.id)}
                          disabled={actionLoadingId === searchUser.id}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add Friend
                        </Button>
                      )}

                      {searchUser.relationStatus === "friends" && (
                        <Badge className="w-full justify-center bg-green-500/20 text-green-400">
                          <Check className="mr-1 h-3 w-3" />
                          Already Friends
                        </Badge>
                      )}

                      {searchUser.relationStatus === "request_sent" && (
                        <Badge variant="outline" className="w-full justify-center border-amber-500/30 text-amber-400">
                          <Clock className="mr-1 h-3 w-3" />
                          Request Sent
                        </Badge>
                      )}

                      {searchUser.relationStatus === "request_received" && (
                        <Badge variant="outline" className="w-full justify-center border-secondary/30 text-secondary">
                          Request Received
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-secondary" />
                Friend Requests
                {incomingRequests.length > 0 && (
                  <Badge variant="secondary" className="ml-auto bg-secondary/20 text-secondary">
                    {incomingRequests.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {incomingRequests.length > 0 ? (
                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div key={request.id} className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                        <User className="h-5 w-5 text-primary" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{request.username}</p>
                        <p className="text-xs text-muted-foreground">Wants to be friends</p>
                      </div>

                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-green-500 hover:bg-green-500/20 hover:text-green-400"
                          onClick={() => acceptRequest(request.id)}
                          disabled={actionLoadingId === request.id}
                        >
                          <Check className="h-4 w-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-500 hover:bg-red-500/20 hover:text-red-400"
                          onClick={() => declineRequest(request.id)}
                          disabled={actionLoadingId === request.id}
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