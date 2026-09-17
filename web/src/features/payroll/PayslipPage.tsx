import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Mail, Printer, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MoneyText } from '@/components/common/MoneyText'
import { COMPANY, employees, payrollRuns } from '@/mock'

export function PayslipPage() {
  const { runId, empId } = useParams()
  const run = payrollRuns.find((r) => r.id === runId)
  const pe = run?.employees.find((e) => e.employeeId === empId)
  const emp = employees.find((e) => e.id === empId)

  if (!run || !pe || !emp) return <p>Payslip not found.</p>

  return (
    <div>
      <div className="no-print mb-4 flex items-center justify-between">
        <Link
          to={`/payroll/${runId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to run
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="size-4" /> Print / PDF
          </Button>
          <Button variant="outline">
            <Mail className="size-4" /> Email
          </Button>
          <Button variant="outline">
            <MessageCircle className="size-4" /> WhatsApp
          </Button>
        </div>
      </div>

      <Card className="print-area mx-auto max-w-2xl p-8">
        <div className="flex items-start justify-between border-b pb-4">
          <div>
            <h2 className="text-lg font-bold">{COMPANY.name}</h2>
            <p className="text-sm text-muted-foreground">Contractor to {COMPANY.client}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Salary Slip</p>
            <p className="text-sm text-muted-foreground">{run.period}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-2 py-4 text-sm md:grid-cols-3">
          <Info label="Employee" value={pe.name} />
          <Info label="Code" value={pe.code} />
          <Info label="Designation" value={pe.designation} />
          <Info label="PF Number" value={emp.pfNumber} />
          <Info label="Bank" value={emp.bankName} />
          <Info label="A/C" value={emp.bankAccount} />
          <Info label="Pay Date" value="2026-08-07" />
          <Info label="Pay Mode" value="Bank Transfer" />
          <Info label="Department" value={emp.department} />
        </div>

        <div className="grid grid-cols-4 gap-2 border-y py-2 text-center text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Month Days</p>
            <p className="font-semibold">{pe.monthDays}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Working</p>
            <p className="font-semibold">{pe.workingDays}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Present</p>
            <p className="font-semibold">{pe.present}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Week Off</p>
            <p className="font-semibold">{pe.weeklyOff}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 py-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold">Earnings</h3>
            <table className="w-full text-sm">
              <tbody>
                {pe.earnings.map((c) => (
                  <tr key={c.label} className="border-b last:border-0">
                    <td className="py-1.5 text-muted-foreground">{c.label}</td>
                    <td className="py-1.5 text-right"><MoneyText value={c.amount} /></td>
                  </tr>
                ))}
                <tr className="font-semibold">
                  <td className="py-1.5">Gross</td>
                  <td className="py-1.5 text-right"><MoneyText value={pe.gross} /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">Deductions</h3>
            <table className="w-full text-sm">
              <tbody>
                {pe.deductions.map((c) => (
                  <tr key={c.label} className="border-b last:border-0">
                    <td className="py-1.5 text-muted-foreground">{c.label}</td>
                    <td className="py-1.5 text-right"><MoneyText value={c.amount} /></td>
                  </tr>
                ))}
                <tr className="font-semibold">
                  <td className="py-1.5">Total Deductions</td>
                  <td className="py-1.5 text-right"><MoneyText value={pe.totalDeductions} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-primary/10 px-4 py-3">
          <span className="font-semibold">Net Salary</span>
          <span className="text-lg font-bold text-primary"><MoneyText value={pe.net} /></span>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          This is a computer-generated payslip and does not require a signature.
        </p>
      </Card>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}
