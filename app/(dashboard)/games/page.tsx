"use client"

import { useState } from 'react'
import { GameCard } from '@/components/game-card'
import { games, GameMode, getEnabledGames } from '@/data/games'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Gamepad2, Search, Filter, Grid, List } from 'lucide-react'
import { cn } from '@/lib/utils'

type ViewMode = 'grid' | 'list'
type FilterMode = 'all' | GameMode

export default function GamesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')

  const enabledGames = getEnabledGames()
  
  const filteredGames = enabledGames.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.genre.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterMode === 'all' || game.mode === filterMode || game.mode === 'both'
    return matchesSearch && matchesFilter
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 neon-glow">
            <Gamepad2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Games</h1>
            <p className="text-muted-foreground">
              Browse our collection of {enabledGames.length} games
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card pl-9"
          />
        </div>
        
        <div className="flex items-center gap-3">
          {/* Mode Filter */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "px-3",
                filterMode === 'all' && "bg-primary text-primary-foreground"
              )}
              onClick={() => setFilterMode('all')}
            >
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "px-3",
                filterMode === 'solo' && "bg-primary text-primary-foreground"
              )}
              onClick={() => setFilterMode('solo')}
            >
              Solo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "px-3",
                filterMode === 'multiplayer' && "bg-primary text-primary-foreground"
              )}
              onClick={() => setFilterMode('multiplayer')}
            >
              Multiplayer
            </Button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                viewMode === 'grid' && "bg-muted"
              )}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                viewMode === 'list' && "bg-muted"
              )}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Games Grid/List */}
      {filteredGames.length > 0 ? (
        <div className={cn(
          viewMode === 'grid' 
            ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" 
            : "space-y-4"
        )}>
          {filteredGames.map((game) => (
            <GameCard 
              key={game.id} 
              game={game} 
              variant={viewMode === 'list' ? 'compact' : 'default'}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Filter className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-semibold">No games found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery('')
              setFilterMode('all')
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
