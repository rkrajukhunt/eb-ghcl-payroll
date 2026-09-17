import { Check, Circle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ApprovalStep {
  label: string
  state: 'done' | 'current' | 'pending'
}

export function ApprovalTimeline({ steps }: { steps: ApprovalStep[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex items-center gap-3">
          <span
            className={cn(
              'flex size-6 items-center justify-center rounded-full border',
              step.state === 'done' && 'border-success bg-success text-success-foreground',
              step.state === 'current' && 'border-warning bg-warning/15 text-warning',
              step.state === 'pending' && 'border-border text-muted-foreground',
            )}
          >
            {step.state === 'done' ? (
              <Check className="size-3.5" />
            ) : step.state === 'current' ? (
              <Clock className="size-3.5" />
            ) : (
              <Circle className="size-2.5" />
            )}
          </span>
          <span className={cn('text-sm', step.state === 'pending' && 'text-muted-foreground')}>
            {step.label}
          </span>
        </li>
      ))}
    </ol>
  )
}
