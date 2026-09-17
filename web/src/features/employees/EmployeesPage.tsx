import { useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusPill } from '@/components/common/StatusPill'
import { ExpiryBadge, expiryState } from '@/components/common/ExpiryBadge'
import { DataTable, type Column } from '@/components/common/DataTable'
import { employees } from '@/mock'
import type { Employee } from '@/types'

function earliestExpiry(emp: Employee): string | undefined {
  const dates = emp.documents.map((d) => d.expiry).filter(Boolean) as string[]
  if (dates.length === 0) return undefined
  return dates.sort()[0]
}

export function EmployeesPage() {
  const navigate = useNavigate()

  const columns: Column<Employee>[] = [
    { key: 'code', header: 'Code', sortable: true },
    { key: 'name', header: 'Name', sortable: true, render: (e) => <span className="font-medium">{e.name}</span> },
    { key: 'type', header: 'Type', render: (e) => <Badge variant="secondary">{e.type}</Badge> },
    { key: 'designation', header: 'Designation' },
    { key: 'vehicle', header: 'Vehicle', render: (e) => e.vehicle ?? '—' },
    {
      key: 'ambulanceType',
      header: 'Ambulance',
      render: (e) => (e.ambulanceType ? <Badge variant="outline">{e.ambulanceType}</Badge> : '—'),
    },
    { key: 'status', header: 'Status', render: (e) => <StatusPill status={e.status} /> },
    {
      key: 'expiry',
      header: 'Doc Expiry',
      value: (e) => earliestExpiry(e) ?? '',
      render: (e) => <ExpiryBadge expiry={earliestExpiry(e)} />,
    },
  ]

  const expiredCount = employees.filter((e) => expiryState(earliestExpiry(e)) === 'expired').length

  return (
    <div>
      <PageHeader
        title="Employees"
        description={`${employees.length} staff on the GHCL contract · ${expiredCount} with expired documents`}
        actions={
          <Button>
            <UserPlus className="size-4" /> Add Employee
          </Button>
        }
      />
      <DataTable
        columns={columns}
        rows={employees}
        csvName="employees.csv"
        onRowClick={(e) => navigate(`/employees/${e.id}`)}
      />
    </div>
  )
}
