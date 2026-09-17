import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  accent,
}: {
  label: string
  value: string | number
  icon?: LucideIcon
  hint?: string
  accent?: 'primary' | 'success' | 'warning' | 'destructive'
}) {
  const accentClass = {
    primary: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    destructive: 'text-destructive bg-destructive/10',
  }[accent ?? 'primary']

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        {Icon && (
          <div className={cn('flex size-10 items-center justify-center rounded-lg', accentClass)}>
            <Icon className="size-5" />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold tracking-tight">{value}</p>
          {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
