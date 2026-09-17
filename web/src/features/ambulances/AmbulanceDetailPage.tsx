import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ExpiryBadge } from '@/components/common/ExpiryBadge'
import { StatusPill } from '@/components/common/StatusPill'
import { ambulances } from '@/mock'

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  )
}

export function AmbulanceDetailPage() {
  const { id } = useParams()
  const amb = ambulances.find((a) => a.id === id)
  if (!amb) return <p>Ambulance not found.</p>

  return (
    <div>
      <Link to="/ambulances" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Ambulances
      </Link>
      <PageHeader
        title={amb.vehicleNo}
        description={`${amb.makeModel} · ${amb.site}`}
        actions={
          <div className="flex gap-2">
            <Badge variant="outline">{amb.type}</Badge>
            <StatusPill status={amb.status} />
          </div>
        }
      />

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="crew">Crew</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardContent className="grid grid-cols-2 gap-4 p-6 md:grid-cols-3">
              <Field label="Vehicle Number" value={amb.vehicleNo} />
              <Field label="Ambulance Type" value={amb.type} />
              <Field label="Make / Model" value={amb.makeModel} />
              <Field label="Site" value={amb.site} />
              <Field label="Status" value={amb.status} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents & expiry</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Number</TableHead>
                    <TableHead>Expiry</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {amb.documents.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell>{d.number ?? '—'}</TableCell>
                      <TableCell><ExpiryBadge expiry={d.expiry} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crew">
          <Card>
            <CardContent className="grid grid-cols-2 gap-4 p-6">
              <Field label="Driver" value={amb.driver} />
              <Field label="Nursing / EMT" value={amb.crew} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
