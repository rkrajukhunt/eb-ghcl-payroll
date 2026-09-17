import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MoneyText } from '@/components/common/MoneyText'
import { StatusPill } from '@/components/common/StatusPill'
import { numberToWords } from '@/lib/utils'
import { COMPANY, invoices } from '@/mock'

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  )
}

export function InvoiceDetailPage() {
  const { id } = useParams()
  const inv = invoices.find((i) => i.id === id)
  if (!inv) return <p>Invoice not found.</p>

  return (
    <div>
      <div className="no-print mb-4 flex items-center justify-between">
        <Link to="/invoices" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Invoices
        </Link>
        <div className="flex items-center gap-2">
          <StatusPill status={inv.status} />
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="size-4" /> Print / PDF
          </Button>
        </div>
      </div>

      <Card className="print-area mx-auto max-w-3xl p-8">
        <div className="flex items-start justify-between border-b pb-4">
          <div>
            <h2 className="text-lg font-bold">{COMPANY.name}</h2>
            <p className="text-sm text-muted-foreground">GST: 24ABCDE1234F1Z5 · Gujarat</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">TAX INVOICE</p>
            <p className="text-sm">{inv.number}</p>
            <p className="text-sm text-muted-foreground">Date: {inv.date}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 md:grid-cols-4">
          <Info label="Customer" value={inv.customer} />
          <Info label="Work Order" value={inv.workOrder} />
          <Info label="Project Month" value={inv.projectMonth} />
          <Info label="Service Type" value={inv.type} />
          <Info label="Service Period" value={`${inv.servicePeriodFrom} → ${inv.servicePeriodTo}`} />
        </div>

        <table className="w-full border text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="border p-2 text-left">Description</th>
              <th className="border p-2">SAC</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2 text-right">Rate</th>
              <th className="border p-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {inv.items.map((it, i) => (
              <tr key={i}>
                <td className="border p-2">{it.description}</td>
                <td className="border p-2 text-center">{it.sac}</td>
                <td className="border p-2 text-center">{it.qty}</td>
                <td className="border p-2 text-right"><MoneyText value={it.rate} /></td>
                <td className="border p-2 text-right"><MoneyText value={it.rate * it.qty} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <table className="w-full max-w-xs text-sm">
            <tbody>
              <tr>
                <td className="py-1 text-muted-foreground">Subtotal</td>
                <td className="py-1 text-right"><MoneyText value={inv.subtotal} /></td>
              </tr>
              <tr>
                <td className="py-1 text-muted-foreground">CGST @ 9%</td>
                <td className="py-1 text-right"><MoneyText value={inv.cgst} /></td>
              </tr>
              <tr>
                <td className="py-1 text-muted-foreground">SGST @ 9%</td>
                <td className="py-1 text-right"><MoneyText value={inv.sgst} /></td>
              </tr>
              <tr className="border-t font-bold">
                <td className="py-1.5">Grand Total</td>
                <td className="py-1.5 text-right text-primary"><MoneyText value={inv.grandTotal} /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 border-t pt-3 text-sm">
          <span className="text-muted-foreground">Amount in words: </span>
          <span className="font-medium">{numberToWords(inv.grandTotal)}</span>
        </p>
        <p className="mt-6 text-right text-sm text-muted-foreground">For {COMPANY.name}</p>
      </Card>
    </div>
  )
}
