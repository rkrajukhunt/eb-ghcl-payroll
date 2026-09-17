import { Download, Upload } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { attendance, totalMandays } from '@/mock'
import type { AttendanceMark } from '@/types'

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

const markClass: Record<AttendanceMark, string> = {
  P: 'bg-success/15 text-success',
  A: 'bg-destructive/15 text-destructive',
  'W/O': 'bg-muted text-muted-foreground',
  PH: 'bg-secondary text-secondary-foreground',
  HD: 'bg-warning/15 text-warning',
}

export function AttendancePage() {
  const totals = {
    present: attendance.reduce((s, r) => s + r.present, 0),
    absent: attendance.reduce((s, r) => s + r.absent, 0),
    weeklyOff: attendance.reduce((s, r) => s + r.weeklyOff, 0),
  }

  return (
    <div>
      <PageHeader
        title="Attendance Register"
        description="July 2026 · G shift 09:00–18:00 · marks P / A / W/O"
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="size-4" /> Import
            </Button>
            <Button variant="outline">
              <Download className="size-4" /> Export
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Badge variant="success">Present {totals.present}</Badge>
        <Badge variant="destructive">Absent {totals.absent}</Badge>
        <Badge variant="muted">Weekly Off {totals.weeklyOff}</Badge>
        <Badge variant="default">Total Mandays {totalMandays}</Badge>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full border-collapse text-center text-xs">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="sticky left-0 z-10 bg-muted/40 px-3 py-2 text-left font-medium">Employee</th>
                {DAYS.map((d) => (
                  <th key={d} className="w-7 py-2 font-medium text-muted-foreground">
                    {d}
                  </th>
                ))}
                <th className="px-2 py-2 font-medium">WD</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((row) => (
                <tr key={row.employeeId} className="border-b">
                  <td className="sticky left-0 z-10 bg-card px-3 py-1.5 text-left">
                    <div className="font-medium">{row.name}</div>
                    <div className="text-[10px] text-muted-foreground">{row.code}</div>
                  </td>
                  {row.marks.map((m, i) => (
                    <td key={i} className="p-0.5">
                      <span
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded text-[10px] font-medium',
                          markClass[m],
                        )}
                      >
                        {m === 'W/O' ? 'W' : m}
                      </span>
                    </td>
                  ))}
                  <td className="px-2 font-semibold">{row.workingDays}</td>
                </tr>
              ))}
              <tr className="bg-muted/40 font-semibold">
                <td className="sticky left-0 z-10 bg-muted/40 px-3 py-2 text-left">Total</td>
                <td colSpan={31} className="py-2 text-right text-muted-foreground">
                  Total working days
                </td>
                <td className="px-2">{totalMandays}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
