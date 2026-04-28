"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    positive: boolean
  }
  className?: string
  variant?: 'default' | 'primary' | 'secondary'
}

export function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  variant = 'default'
}: DashboardCardProps) {
  return (
    <Card 
      className={cn(
        "card-hover border-border",
        variant === 'primary' && "border-primary/30 bg-primary/5",
        variant === 'secondary' && "border-secondary/30 bg-secondary/5",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            variant === 'primary' && "bg-primary/20 text-primary",
            variant === 'secondary' && "bg-secondary/20 text-secondary",
            variant === 'default' && "bg-muted text-muted-foreground"
          )}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <p className="mt-1 text-xs text-muted-foreground">
            {trend && (
              <span className={cn(
                "mr-1 font-medium",
                trend.positive ? "text-green-500" : "text-red-500"
              )}>
                {trend.positive ? '+' : ''}{trend.value}%
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
