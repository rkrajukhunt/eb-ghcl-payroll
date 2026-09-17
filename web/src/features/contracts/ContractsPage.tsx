import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { DataTable, type Column } from '@/components/common/DataTable'
import { MoneyText } from '@/components/common/MoneyText'
import { contractRates } from '@/mock'
import type { ContractRate } from '@/types'

export function ContractsPage() {
  const columns: Column<ContractRate>[] = [
    { key: 'client', header: 'Client', render: (r) => <span className="font-medium">{r.client}</span> },
    { key: 'workOrder', header: 'Work Order' },
    { key: 'service', header: 'Service' },
    { key: 'type', header: 'Type', render: (r) => <Badge variant="outline">{r.type}</Badge> },
    {
      key: 'monthlyRate',
      header: 'Monthly Rate',
      value: (r) => r.monthlyRate ?? 0,
      render: (r) => (r.monthlyRate == null ? <Badge variant="muted">Variable</Badge> : <MoneyText value={r.monthlyRate} />),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Contracts & Work Orders"
        description="GHCL ambulance hiring contract — service rates by work order."
      />
      <DataTable columns={columns} rows={contractRates} searchable={false} csvName="contract-rates.csv" />
    </div>
  )
}
