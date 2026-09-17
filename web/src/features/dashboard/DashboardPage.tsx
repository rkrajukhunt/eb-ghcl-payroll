import { Link } from 'react-router-dom'
import {
  Users,
  Ambulance,
  CalendarCheck,
  Wallet,
  Banknote,
  MinusCircle,
  ClipboardCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MoneyText } from '@/components/common/MoneyText'
import { formatINR } from '@/lib/utils'
import {
  employees,
  ambulances,
  totalMandays,
  payrollRuns,
  invoices,
  tada,
} from '@/mock'

export function DashboardPage() {
  const run = payrollRuns[0]
  const tadaTotal = tada.reduce((s, r) => s + r.amount, 0)
  const revenue = invoices.reduce((s, inv) => s + inv.subtotal, 0)
  const payrollCost = run.gross
  const cost = payrollCost + tadaTotal
  const margin = revenue - cost

  const chartData = [
    { name: 'ALS', Revenue: 190000, Cost: 0 },
    { name: 'BLS', Revenue: 130000, Cost: 0 },
    { name: 'DA', Revenue: 1500, Cost: tadaTotal },
    { name: 'Payroll', Revenue: 0, Cost: payrollCost },
  ]

  const alerts = [
    { icon: AlertTriangle, tone: 'text-destructive', text: '2 documents expired (PUC & driving licence)' },
    { icon: AlertTriangle, tone: 'text-warning', text: '3 attendance records pending approval' },
    { icon: AlertTriangle, tone: 'text-warning', text: '1 overtime record pending approval' },
    { icon: AlertTriangle, tone: 'text-warning', text: 'DA invoice not yet generated' },
    { icon: CheckCircle2, tone: 'text-success', text: 'Payroll run PR-2026-07 validated' },
  ]

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="GHCL ambulance contract — workforce, payroll and billing overview."
        actions={
          <div className="flex gap-2">
            <Badge variant="outline">Attendance: Jul 2026</Badge>
            <Badge variant="outline">Payroll: Jul 2026</Badge>
            <Badge variant="secondary">Invoice: Aug 2026</Badge>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Employees" value={employees.length} icon={Users} />
        <StatCard label="Ambulances" value={ambulances.length} icon={Ambulance} hint="1 ALS · 1 BLS" />
        <StatCard label="Present Mandays" value={totalMandays} icon={CalendarCheck} accent="success" />
        <StatCard label="Payroll Gross" value={formatINR(run.gross)} icon={Wallet} />
        <StatCard label="Net Payroll" value={formatINR(run.net)} icon={Banknote} accent="success" />
        <StatCard label="Deductions" value={formatINR(run.deductions)} icon={MinusCircle} accent="warning" />
        <StatCard label="TA / DA" value={formatINR(tadaTotal)} icon={ClipboardCheck} />
        <StatCard label="Revenue (Aug)" value={formatINR(revenue)} icon={TrendingUp} accent="primary" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue vs Cost — Aug 2026</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis
                    tickFormatter={(v) => `${v / 1000}k`}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    width={40}
                  />
                  <Tooltip
                    formatter={(v) => formatINR(Number(v))}
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  />
                  <Legend />
                  <Bar dataKey="Revenue" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill="hsl(174 72% 40%)" />
                    ))}
                  </Bar>
                  <Bar dataKey="Cost" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill="hsl(38 92% 55%)" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 border-t pt-4 text-sm">
              <div>
                <p className="text-muted-foreground">Revenue</p>
                <p className="font-semibold"><MoneyText value={revenue} /></p>
              </div>
              <div>
                <p className="text-muted-foreground">Cost (payroll + TA/DA)</p>
                <p className="font-semibold"><MoneyText value={cost} /></p>
              </div>
              <div>
                <p className="text-muted-foreground">Gross Margin</p>
                <p className="font-semibold text-success">
                  <MoneyText value={margin} /> ({Math.round((margin / revenue) * 100)}%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <a.icon className={`mt-0.5 size-4 shrink-0 ${a.tone}`} />
                <span>{a.text}</span>
              </div>
            ))}
            <Link
              to="/exceptions"
              className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
            >
              View all exceptions →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
