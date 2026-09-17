import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable, type Column } from '@/components/common/DataTable'
import { StatusPill } from '@/components/common/StatusPill'
import { MoneyText } from '@/components/common/MoneyText'
import { invoices } from '@/mock'
import type { Invoice } from '@/types'

export function InvoicesPage() {
  const navigate = useNavigate()
  const columns: Column<Invoice>[] = [
    { key: 'number', header: 'Invoice #', render: (i) => <span className="font-medium">{i.number}</span> },
    { key: 'type', header: 'Type', render: (i) => <Badge variant="outline">{i.type}</Badge> },
    { key: 'workOrder', header: 'Work Order' },
    { key: 'projectMonth', header: 'Month' },
    { key: 'subtotal', header: 'Amount', render: (i) => <MoneyText value={i.subtotal} /> },
    { key: 'gst', header: 'GST', value: (i) => i.cgst + i.sgst, render: (i) => <MoneyText value={i.cgst + i.sgst} /> },
    { key: 'grandTotal', header: 'Grand Total', render: (i) => <span className="font-medium"><MoneyText value={i.grandTotal} /></span> },
    { key: 'status', header: 'Status', render: (i) => <StatusPill status={i.status} /> },
  ]

  const total = invoices.reduce((s, i) => s + i.grandTotal, 0)

  return (
    <div>
      <PageHeader
        title="GHCL Invoices"
        description={`ALS / BLS / DA billing · Aug 2026 · total ₹${total.toLocaleString('en-IN')}`}
        actions={
          <Button>
            <Plus className="size-4" /> Generate Invoice
          </Button>
        }
      />
      <DataTable
        columns={columns}
        rows={invoices}
        csvName="invoices.csv"
        onRowClick={(i) => navigate(`/invoices/${i.id}`)}
      />
    </div>
  )
}
