export type GameMode = 'solo' | 'multiplayer' | 'both'
export type GameStatus = 'coming-soon' | 'available' | 'beta'

export interface Game {
  id: string
  name: string
  slug: string
  description: string
  mode: GameMode
  status: GameStatus
  image: string
  thumbnail: string
  genre: string
  players: string
  rating: number
  featured: boolean
  enabled: boolean
  playCount: number
  lastUpdated: string
}

export const games: Game[] = [
  {
    id: "1",
    name: "Space Duel",
    slug: "space-duel",
    description: "Battle against opponents in intense space combat. Dodge asteroids, collect power-ups, and outmaneuver your enemies in this fast-paced shooter.",
    mode: "multiplayer",
    status: "coming-soon",
    image: "/games/space-duel.jpg",
    thumbnail: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&q=80",
    genre: "Action",
    players: "1v1",
    rating: 4.8,
    featured: true,
    enabled: true,
    playCount: 12453,
    lastUpdated: "2024-01-15"
  },
  {
    id: "2",
    name: "Neon Racer",
    slug: "neon-racer",
    description: "Race through neon-lit cityscapes at breakneck speeds. Customize your vehicle and compete against players worldwide.",
    mode: "both",
    status: "coming-soon",
    image: "/games/neon-racer.jpg",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    genre: "Racing",
    players: "1-4",
    rating: 4.6,
    featured: true,
    enabled: true,
    playCount: 8932,
    lastUpdated: "2024-01-10"
  },
  {
    id: "3",
    name: "Puzzle Arena",
    slug: "puzzle-arena",
    description: "Challenge your mind with increasingly complex puzzles. Compete for the fastest solve times or enjoy a relaxing solo experience.",
    mode: "both",
    status: "coming-soon",
    image: "/games/puzzle-arena.jpg",
    thumbnail: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=800&q=80",
    genre: "Puzzle",
    players: "1-2",
    rating: 4.5,
    featured: false,
    enabled: true,
    playCount: 5621,
    lastUpdated: "2024-01-08"
  },
  {
    id: "4",
    name: "Cyber Chess",
    slug: "cyber-chess",
    description: "Classic chess reimagined with futuristic visuals and special power-ups. Play against AI or challenge friends to strategic battles.",
    mode: "both",
    status: "coming-soon",
    image: "/games/cyber-chess.jpg",
    thumbnail: "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=800&q=80",
    genre: "Strategy",
    players: "1-2",
    rating: 4.9,
    featured: true,
    enabled: true,
    playCount: 15782,
    lastUpdated: "2024-01-12"
  },
  {
    id: "5",
    name: "Reaction Battle",
    slug: "reaction-battle",
    description: "Test your reflexes in this lightning-fast reaction game. Who will click first? Challenge friends and climb the leaderboards.",
    mode: "multiplayer",
    status: "coming-soon",
    image: "/games/reaction-battle.jpg",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    genre: "Arcade",
    players: "2",
    rating: 4.3,
    featured: false,
    enabled: false,
    playCount: 3245,
    lastUpdated: "2024-01-05"
  },
  {
    id: "6",
    name: "Card Clash",
    slug: "card-clash",
    description: "Build your deck and battle opponents in this strategic card game. Collect rare cards and develop winning strategies.",
    mode: "both",
    status: "coming-soon",
    image: "/games/card-clash.jpg",
    thumbnail: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&q=80",
    genre: "Card Game",
    players: "1-2",
    rating: 4.7,
    featured: true,
    enabled: true,
    playCount: 9876,
    lastUpdated: "2024-01-14"
  }
]

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug)
}

export function getFeaturedGames(): Game[] {
  return games.filter((g) => g.featured && g.enabled)
}

export function getGamesByMode(mode: GameMode): Game[] {
  return games.filter((g) => (g.mode === mode || g.mode === 'both') && g.enabled)
}

export function getEnabledGames(): Game[] {
  return games.filter((g) => g.enabled)
}

export function getAllGamesAdmin(): Game[] {
  return games
}
