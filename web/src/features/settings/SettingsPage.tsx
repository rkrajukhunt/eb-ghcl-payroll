import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MoneyText } from '@/components/common/MoneyText'
import { salaryComponents, shifts, wageRates } from '@/mock'

const ROLES = ['Super Admin', 'HR', 'Operations', 'Payroll', 'Accounts', 'GHCL Client']
const MODULES = ['Employees', 'Attendance', 'Payroll', 'Invoices', 'Ambulances', 'Reports']
const MATRIX: Record<string, string[]> = {
  'Super Admin': MODULES,
  HR: ['Employees', 'Attendance', 'Payroll', 'Reports'],
  Operations: ['Ambulances', 'Attendance', 'Reports'],
  Payroll: ['Payroll', 'Attendance', 'Reports'],
  Accounts: ['Invoices', 'Payroll', 'Reports'],
  'GHCL Client': ['Ambulances', 'Attendance', 'Invoices', 'Reports'],
}

export function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Master configuration for payroll, wages, shifts and access." />
      <Tabs defaultValue="components">
        <TabsList>
          <TabsTrigger value="components">Salary Components</TabsTrigger>
          <TabsTrigger value="rates">Wage Rates</TabsTrigger>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="components">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Kind</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead>Taxable</TableHead>
                    <TableHead>PF</TableHead>
                    <TableHead>ESIC</TableHead>
                    <TableHead>PT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salaryComponents.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.kind}</TableCell>
                      <TableCell>
                        <Badge variant={c.side === 'Earning' ? 'success' : 'muted'}>{c.side}</Badge>
                      </TableCell>
                      <TableCell>{c.taxable ? '✓' : '—'}</TableCell>
                      <TableCell>{c.pf ? '✓' : '—'}</TableCell>
                      <TableCell>{c.esic ? '✓' : '—'}</TableCell>
                      <TableCell>{c.pt ? '✓' : '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Effective From</TableHead>
                    <TableHead>Effective To</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Basic / day</TableHead>
                    <TableHead className="text-right">OT Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wageRates.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell>{w.effectiveFrom}</TableCell>
                      <TableCell>{w.effectiveTo ?? <Badge variant="success">Current</Badge>}</TableCell>
                      <TableCell>{w.category}</TableCell>
                      <TableCell className="text-right"><MoneyText value={w.basic} decimals /></TableCell>
                      <TableCell className="text-right"><MoneyText value={w.otRate} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shifts">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shift</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Break</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shifts.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.start}</TableCell>
                      <TableCell>{s.end}</TableCell>
                      <TableCell>{s.breakStart ? `${s.breakStart}–${s.breakEnd}` : '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    {MODULES.map((m) => (
                      <TableHead key={m} className="text-center">{m}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ROLES.map((r) => (
                    <TableRow key={r}>
                      <TableCell className="font-medium">{r}</TableCell>
                      {MODULES.map((m) => (
                        <TableCell key={m} className="text-center">
                          {MATRIX[r].includes(m) ? '✓' : '—'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
