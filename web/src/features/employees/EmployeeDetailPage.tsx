import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ExpiryBadge } from '@/components/common/ExpiryBadge'
import { MoneyText } from '@/components/common/MoneyText'
import { employees } from '@/mock'

function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  )
}

export function EmployeeDetailPage() {
  const { id } = useParams()
  const emp = employees.find((e) => e.id === id)

  if (!emp) {
    return (
      <div>
        <p>Employee not found.</p>
        <Link to="/employees" className="text-primary hover:underline">
          Back to employees
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/employees" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Employees
      </Link>
      <PageHeader
        title={emp.name}
        description={`${emp.code} · ${emp.designation} · ${emp.site}`}
        actions={
          <div className="flex gap-2">
            <Badge variant="secondary">{emp.type}</Badge>
            {emp.ambulanceType && <Badge variant="outline">{emp.ambulanceType}</Badge>}
            <Button variant="outline">Edit</Button>
          </div>
        }
      />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="statutory">Statutory</TabsTrigger>
          <TabsTrigger value="bank">Bank</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="assignment">Assignment</TabsTrigger>
          <TabsTrigger value="salary">Salary</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent className="grid grid-cols-2 gap-4 p-6 md:grid-cols-3">
              <Field label="Employee Code" value={emp.code} />
              <Field label="Full Name" value={emp.name} />
              <Field label="Father's Name" value={emp.fatherName} />
              <Field label="Gender" value={emp.gender} />
              <Field label="Date of Birth" value={emp.dob} />
              <Field label="Mobile" value={emp.mobile} />
              <Field label="Department" value={emp.department} />
              <Field label="Designation" value={emp.designation} />
              <Field label="Joining Date" value={emp.joiningDate} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statutory">
          <Card>
            <CardContent className="grid grid-cols-2 gap-4 p-6 md:grid-cols-3">
              <Field label="PF Number" value={emp.pfNumber} />
              <Field label="UAN" value={emp.uan} />
              <Field label="ESIC" value={emp.esic} />
              <Field label="PAN" value={emp.pan} />
              <Field label="Professional Tax" value={`₹${emp.pt}/mo`} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank">
          <Card>
            <CardContent className="grid grid-cols-2 gap-4 p-6 md:grid-cols-3">
              <Field label="Bank Name" value={emp.bankName} />
              <Field label="Account Number" value={emp.bankAccount} />
              <Field label="IFSC" value={emp.ifsc} />
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
                  {emp.documents.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell>{d.number ?? '—'}</TableCell>
                      <TableCell>
                        <ExpiryBadge expiry={d.expiry} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignment">
          <Card>
            <CardContent className="grid grid-cols-2 gap-4 p-6 md:grid-cols-3">
              <Field label="Shift" value={emp.shift} />
              <Field label="Vehicle" value={emp.vehicle ?? '—'} />
              <Field label="Ambulance Type" value={emp.ambulanceType ?? '—'} />
              <Field label="GHCL Site" value={emp.site} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary">
          <Card>
            <CardContent className="grid grid-cols-2 gap-4 p-6 md:grid-cols-3">
              <Field label="Wage Category" value={emp.wageCategory} />
              <div>
                <p className="text-xs text-muted-foreground">Applicable Wage Rate</p>
                <p className="text-sm font-medium">
                  <MoneyText value={emp.wageRate} decimals /> / day
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
