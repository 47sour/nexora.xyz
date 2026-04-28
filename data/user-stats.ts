export interface UserStats {
  totalGamesPlayed: number
  totalPlayTime: string
  level: number
  xp: number
  xpToNextLevel: number
  favoriteGame: string
  gamesThisWeek: number
  longestSession: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  progress?: number
  maxProgress?: number
}

export const userStats: UserStats = {
  totalGamesPlayed: 247,
  totalPlayTime: "127h 34m",
  level: 24,
  xp: 7840,
  xpToNextLevel: 10000,
  favoriteGame: "Space Duel",
  gamesThisWeek: 18,
  longestSession: "4h 12m"
}

export const achievements: Achievement[] = [
  {
    id: "ach1",
    name: "First Game",
    description: "Play your first game",
    icon: "trophy",
    unlocked: true,
    unlockedAt: "2024-01-05",
    rarity: "common"
  },
  {
    id: "ach2",
    name: "Speed Demon",
    description: "Complete a race in under 2 minutes",
    icon: "zap",
    unlocked: true,
    unlockedAt: "2024-01-20",
    rarity: "rare"
  },
  {
    id: "ach3",
    name: "Puzzle Master",
    description: "Solve 100 puzzles",
    icon: "puzzle",
    unlocked: true,
    unlockedAt: "2024-02-10",
    rarity: "rare"
  },
  {
    id: "ach4",
    name: "Social Butterfly",
    description: "Add 10 friends",
    icon: "users",
    unlocked: true,
    unlockedAt: "2024-02-15",
    rarity: "common"
  },
  {
    id: "ach5",
    name: "Dedicated Player",
    description: "Play 100 games",
    icon: "flame",
    unlocked: true,
    unlockedAt: "2024-03-01",
    rarity: "epic"
  },
  {
    id: "ach6",
    name: "Legend",
    description: "Reach Level 50",
    icon: "crown",
    unlocked: false,
    rarity: "legendary",
    progress: 24,
    maxProgress: 50
  },
  {
    id: "ach7",
    name: "Marathon Gamer",
    description: "Play for 500 total hours",
    icon: "clock",
    unlocked: false,
    rarity: "epic",
    progress: 127,
    maxProgress: 500
  },
  {
    id: "ach8",
    name: "Explorer",
    description: "Play all available games",
    icon: "award",
    unlocked: true,
    unlockedAt: "2024-02-28",
    rarity: "rare"
  }
]

export function getUnlockedAchievements(): Achievement[] {
  return achievements.filter((a) => a.unlocked)
}

export function getLockedAchievements(): Achievement[] {
  return achievements.filter((a) => !a.unlocked)
}

export function getAchievementsByRarity(rarity: Achievement['rarity']): Achievement[] {
  return achievements.filter((a) => a.rarity === rarity)
}

// XP Level System
export function calculateLevel(xp: number): number {
  // Simple formula: level = floor(sqrt(xp / 100))
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

export function xpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100
}

export function xpToNextLevel(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp)
  const nextLevelXp = xpForLevel(currentLevel + 1)
  return nextLevelXp - currentXp
}
