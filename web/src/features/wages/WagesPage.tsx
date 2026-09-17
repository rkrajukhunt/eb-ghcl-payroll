import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MoneyText } from '@/components/common/MoneyText'
import { payrollRuns, wageRates } from '@/mock'

export function WagesPage() {
  const run = payrollRuns[0]

  return (
    <div>
      <PageHeader
        title="Wage Register"
        description="Statutory wage register · GHCL as principal employer · Jul 2026"
        actions={<Badge variant="outline">Min wage ₹522.50/day</Badge>}
      />

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Wage register — {run.period}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-center">WD</TableHead>
                <TableHead className="text-right">Basic</TableHead>
                <TableHead className="text-right">HRA</TableHead>
                <TableHead className="text-right">Special</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {run.employees.map((e) => {
                const basic = e.earnings.find((c) => c.label === 'Basic')?.amount ?? 0
                const hra = e.earnings.find((c) => c.label === 'HRA')?.amount ?? 0
                const special = e.earnings.find((c) => c.label === 'Special Allowance')?.amount ?? 0
                return (
                  <TableRow key={e.employeeId}>
                    <TableCell>{e.code}</TableCell>
                    <TableCell className="font-medium">{e.name}</TableCell>
                    <TableCell className="text-center">{e.workingDays}</TableCell>
                    <TableCell className="text-right"><MoneyText value={basic} /></TableCell>
                    <TableCell className="text-right"><MoneyText value={hra} /></TableCell>
                    <TableCell className="text-right"><MoneyText value={special} /></TableCell>
                    <TableCell className="text-right"><MoneyText value={e.totalDeductions} /></TableCell>
                    <TableCell className="text-right font-medium"><MoneyText value={e.net} /></TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>Total earnings</TableCell>
                <TableCell className="text-right"><MoneyText value={run.deductions} /></TableCell>
                <TableCell className="text-right"><MoneyText value={run.net} /></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wage rate history (versioned)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Effective From</TableHead>
                <TableHead>Effective To</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead className="text-right">Basic / day</TableHead>
                <TableHead className="text-right">OT Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wageRates.map((w, i) => (
                <TableRow key={w.id}>
                  <TableCell>{w.effectiveFrom}</TableCell>
                  <TableCell>{w.effectiveTo ?? <Badge variant="success">Current</Badge>}</TableCell>
                  <TableCell>{w.category}</TableCell>
                  <TableCell>{w.designation}</TableCell>
                  <TableCell className="text-right">
                    <MoneyText value={w.basic} decimals />
                    {i === 0 && <span className="ml-1 text-xs text-muted-foreground">(active)</span>}
                  </TableCell>
                  <TableCell className="text-right"><MoneyText value={w.otRate} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-3 text-xs text-muted-foreground">
            Rates are never overwritten — historical payroll always recomputes with the rate valid for its period.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
