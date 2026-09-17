import { Badge } from '@/components/ui/badge'
import { differenceInCalendarDays, parseISO } from 'date-fns'

const TODAY = new Date('2026-09-17')

export function expiryState(expiry?: string): 'none' | 'valid' | 'soon' | 'expired' {
  if (!expiry) return 'none'
  const days = differenceInCalendarDays(parseISO(expiry), TODAY)
  if (days < 0) return 'expired'
  if (days <= 30) return 'soon'
  return 'valid'
}

export function ExpiryBadge({ expiry }: { expiry?: string }) {
  const state = expiryState(expiry)
  if (state === 'none') return <span className="text-muted-foreground">—</span>
  const label = expiry ? new Date(expiry).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''
  if (state === 'expired') return <Badge variant="destructive">🔴 {label}</Badge>
  if (state === 'soon') return <Badge variant="warning">🟠 {label}</Badge>
  return <Badge variant="success">🟢 {label}</Badge>
}
