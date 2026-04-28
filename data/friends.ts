export type FriendStatus = 'online' | 'offline' | 'in-game' | 'away'

export interface Friend {
  id: string
  username: string
  avatar: string
  status: FriendStatus
  level: number
  currentGame?: string
  lastOnline?: string
}

export const friends: Friend[] = [
  {
    id: "f1",
    username: "NeonKnight",
    avatar: "/avatars/neon-knight.png",
    status: "online",
    level: 32
  },
  {
    id: "f2",
    username: "CyberWolf",
    avatar: "/avatars/cyber-wolf.png",
    status: "in-game",
    level: 28,
    currentGame: "Space Duel"
  },
  {
    id: "f3",
    username: "PixelMaster",
    avatar: "/avatars/pixel-master.png",
    status: "online",
    level: 45
  },
  {
    id: "f4",
    username: "StarGazer",
    avatar: "/avatars/star-gazer.png",
    status: "away",
    level: 19
  },
  {
    id: "f5",
    username: "TurboRacer",
    avatar: "/avatars/turbo-racer.png",
    status: "offline",
    level: 37,
    lastOnline: "2 hours ago"
  },
  {
    id: "f6",
    username: "QuantumX",
    avatar: "/avatars/quantum-x.png",
    status: "offline",
    level: 12,
    lastOnline: "1 day ago"
  },
  {
    id: "f7",
    username: "BlazeFire",
    avatar: "/avatars/blaze-fire.png",
    status: "in-game",
    level: 41,
    currentGame: "Neon Racer"
  },
  {
    id: "f8",
    username: "ShadowByte",
    avatar: "/avatars/shadow-byte.png",
    status: "online",
    level: 23
  }
]

export function getOnlineFriends(): Friend[] {
  return friends.filter((f) => f.status === 'online' || f.status === 'in-game')
}

export function getOfflineFriends(): Friend[] {
  return friends.filter((f) => f.status === 'offline' || f.status === 'away')
}

export function getFriendById(id: string): Friend | undefined {
  return friends.find((f) => f.id === id)
}
