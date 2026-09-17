export type EmployeeType = 'Driver' | 'Nurse' | 'EMT' | 'Helper' | 'Other'
export type EmployeeStatus = 'Active' | 'Inactive' | 'Left'
export type AmbulanceType = 'ALS' | 'BLS'
export type AttendanceMark = 'P' | 'A' | 'W/O' | 'PH' | 'HD'
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected'
export type PayrollStatus = 'Draft' | 'Validated' | 'Approved' | 'Closed'
export type InvoiceStatus = 'Draft' | 'Generated' | 'Sent' | 'Paid'
export type Severity = 'high' | 'medium' | 'low'
export type Role = 'Super Admin' | 'HR' | 'Operations' | 'Payroll' | 'Accounts' | 'GHCL Client'

export interface DocumentRecord {
  id: string
  name: string
  number?: string
  expiry?: string // ISO date
}

export interface Employee {
  id: string
  code: string
  name: string
  fatherName: string
  gender: 'Male' | 'Female'
  dob: string
  mobile: string
  type: EmployeeType
  designation: string
  department: string
  site: string
  shift: string
  vehicle?: string
  ambulanceType?: AmbulanceType
  joiningDate: string
  status: EmployeeStatus
  // statutory
  pfNumber: string
  uan: string
  esic: string
  pan: string
  pt: number
  // bank
  bankName: string
  bankAccount: string
  ifsc: string
  // payroll
  wageCategory: string
  wageRate: number
  documents: DocumentRecord[]
}

export interface Ambulance {
  id: string
  vehicleNo: string
  type: AmbulanceType
  makeModel: string
  site: string
  driver: string
  crew: string
  status: 'Active' | 'Maintenance' | 'Idle'
  documents: DocumentRecord[]
}

export interface AttendanceRow {
  employeeId: string
  code: string
  name: string
  marks: AttendanceMark[] // index 0 = day 1
  present: number
  absent: number
  weeklyOff: number
  workingDays: number
}

export interface OvertimeRecord {
  id: string
  employeeId: string
  name: string
  date: string
  scheduledHours: number
  actualHours: number
  otHours: number
  otRate: number
  amount: number
  status: ApprovalStatus
}

export interface TadaRecord {
  id: string
  employeeId: string
  code: string
  name: string
  date: string
  vardhi: string // route
  ta: number
  da: number
  amount: number
  status: ApprovalStatus
}

export interface PayComponent {
  label: string
  amount: number
}

export interface PayrollEmployee {
  employeeId: string
  code: string
  name: string
  designation: string
  monthDays: number
  workingDays: number
  present: number
  weeklyOff: number
  earnings: PayComponent[]
  deductions: PayComponent[]
  gross: number
  totalDeductions: number
  net: number
}

export interface PayrollRun {
  id: string
  period: string // e.g. "Jul 2026"
  status: PayrollStatus
  employeeCount: number
  gross: number
  net: number
  deductions: number
  employees: PayrollEmployee[]
}

export interface SalaryComponent {
  id: string
  name: string
  kind: 'Fixed' | 'Percentage' | 'Per Day' | 'Per Hour' | 'Formula' | 'Attendance'
  taxable: boolean
  pf: boolean
  esic: boolean
  pt: boolean
  side: 'Earning' | 'Deduction'
}

export interface WageRate {
  id: string
  effectiveFrom: string
  effectiveTo?: string
  category: string
  designation: string
  basic: number
  da: number
  otRate: number
}

export interface Shift {
  id: string
  name: string
  start: string
  end: string
  breakStart?: string
  breakEnd?: string
}

export interface ContractRate {
  id: string
  client: string
  workOrder: string
  service: string
  type: AmbulanceType | 'DA'
  monthlyRate: number | null
}

export interface InvoiceItem {
  description: string
  sac: string
  qty: number
  rate: number
}

export interface Invoice {
  id: string
  number: string
  date: string
  projectMonth: string
  customer: string
  workOrder: string
  servicePeriodFrom: string
  servicePeriodTo: string
  type: AmbulanceType | 'DA'
  items: InvoiceItem[]
  subtotal: number
  cgst: number
  sgst: number
  grandTotal: number
  status: InvoiceStatus
}

export interface ReconCheck {
  label: string
  ok: boolean
  detail: string
}

export interface Exception {
  id: string
  group: 'Payroll' | 'Attendance' | 'Billing'
  message: string
  severity: Severity
  entity: string
}

export interface AuditEntry {
  id: string
  who: string
  what: string
  when: string
  oldValue: string
  newValue: string
  reason: string
}

export interface MonthCloseItem {
  label: string
  done: boolean
}
