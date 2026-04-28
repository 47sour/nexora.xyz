"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'
import { GameCard } from '@/components/game-card'
import { getFeaturedGames } from '@/data/games'
import { 
  Gamepad2, 
  Users, 
  Trophy, 
  Zap, 
  ChevronRight,
  Sparkles
} from 'lucide-react'

const features = [
  {
    icon: Gamepad2,
    title: "Diverse Games",
    description: "From puzzle games to action-packed battles, find your perfect match."
  },
  {
    icon: Users,
    title: "Multiplayer",
    description: "Challenge friends across devices with seamless cross-play support."
  },
  {
    icon: Trophy,
    title: "Compete & Rank",
    description: "Climb leaderboards and earn achievements as you master each game."
  },
  {
    icon: Zap,
    title: "Instant Play",
    description: "No downloads needed. Jump into any game directly from your browser."
  }
]

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const featuredGames = getFeaturedGames()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary neon-glow">
              <Gamepad2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight neon-text">Nexora</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="neon-glow">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[128px]" />
          <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-[128px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Welcome to the future of gaming
            </div>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Play. Compete.{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Dominate.
              </span>
            </h1>
            <p className="mb-10 text-pretty text-lg text-muted-foreground sm:text-xl">
              Nexora is your gateway to endless gaming adventures. Challenge friends, 
              climb leaderboards, and discover your next favorite game.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="neon-glow px-8">
                <Link href="/register">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/games">Explore Games</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-border bg-card/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Why Choose Nexora?</h2>
            <p className="text-muted-foreground">
              Everything you need for the ultimate gaming experience
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="card-hover rounded-xl border border-border bg-card p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="mb-4 text-3xl font-bold">Featured Games</h2>
              <p className="text-muted-foreground">
                Discover our most popular titles
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/games">
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredGames.map((game) => (
              <GameCard key={game.id} game={game} variant="featured" />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-card/30 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold">Ready to Start Playing?</h2>
          <p className="mb-8 text-muted-foreground">
            Join thousands of players already enjoying Nexora. Create your free account today.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="neon-glow px-8">
              <Link href="/register">Create Account</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/login">Already have an account? Login</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-primary" />
              <span className="font-semibold">Nexora</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date().getFullYear()} Nexora. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
