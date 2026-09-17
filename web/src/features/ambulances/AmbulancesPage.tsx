import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable, type Column } from '@/components/common/DataTable'
import { StatusPill } from '@/components/common/StatusPill'
import { ExpiryBadge } from '@/components/common/ExpiryBadge'
import { ambulances } from '@/mock'
import type { Ambulance } from '@/types'

function docExpiry(a: Ambulance, name: string) {
  return a.documents.find((d) => d.name === name)?.expiry
}

export function AmbulancesPage() {
  const navigate = useNavigate()
  const columns: Column<Ambulance>[] = [
    { key: 'vehicleNo', header: 'Vehicle', render: (a) => <span className="font-medium">{a.vehicleNo}</span> },
    { key: 'type', header: 'Type', render: (a) => <Badge variant="outline">{a.type}</Badge> },
    { key: 'makeModel', header: 'Make / Model' },
    { key: 'driver', header: 'Driver' },
    { key: 'crew', header: 'Crew' },
    { key: 'fitness', header: 'Fitness', value: (a) => docExpiry(a, 'Fitness') ?? '', render: (a) => <ExpiryBadge expiry={docExpiry(a, 'Fitness')} /> },
    { key: 'puc', header: 'PUC', value: (a) => docExpiry(a, 'PUC') ?? '', render: (a) => <ExpiryBadge expiry={docExpiry(a, 'PUC')} /> },
    { key: 'status', header: 'Status', render: (a) => <StatusPill status={a.status} /> },
  ]

  return (
    <div>
      <PageHeader
        title="Ambulances"
        description="Fleet deployed on the GHCL contract."
        actions={
          <Button>
            <Plus className="size-4" /> Add Ambulance
          </Button>
        }
      />
      <DataTable columns={columns} rows={ambulances} csvName="ambulances.csv" onRowClick={(a) => navigate(`/ambulances/${a.id}`)} />
    </div>
  )
}
