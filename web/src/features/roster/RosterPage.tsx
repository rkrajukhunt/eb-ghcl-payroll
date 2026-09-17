import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ambulances } from '@/mock'

// A compact weekly roster grid (mock).
const DAYS = ['Mon 06', 'Tue 07', 'Wed 08', 'Thu 09', 'Fri 10', 'Sat 11', 'Sun 12']

export function RosterPage() {
  return (
    <div>
      <PageHeader title="Roster" description="Weekly ambulance & crew roster · G shift 09:00–18:00" />
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="p-3 text-left font-medium">Vehicle</th>
                {DAYS.map((d) => (
                  <th key={d} className="p-3 text-center font-medium text-muted-foreground">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ambulances.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="p-3">
                    <div className="font-medium">{a.vehicleNo}</div>
                    <Badge variant="outline">{a.type}</Badge>
                  </td>
                  {DAYS.map((d, i) => {
                    const off = i === 6 // Sunday weekly-off example
                    return (
                      <td key={d} className="p-2 text-center align-top">
                        {off ? (
                          <Badge variant="muted">W/O</Badge>
                        ) : (
                          <div className="rounded-md border bg-accent/40 p-1.5 text-xs">
                            <div className="font-medium">{a.driver.split(' ')[0]}</div>
                            <div className="text-muted-foreground">{a.crew.split(' ')[0]}</div>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
