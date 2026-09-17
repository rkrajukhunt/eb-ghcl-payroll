import { CheckCircle2, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatINR } from '@/lib/utils'
import { CalendarCheck, Users, Wallet, ClipboardCheck, Receipt } from 'lucide-react'
import { payrollRuns, reconChecks, tada, totalMandays, invoices, employees } from '@/mock'

export function ReconciliationPage() {
  const run = payrollRuns[0]
  const tadaTotal = tada.reduce((s, r) => s + r.amount, 0)
  const billing = invoices.reduce((s, i) => s + i.subtotal, 0)

  return (
    <div>
      <PageHeader
        title="Reconciliation"
        description="Cross-check attendance, payroll, wage register, TA/DA, contract and invoices."
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Employees" value={employees.length} icon={Users} />
        <StatCard label="Mandays" value={totalMandays} icon={CalendarCheck} />
        <StatCard label="Payroll Gross" value={formatINR(run.gross)} icon={Wallet} />
        <StatCard label="Net Payroll" value={formatINR(run.net)} icon={Wallet} accent="success" />
        <StatCard label="TA / DA" value={formatINR(tadaTotal)} icon={ClipboardCheck} />
        <StatCard label="Billing" value={formatINR(billing)} icon={Receipt} accent="primary" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reconciliation checks</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {reconChecks.map((c) => (
            <div
              key={c.label}
              className="flex items-start gap-3 rounded-lg border p-3"
            >
              {c.ok ? (
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
              ) : (
                <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
              )}
              <div>
                <p className="text-sm font-medium">{c.label}</p>
                <p className="text-xs text-muted-foreground">{c.detail}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
