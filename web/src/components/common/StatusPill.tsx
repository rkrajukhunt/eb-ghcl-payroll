import { Badge } from '@/components/ui/badge'
import type { BadgeProps } from '@/components/ui/badge'

const MAP: Record<string, BadgeProps['variant']> = {
  // attendance
  P: 'success',
  A: 'destructive',
  'W/O': 'muted',
  PH: 'secondary',
  HD: 'warning',
  // approvals
  Approved: 'success',
  Pending: 'warning',
  Rejected: 'destructive',
  // payroll / invoice
  Draft: 'muted',
  Validated: 'secondary',
  Generated: 'secondary',
  Sent: 'secondary',
  Closed: 'default',
  Paid: 'success',
  // status
  Active: 'success',
  Idle: 'warning',
  Maintenance: 'warning',
  Inactive: 'muted',
  Left: 'muted',
}

export function StatusPill({ status }: { status: string }) {
  return <Badge variant={MAP[status] ?? 'secondary'}>{status}</Badge>
}
