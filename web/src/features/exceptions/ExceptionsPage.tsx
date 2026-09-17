import { AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { auditLog, exceptions } from '@/mock'
import type { Severity } from '@/types'

const sevVariant: Record<Severity, 'destructive' | 'warning' | 'muted'> = {
  high: 'destructive',
  medium: 'warning',
  low: 'muted',
}

export function ExceptionsPage() {
  const groups = ['Payroll', 'Attendance', 'Billing'] as const

  return (
    <div>
      <PageHeader title="Exceptions & Audit" description="Automated error detection across payroll, attendance and billing." />

      <div className="grid gap-4 md:grid-cols-3">
        {groups.map((g) => {
          const items = exceptions.filter((e) => e.group === g)
          return (
            <Card key={g}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="size-4 text-warning" /> {g}
                  <Badge variant="secondary">{items.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {items.length === 0 && <p className="text-sm text-muted-foreground">No issues.</p>}
                {items.map((e) => (
                  <div key={e.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={sevVariant[e.severity]}>{e.severity}</Badge>
                    </div>
                    <p className="mt-1.5 text-sm">{e.message}</p>
                    <p className="text-xs text-muted-foreground">{e.entity}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Audit trail</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Who</TableHead>
                <TableHead>What</TableHead>
                <TableHead>When</TableHead>
                <TableHead>Old</TableHead>
                <TableHead>New</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLog.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.who}</TableCell>
                  <TableCell>{a.what}</TableCell>
                  <TableCell className="text-muted-foreground">{a.when}</TableCell>
                  <TableCell>{a.oldValue}</TableCell>
                  <TableCell>{a.newValue}</TableCell>
                  <TableCell className="text-muted-foreground">{a.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
