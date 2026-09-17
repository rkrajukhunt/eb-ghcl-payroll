import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, type Column } from '@/components/common/DataTable'
import { StatusPill } from '@/components/common/StatusPill'
import { MoneyText } from '@/components/common/MoneyText'
import { tada } from '@/mock'
import type { TadaRecord } from '@/types'

export function TadaPage() {
  const total = tada.reduce((s, r) => s + r.amount, 0)
  const columns: Column<TadaRecord>[] = [
    { key: 'date', header: 'Date', sortable: true },
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'Employee', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'vardhi', header: 'Vardhi / Route', render: (r) => <Badge variant="outline">{r.vardhi}</Badge> },
    { key: 'ta', header: 'TA', render: (r) => <MoneyText value={r.ta} /> },
    { key: 'da', header: 'DA', render: (r) => <MoneyText value={r.da} /> },
    { key: 'amount', header: 'Amount', render: (r) => <span className="font-medium"><MoneyText value={r.amount} /></span> },
    { key: 'status', header: 'Status', render: (r) => <StatusPill status={r.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title="TA / DA Claims"
        description="Route-based travel & daily allowance. August 2026."
        actions={<Badge variant="default">Total: ₹{total.toLocaleString('en-IN')}</Badge>}
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Route rates</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="flex justify-between"><span>Rajkot</span><MoneyText value={300} /></div>
            <div className="flex justify-between"><span>Other route</span><MoneyText value={500} /></div>
            <div className="flex justify-between"><span>Outstation / day</span><MoneyText value={800} /></div>
          </CardContent>
        </Card>
      </div>
      <DataTable columns={columns} rows={tada} csvName="tada.csv" />
    </div>
  )
}
