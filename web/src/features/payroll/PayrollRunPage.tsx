import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusPill } from '@/components/common/StatusPill'
import { MoneyText } from '@/components/common/MoneyText'
import { ApprovalTimeline } from '@/components/common/ApprovalTimeline'
import { payrollRuns } from '@/mock'

export function PayrollRunPage() {
  const { runId } = useParams()
  const navigate = useNavigate()
  const run = payrollRuns.find((r) => r.id === runId)

  if (!run) return <p>Run not found.</p>

  return (
    <div>
      <Link to="/payroll" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Payroll Runs
      </Link>
      <PageHeader
        title={`Payroll — ${run.period}`}
        description={`${run.id} · ${run.employeeCount} employees`}
        actions={<StatusPill status={run.status} />}
      />

      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Employee payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-center">WD</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead className="text-right">Deductions</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {run.employees.map((e) => (
                  <TableRow key={e.employeeId}>
                    <TableCell>{e.code}</TableCell>
                    <TableCell className="font-medium">{e.name}</TableCell>
                    <TableCell className="text-center">{e.workingDays}</TableCell>
                    <TableCell className="text-right"><MoneyText value={e.gross} /></TableCell>
                    <TableCell className="text-right"><MoneyText value={e.totalDeductions} /></TableCell>
                    <TableCell className="text-right font-medium"><MoneyText value={e.net} /></TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/payroll/${run.id}/payslip/${e.employeeId}`)}
                      >
                        <FileText className="size-4" /> Slip
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total ({run.employeeCount})</TableCell>
                  <TableCell className="text-right"><MoneyText value={run.gross} /></TableCell>
                  <TableCell className="text-right"><MoneyText value={run.deductions} /></TableCell>
                  <TableCell className="text-right"><MoneyText value={run.net} /></TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <ApprovalTimeline
              steps={[
                { label: 'HR prepared', state: 'done' },
                { label: 'Payroll calculated', state: 'done' },
                { label: 'Manager review', state: 'current' },
                { label: 'Accounts approval', state: 'pending' },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
