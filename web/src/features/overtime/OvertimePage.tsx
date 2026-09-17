import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, type Column } from '@/components/common/DataTable'
import { StatusPill } from '@/components/common/StatusPill'
import { MoneyText } from '@/components/common/MoneyText'
import { ApprovalTimeline } from '@/components/common/ApprovalTimeline'
import { overtime } from '@/mock'
import type { OvertimeRecord } from '@/types'

export function OvertimePage() {
  const columns: Column<OvertimeRecord>[] = [
    { key: 'name', header: 'Employee', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'date', header: 'Date' },
    { key: 'scheduledHours', header: 'Sched.', render: (r) => `${r.scheduledHours}h` },
    { key: 'actualHours', header: 'Actual', render: (r) => `${r.actualHours}h` },
    { key: 'otHours', header: 'OT', render: (r) => `${r.otHours}h` },
    { key: 'otRate', header: 'Rate', render: (r) => <MoneyText value={r.otRate} /> },
    { key: 'amount', header: 'Amount', render: (r) => <MoneyText value={r.amount} /> },
    { key: 'status', header: 'Status', render: (r) => <StatusPill status={r.status} /> },
  ]

  return (
    <div>
      <PageHeader title="Overtime" description="OT capture and approval. Unapproved OT is excluded from payroll." />
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <DataTable columns={columns} rows={overtime} csvName="overtime.csv" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Approval flow</CardTitle>
          </CardHeader>
          <CardContent>
            <ApprovalTimeline
              steps={[
                { label: 'Driver enters OT', state: 'done' },
                { label: 'Supervisor approves', state: 'current' },
                { label: 'Payroll validates', state: 'pending' },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
