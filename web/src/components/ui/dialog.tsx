import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Minimal modal dialog (no external deps). */
export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onOpenChange(false)
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 animate-in fade-in" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg animate-in fade-in zoom-in-95">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
        >
          <X className="size-4" />
        </button>
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('mb-4 flex flex-col space-y-1.5', className)}>{children}</div>
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold leading-none tracking-tight">{children}</h2>
}

export function DialogDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 flex justify-end gap-2">{children}</div>
}
