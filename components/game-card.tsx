"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Game } from '@/data/games'
import { Badge } from '@/components/ui/badge'
import { Gamepad2, Users, Star, Play, Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GameCardProps {
  game: Game
  variant?: 'default' | 'compact' | 'featured'
  disabled?: boolean
}

export function GameCard({ game, variant = 'default', disabled = false }: GameCardProps) {
  const isMultiplayer = game.mode === 'multiplayer' || game.mode === 'both'

  if (variant === 'compact') {
    return (
      <Link 
        href={disabled ? '#' : `/games/${game.slug}`}
        className={cn(
          "group relative flex items-center gap-4 overflow-hidden rounded-xl border border-border bg-card p-2 transition-all duration-300",
          disabled ? "cursor-not-allowed opacity-50" : "hover:border-primary/50 hover:bg-card/80"
        )}
      >
        {/* Thumbnail */}
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
          {game.thumbnail ? (
            <Image
              src={game.thumbnail}
              alt={game.name}
              fill
              className={cn(
                "object-cover transition-transform duration-300",
                !disabled && "group-hover:scale-110"
              )}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
              <Gamepad2 className="h-6 w-6 text-primary/50" />
            </div>
          )}
          {disabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="text-xs font-medium text-red-400">Disabled</span>
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{game.name}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{game.genre}</span>
              <span className="text-primary/50">|</span>
              <div className="flex items-center gap-1">
                {isMultiplayer ? <Users className="h-3 w-3" /> : <Gamepad2 className="h-3 w-3" />}
                <span>{game.players}</span>
              </div>
            </div>
          </div>
          {!disabled && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary opacity-0 transition-opacity group-hover:opacity-100">
              <Play className="ml-0.5 h-4 w-4" />
            </div>
          )}
        </div>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link 
        href={disabled ? '#' : `/games/${game.slug}`}
        className={cn(
          "group relative block overflow-hidden rounded-2xl border border-border bg-card",
          disabled ? "cursor-not-allowed opacity-50" : "hover:border-primary/50"
        )}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {game.thumbnail ? (
            <Image
              src={game.thumbnail}
              alt={game.name}
              fill
              className={cn(
                "object-cover transition-transform duration-500",
                !disabled && "group-hover:scale-105"
              )}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 via-muted to-secondary/30">
              <Gamepad2 className="h-20 w-20 text-primary/30" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute left-4 top-4 flex items-center gap-2">
            {game.status === 'coming-soon' && (
              <Badge className="border-0 bg-amber-500/90 text-amber-950">
                <Clock className="mr-1 h-3 w-3" />
                Coming Soon
              </Badge>
            )}
            {game.status === 'beta' && (
              <Badge className="border-0 bg-purple-500/90 text-white">
                <Zap className="mr-1 h-3 w-3" />
                Beta
              </Badge>
            )}
          </div>
          
          {/* Rating */}
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-sm backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-white">{game.rating}</span>
          </div>

          {/* Play Button - Hover */}
          {!disabled && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-2xl shadow-primary/50 transition-transform group-hover:scale-110">
                <Play className="ml-1 h-10 w-10 text-primary-foreground" />
              </div>
            </div>
          )}
          
          {disabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Badge variant="destructive" className="text-sm">Game Disabled</Badge>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="relative p-5">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h3 className="text-xl font-bold">{game.name}</h3>
            <Badge variant="outline" className="shrink-0 border-primary/30 text-primary">
              {isMultiplayer ? <Users className="mr-1 h-3 w-3" /> : <Gamepad2 className="mr-1 h-3 w-3" />}
              {game.mode === 'both' ? 'Solo/Multi' : game.mode}
            </Badge>
          </div>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {game.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="rounded-full bg-muted px-2 py-1">{game.genre}</span>
            <span>{game.players} Players</span>
          </div>
        </div>
      </Link>
    )
  }

  // Default variant - Clean modern card
  return (
    <Link 
      href={disabled ? '#' : `/games/${game.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl border border-border bg-card transition-all duration-300",
        disabled ? "cursor-not-allowed opacity-50" : "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {game.thumbnail ? (
          <Image
            src={game.thumbnail}
            alt={game.name}
            fill
            className={cn(
              "object-cover transition-transform duration-500",
              !disabled && "group-hover:scale-110"
            )}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-muted to-secondary/20">
            <Gamepad2 className="h-16 w-16 text-primary/30" />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
        
        {/* Top Row - Status & Rating */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          {game.status === 'coming-soon' ? (
            <Badge className="border-0 bg-amber-500/90 text-xs text-amber-950">
              Coming Soon
            </Badge>
          ) : game.status === 'beta' ? (
            <Badge className="border-0 bg-purple-500/90 text-xs text-white">
              Beta
            </Badge>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-xs backdrop-blur-sm">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-medium text-white">{game.rating}</span>
          </div>
        </div>

        {/* Play Button - Hover */}
        {!disabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-xl shadow-primary/40 transition-transform group-hover:scale-110">
              <Play className="ml-0.5 h-7 w-7 text-primary-foreground" />
            </div>
          </div>
        )}
        
        {disabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Badge variant="destructive">Disabled</Badge>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1 truncate text-lg font-bold">{game.name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded bg-muted px-1.5 py-0.5">{game.genre}</span>
            <div className="flex items-center gap-1">
              {isMultiplayer ? <Users className="h-3 w-3" /> : <Gamepad2 className="h-3 w-3" />}
              <span>{game.players}</span>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs capitalize",
              game.mode === 'multiplayer' && "border-secondary/50 text-secondary",
              game.mode === 'solo' && "border-primary/50 text-primary",
              game.mode === 'both' && "border-amber-500/50 text-amber-400"
            )}
          >
            {game.mode === 'both' ? 'All Modes' : game.mode}
          </Badge>
        </div>
      </div>
    </Link>
  )
}
