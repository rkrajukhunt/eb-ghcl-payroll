import { FileBarChart } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const REPORT_GROUPS: { title: string; reports: string[] }[] = [
  { title: 'HR', reports: ['Employee Master', 'New Employees', 'Employee Exit', 'Document Expiry', 'PF Report', 'Bank Master'] },
  { title: 'Attendance', reports: ['Monthly Attendance', 'Daily Attendance', 'Absentee Report', 'Weekly Off', 'OT Report', 'Late / Early'] },
  { title: 'Payroll', reports: ['Monthly Payroll', 'Salary Register', 'Salary Slips', 'Earnings Register', 'Deduction Register', 'Bank Payment File'] },
  { title: 'Wage', reports: ['Wage Register', 'Minimum Wage Comparison', 'Wage Rate History', 'Employee Wage History'] },
  { title: 'TA / DA', reports: ['TA Register', 'DA Register', 'Pending Approval', 'DA Invoice Support'] },
  { title: 'Contract', reports: ['Contract Register', 'Work Orders', 'Rate Master', 'ALS Billing', 'BLS Billing'] },
  { title: 'Ambulance', reports: ['Ambulance Register', 'Vehicle Utilization', 'Trip Register', 'Maintenance', 'Downtime'] },
  { title: 'Client', reports: ['GHCL Monthly Summary', 'Service Report', 'Attendance Certificate', 'Invoice Register'] },
]

export function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports" description="Registers and statements across all modules." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {REPORT_GROUPS.map((g) => (
          <Card key={g.title}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{g.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {g.reports.map((r) => (
                <button
                  key={r}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <FileBarChart className="size-4 shrink-0" />
                  {r}
                </button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
