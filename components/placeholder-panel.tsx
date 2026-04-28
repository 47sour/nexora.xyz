"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Gamepad2, Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlaceholderPanelProps {
  title: string
  description?: string
  className?: string
  variant?: 'game' | 'feature'
  height?: 'sm' | 'md' | 'lg' | 'full'
}

const heightClasses = {
  sm: 'min-h-[200px]',
  md: 'min-h-[300px]',
  lg: 'min-h-[400px]',
  full: 'min-h-[600px]'
}

export function PlaceholderPanel({
  title,
  description = "This feature will be implemented in a future update.",
  className,
  variant = 'feature',
  height = 'md'
}: PlaceholderPanelProps) {
  const Icon = variant === 'game' ? Gamepad2 : Code2

  return (
    <Card 
      className={cn(
        "border-dashed border-border/50 bg-card/50",
        heightClasses[height],
        className
      )}
    >
      <CardContent className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-8 w-8 text-primary/50" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground/80">
          {title}
        </h3>
        <p className="max-w-md text-sm text-muted-foreground">
          {description}
        </p>
        {variant === 'game' && (
          <div className="mt-4 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-4 py-2">
            <code className="text-xs text-primary/70">
              Game Placeholder - Real game logic will be added later
            </code>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
