export type InviteStatus = 'pending' | 'accepted' | 'declined' | 'expired'
export type InviteType = 'game' | 'friend'

export interface Invite {
  id: string
  type: InviteType
  from: {
    id: string
    username: string
    avatar: string
  }
  to: {
    id: string
    username: string
  }
  game?: string
  status: InviteStatus
  createdAt: string
  expiresAt?: string
}

export const invites: Invite[] = [
  {
    id: "inv1",
    type: "game",
    from: {
      id: "f1",
      username: "NeonKnight",
      avatar: "/avatars/neon-knight.png"
    },
    to: {
      id: "2",
      username: "player"
    },
    game: "Space Duel",
    status: "pending",
    createdAt: "2024-03-15T10:30:00Z",
    expiresAt: "2024-03-15T11:30:00Z"
  },
  {
    id: "inv2",
    type: "game",
    from: {
      id: "f3",
      username: "PixelMaster",
      avatar: "/avatars/pixel-master.png"
    },
    to: {
      id: "2",
      username: "player"
    },
    game: "Cyber Chess",
    status: "pending",
    createdAt: "2024-03-15T09:00:00Z",
    expiresAt: "2024-03-15T10:00:00Z"
  },
  {
    id: "inv3",
    type: "friend",
    from: {
      id: "f9",
      username: "VoidRunner",
      avatar: "/avatars/void-runner.png"
    },
    to: {
      id: "2",
      username: "player"
    },
    status: "pending",
    createdAt: "2024-03-14T15:00:00Z"
  }
]

export function getPendingInvites(userId: string): Invite[] {
  return invites.filter((inv) => inv.to.id === userId && inv.status === 'pending')
}

export function getGameInvites(userId: string): Invite[] {
  return invites.filter((inv) => inv.to.id === userId && inv.type === 'game' && inv.status === 'pending')
}

export function getFriendRequests(userId: string): Invite[] {
  return invites.filter((inv) => inv.to.id === userId && inv.type === 'friend' && inv.status === 'pending')
}
