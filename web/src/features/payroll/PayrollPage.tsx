import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, type Column } from '@/components/common/DataTable'
import { StatusPill } from '@/components/common/StatusPill'
import { MoneyText } from '@/components/common/MoneyText'
import { payrollRuns } from '@/mock'
import type { PayrollRun } from '@/types'

export function PayrollPage() {
  const navigate = useNavigate()
  const columns: Column<PayrollRun>[] = [
    { key: 'id', header: 'Run ID', render: (r) => <span className="font-medium">{r.id}</span> },
    { key: 'period', header: 'Period' },
    { key: 'employeeCount', header: 'Employees' },
    { key: 'gross', header: 'Gross', render: (r) => <MoneyText value={r.gross} /> },
    { key: 'deductions', header: 'Deductions', render: (r) => <MoneyText value={r.deductions} /> },
    { key: 'net', header: 'Net', render: (r) => <span className="font-medium"><MoneyText value={r.net} /></span> },
    { key: 'status', header: 'Status', render: (r) => <StatusPill status={r.status} /> },
  ]

  return (
    <div>
      <PageHeader title="Payroll Runs" description="Monthly payroll processing for the GHCL contract." />
      <DataTable
        columns={columns}
        rows={payrollRuns}
        searchable={false}
        onRowClick={(r) => navigate(`/payroll/${r.id}`)}
      />
    </div>
  )
}
