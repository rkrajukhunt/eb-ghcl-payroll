import { useState } from 'react'
import { CheckCircle2, Circle, Lock } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { monthClose } from '@/mock'

export function MonthClosePage() {
  const [closed, setClosed] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const allDone = monthClose.every((i) => i.done)
  const doneCount = monthClose.filter((i) => i.done).length

  return (
    <div>
      <PageHeader
        title="Month Close — Jul 2026"
        description="Complete every step, then lock the period. Closed months are read-only."
        actions={
          closed ? (
            <Badge variant="default"><Lock className="mr-1 size-3" /> Closed</Badge>
          ) : (
            <Badge variant="warning">
              {doneCount}/{monthClose.length} steps
            </Badge>
          )
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Closing checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {monthClose.map((item) => (
              <li key={item.label} className="flex items-center gap-3 rounded-lg border p-3">
                {item.done || closed ? (
                  <CheckCircle2 className="size-5 text-success" />
                ) : (
                  <Circle className="size-5 text-muted-foreground" />
                )}
                <span className={item.done || closed ? 'text-sm font-medium' : 'text-sm text-muted-foreground'}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-3">
            <Button disabled={closed} onClick={() => setConfirm(true)}>
              <Lock className="size-4" /> {closed ? 'Month Closed' : 'Close Month'}
            </Button>
            {!allDone && !closed && (
              <p className="text-sm text-muted-foreground">
                Some steps are pending — closing will lock the period as-is.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogHeader>
          <DialogTitle>Close July 2026?</DialogTitle>
          <DialogDescription>
            The period becomes read-only. Any later change will require a correction with a reason
            and approval, recorded in the audit log.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setConfirm(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setClosed(true)
              setConfirm(false)
            }}
          >
            <Lock className="size-4" /> Confirm Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
