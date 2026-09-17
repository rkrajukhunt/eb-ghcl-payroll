import type {
  Ambulance,
  AttendanceRow,
  AuditEntry,
  ContractRate,
  Employee,
  Exception,
  Invoice,
  MonthCloseItem,
  OvertimeRecord,
  PayrollEmployee,
  PayrollRun,
  ReconCheck,
  SalaryComponent,
  Shift,
  TadaRecord,
  WageRate,
} from '@/types'

export const COMPANY = {
  name: 'KENKO Healthcare Services',
  client: 'GHCL Limited',
  attendanceMonth: 'Jul 2026',
  payrollMonth: 'Jul 2026',
  invoiceMonth: 'Aug 2026',
}

const WAGE_RATE = 522.5

// --- Employees -------------------------------------------------------------
const empSeed: Array<
  Pick<Employee, 'code' | 'name' | 'fatherName' | 'type' | 'designation' | 'shift'> & {
    vehicle?: string
    ambulanceType?: Employee['ambulanceType']
    docExpiryDays?: number
  }
> = [
  { code: 'EMP001', name: 'Bhagirathsinh Rathod', fatherName: 'Karansinh Rathod', type: 'Driver', designation: 'Ambulance Driver', shift: 'G (09:00-18:00)', vehicle: 'GJ-03-AB-1201', ambulanceType: 'ALS', docExpiryDays: -12 },
  { code: 'EMP002', name: 'Govindbhai Parmar', fatherName: 'Lakhabhai Parmar', type: 'Driver', designation: 'Ambulance Driver', shift: 'G (09:00-18:00)', vehicle: 'GJ-03-CD-4487', ambulanceType: 'BLS', docExpiryDays: 22 },
  { code: 'EMP003', name: 'Shailesh Makwana', fatherName: 'Ratilal Makwana', type: 'Nurse', designation: 'Staff Nurse', shift: 'G (09:00-18:00)', vehicle: 'GJ-03-AB-1201', ambulanceType: 'ALS' },
  { code: 'EMP004', name: 'Mahesh Chauhan', fatherName: 'Bhikhabhai Chauhan', type: 'EMT', designation: 'Emergency Technician', shift: 'G (09:00-18:00)', vehicle: 'GJ-03-CD-4487', ambulanceType: 'BLS', docExpiryDays: 8 },
  { code: 'EMP005', name: 'Rameshbhai Solanki', fatherName: 'Jivabhai Solanki', type: 'Driver', designation: 'Ambulance Driver', shift: 'G (09:00-18:00)', vehicle: 'GJ-03-AB-1201', ambulanceType: 'ALS' },
  { code: 'EMP006', name: 'Kiran Vaghela', fatherName: 'Naranbhai Vaghela', type: 'Nurse', designation: 'Staff Nurse', shift: 'G (09:00-18:00)', vehicle: 'GJ-03-CD-4487', ambulanceType: 'BLS', docExpiryDays: -3 },
  { code: 'EMP007', name: 'Dineshbhai Zala', fatherName: 'Pravinbhai Zala', type: 'EMT', designation: 'Emergency Technician', shift: 'G (09:00-18:00)', vehicle: 'GJ-03-AB-1201', ambulanceType: 'ALS' },
  { code: 'EMP008', name: 'Sanjay Dabhi', fatherName: 'Hasmukhbhai Dabhi', type: 'Helper', designation: 'Ambulance Helper', shift: 'G (09:00-18:00)', vehicle: 'GJ-03-CD-4487', ambulanceType: 'BLS', docExpiryDays: 45 },
]

function isoInDays(days: number): string {
  const d = new Date('2026-09-17')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export const employees: Employee[] = empSeed.map((e, i) => ({
  id: String(i + 1),
  code: e.code,
  name: e.name,
  fatherName: e.fatherName,
  gender: e.type === 'Nurse' && i % 2 === 0 ? 'Female' : 'Male',
  dob: `19${85 + i}-0${(i % 8) + 1}-1${i}`,
  mobile: `98${(250000000 + i * 111111).toString().slice(0, 8)}`,
  type: e.type,
  designation: e.designation,
  department: 'Ambulance Operations',
  site: 'GHCL Plant, Sutrapada',
  shift: e.shift,
  vehicle: e.vehicle,
  ambulanceType: e.ambulanceType,
  joiningDate: `2024-0${(i % 9) + 1}-15`,
  status: 'Active',
  pfNumber: `GJ/RAJ/00${45210 + i}`,
  uan: `1004${(56780000 + i).toString()}`,
  esic: `31009${(120045 + i).toString()}`,
  pan: `ABCPR${1200 + i}K`,
  pt: 200,
  bankName: 'State Bank of India',
  bankAccount: `3345${(120078000 + i * 7).toString()}`,
  ifsc: 'SBIN0004521',
  wageCategory: 'Unskilled / Semi-skilled',
  wageRate: WAGE_RATE,
  documents: [
    { id: `${i}-dl`, name: 'Driving Licence', number: `GJ0320240${1200 + i}`, expiry: e.type === 'Driver' ? isoInDays(e.docExpiryDays ?? 300) : undefined },
    { id: `${i}-med`, name: 'Medical Certificate', number: `MED-${2200 + i}`, expiry: isoInDays((e.docExpiryDays ?? 200) + 60) },
    { id: `${i}-aadhaar`, name: 'Aadhaar', number: `XXXX-XXXX-${4000 + i}` },
    { id: `${i}-police`, name: 'Police Verification', number: `PV-${900 + i}`, expiry: isoInDays(400) },
  ].filter((d) => !(d.name === 'Driving Licence' && !d.expiry)),
}))

// --- Attendance (July 2026, 31 days) --------------------------------------
const targetWorkingDays = [26, 26, 25, 25, 26, 24, 25, 26] // sums to 203

function buildMarks(target: number): AttendanceRow['marks'] {
  const days = 31
  const marks: AttendanceRow['marks'] = []
  // July 1, 2026 is a Wednesday (getDay: Wed = 3). Sundays fall on 5,12,19,26.
  for (let day = 1; day <= days; day++) {
    const dow = new Date(2026, 6, day).getDay()
    marks.push(dow === 0 ? 'W/O' : 'P')
  }
  const weeklyOff = marks.filter((m) => m === 'W/O').length
  let absentNeeded = days - weeklyOff - target
  for (let d = 0; d < days && absentNeeded > 0; d++) {
    if (marks[d] === 'P') {
      marks[d] = 'A'
      absentNeeded--
    }
  }
  return marks
}

export const attendance: AttendanceRow[] = employees.map((emp, i) => {
  const marks = buildMarks(targetWorkingDays[i])
  const present = marks.filter((m) => m === 'P').length
  const absent = marks.filter((m) => m === 'A').length
  const weeklyOff = marks.filter((m) => m === 'W/O').length
  return {
    employeeId: emp.id,
    code: emp.code,
    name: emp.name,
    marks,
    present,
    absent,
    weeklyOff,
    workingDays: present,
  }
})

export const totalMandays = attendance.reduce((s, r) => s + r.workingDays, 0) // 203

// --- Payroll (July 2026) ---------------------------------------------------
const grossSeed = [16800, 16200, 15400, 15400, 16800, 14200, 14894, 14400] // sum 124094
const deductionSeed = [1800, 1750, 1600, 1600, 1800, 1470, 1550, 1400] // sum 12970

const payrollEmployees: PayrollEmployee[] = employees.map((emp, i) => {
  const gross = grossSeed[i]
  const basic = Math.round(gross * 0.5)
  const hra = Math.round(gross * 0.24)
  const conveyance = Math.round(gross * 0.1)
  const special = gross - basic - hra - conveyance
  const pt = 200
  const pf = deductionSeed[i] - pt
  const totalDeductions = deductionSeed[i]
  const att = attendance[i]
  return {
    employeeId: emp.id,
    code: emp.code,
    name: emp.name,
    designation: emp.designation,
    monthDays: 31,
    workingDays: att.workingDays,
    present: att.present,
    weeklyOff: att.weeklyOff,
    earnings: [
      { label: 'Basic', amount: basic },
      { label: 'HRA', amount: hra },
      { label: 'Conveyance', amount: conveyance },
      { label: 'Special Allowance', amount: special },
    ],
    deductions: [
      { label: 'PF (Employee)', amount: pf },
      { label: 'Professional Tax', amount: pt },
    ],
    gross,
    totalDeductions,
    net: gross - totalDeductions,
  }
})

export const payrollRuns: PayrollRun[] = [
  {
    id: 'PR-2026-07',
    period: 'Jul 2026',
    status: 'Validated',
    employeeCount: payrollEmployees.length,
    gross: grossSeed.reduce((a, b) => a + b, 0),
    net: grossSeed.reduce((a, b) => a + b, 0) - deductionSeed.reduce((a, b) => a + b, 0),
    deductions: deductionSeed.reduce((a, b) => a + b, 0),
    employees: payrollEmployees,
  },
]

// --- Ambulances ------------------------------------------------------------
export const ambulances: Ambulance[] = [
  {
    id: 'A1',
    vehicleNo: 'GJ-03-AB-1201',
    type: 'ALS',
    makeModel: 'Force Traveller ICU',
    site: 'GHCL Plant, Sutrapada',
    driver: 'Bhagirathsinh Rathod',
    crew: 'Shailesh Makwana (Nurse)',
    status: 'Active',
    documents: [
      { id: 'a1-ins', name: 'Insurance', number: 'INS-ALS-2201', expiry: isoInDays(120) },
      { id: 'a1-fit', name: 'Fitness', number: 'FIT-2201', expiry: isoInDays(15) },
      { id: 'a1-puc', name: 'PUC', number: 'PUC-2201', expiry: isoInDays(-4) },
      { id: 'a1-permit', name: 'Permit', number: 'PMT-2201', expiry: isoInDays(210) },
    ],
  },
  {
    id: 'A2',
    vehicleNo: 'GJ-03-CD-4487',
    type: 'BLS',
    makeModel: 'Maruti EECO Ambulance',
    site: 'GHCL Plant, Sutrapada',
    driver: 'Govindbhai Parmar',
    crew: 'Kiran Vaghela (Nurse)',
    status: 'Active',
    documents: [
      { id: 'a2-ins', name: 'Insurance', number: 'INS-BLS-4487', expiry: isoInDays(60) },
      { id: 'a2-fit', name: 'Fitness', number: 'FIT-4487', expiry: isoInDays(95) },
      { id: 'a2-puc', name: 'PUC', number: 'PUC-4487', expiry: isoInDays(40) },
      { id: 'a2-permit', name: 'Permit', number: 'PMT-4487', expiry: isoInDays(180) },
    ],
  },
]

// --- Overtime --------------------------------------------------------------
export const overtime: OvertimeRecord[] = [
  { id: 'OT1', employeeId: '1', name: 'Bhagirathsinh Rathod', date: '2026-07-08', scheduledHours: 8, actualHours: 11, otHours: 3, otRate: 98, amount: 294, status: 'Approved' },
  { id: 'OT2', employeeId: '5', name: 'Rameshbhai Solanki', date: '2026-07-14', scheduledHours: 8, actualHours: 12, otHours: 4, otRate: 98, amount: 392, status: 'Pending' },
  { id: 'OT3', employeeId: '2', name: 'Govindbhai Parmar', date: '2026-07-21', scheduledHours: 8, actualHours: 10, otHours: 2, otRate: 98, amount: 196, status: 'Approved' },
]

// --- TA / DA (August 2026) — Rajkot ₹300 entries, total ₹1,500 -------------
export const tada: TadaRecord[] = [
  { id: 'TD1', employeeId: '2', code: 'EMP002', name: 'Govindbhai Parmar', date: '2026-08-04', vardhi: 'Rajkot', ta: 300, da: 0, amount: 300, status: 'Approved' },
  { id: 'TD2', employeeId: '1', code: 'EMP001', name: 'Bhagirathsinh Rathod', date: '2026-08-09', vardhi: 'Rajkot', ta: 300, da: 0, amount: 300, status: 'Approved' },
  { id: 'TD3', employeeId: '5', code: 'EMP005', name: 'Rameshbhai Solanki', date: '2026-08-16', vardhi: 'Rajkot', ta: 300, da: 0, amount: 300, status: 'Approved' },
  { id: 'TD4', employeeId: '2', code: 'EMP002', name: 'Govindbhai Parmar', date: '2026-08-23', vardhi: 'Rajkot', ta: 300, da: 0, amount: 300, status: 'Pending' },
  { id: 'TD5', employeeId: '1', code: 'EMP001', name: 'Bhagirathsinh Rathod', date: '2026-08-28', vardhi: 'Rajkot', ta: 300, da: 0, amount: 300, status: 'Approved' },
]

// --- Contracts & rates -----------------------------------------------------
export const contractRates: ContractRate[] = [
  { id: 'CR1', client: 'GHCL Limited', workOrder: '4540043901', service: 'Hiring of Ambulance - ICU', type: 'ALS', monthlyRate: 190000 },
  { id: 'CR2', client: 'GHCL Limited', workOrder: '4540043914', service: 'Hiring of Ambulance Non-ICU', type: 'BLS', monthlyRate: 130000 },
  { id: 'CR3', client: 'GHCL Limited', workOrder: '4540043901', service: 'Ambulance Service (DA)', type: 'DA', monthlyRate: null },
]

// --- Invoices (Aug 2026) ---------------------------------------------------
function makeInvoice(
  id: string,
  number: string,
  wo: string,
  type: Invoice['type'],
  desc: string,
  sac: string,
  rate: number,
  status: Invoice['status'],
): Invoice {
  const subtotal = rate
  const cgst = Math.round(subtotal * 0.09)
  const sgst = Math.round(subtotal * 0.09)
  return {
    id,
    number,
    date: '2026-08-31',
    projectMonth: 'Aug 2026',
    customer: 'GHCL Limited',
    workOrder: wo,
    servicePeriodFrom: '2026-08-01',
    servicePeriodTo: '2026-08-31',
    type,
    items: [{ description: desc, sac, qty: 1, rate }],
    subtotal,
    cgst,
    sgst,
    grandTotal: subtotal + cgst + sgst,
    status,
  }
}

export const invoices: Invoice[] = [
  makeInvoice('INV-ALS', 'KEN/GHCL/ALS/26-27/041', '4540043901', 'ALS', 'Hiring of Ambulance - ICU (ALS) for Aug 2026', '996601', 190000, 'Generated'),
  makeInvoice('INV-BLS', 'KEN/GHCL/BLS/26-27/042', '4540043914', 'BLS', 'Hiring of Ambulance Non-ICU (BLS) for Aug 2026', '996601', 130000, 'Generated'),
  makeInvoice('INV-DA', 'KEN/GHCL/DA/26-27/043', '4540043901', 'DA', 'Ambulance Service (DA - Aug 26)', '996601', 1500, 'Draft'),
]

// --- Salary components -----------------------------------------------------
export const salaryComponents: SalaryComponent[] = [
  { id: 'SC1', name: 'Basic', kind: 'Per Day', taxable: true, pf: true, esic: true, pt: true, side: 'Earning' },
  { id: 'SC2', name: 'HRA', kind: 'Percentage', taxable: true, pf: false, esic: true, pt: false, side: 'Earning' },
  { id: 'SC3', name: 'Conveyance', kind: 'Fixed', taxable: false, pf: false, esic: true, pt: false, side: 'Earning' },
  { id: 'SC4', name: 'Special Allowance', kind: 'Formula', taxable: true, pf: false, esic: true, pt: false, side: 'Earning' },
  { id: 'SC5', name: 'Overtime', kind: 'Per Hour', taxable: true, pf: false, esic: true, pt: false, side: 'Earning' },
  { id: 'SC6', name: 'PF (Employee)', kind: 'Percentage', taxable: false, pf: false, esic: false, pt: false, side: 'Deduction' },
  { id: 'SC7', name: 'Professional Tax', kind: 'Fixed', taxable: false, pf: false, esic: false, pt: false, side: 'Deduction' },
  { id: 'SC8', name: 'Advance Recovery', kind: 'Fixed', taxable: false, pf: false, esic: false, pt: false, side: 'Deduction' },
]

// --- Wage rates (versioned) ------------------------------------------------
export const wageRates: WageRate[] = [
  { id: 'WR1', effectiveFrom: '2026-04-01', effectiveTo: undefined, category: 'Unskilled / Semi-skilled', designation: 'Ambulance Driver', basic: 522.5, da: 0, otRate: 98 },
  { id: 'WR2', effectiveFrom: '2025-10-01', effectiveTo: '2026-03-31', category: 'Unskilled / Semi-skilled', designation: 'Ambulance Driver', basic: 498.0, da: 0, otRate: 93 },
  { id: 'WR3', effectiveFrom: '2025-04-01', effectiveTo: '2025-09-30', category: 'Unskilled / Semi-skilled', designation: 'Ambulance Driver', basic: 471.0, da: 0, otRate: 88 },
]

// --- Shifts ----------------------------------------------------------------
export const shifts: Shift[] = [
  { id: 'SH1', name: 'G (General)', start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00' },
  { id: 'SH2', name: 'Night', start: '20:00', end: '08:00' },
  { id: 'SH3', name: '12-hour Day', start: '08:00', end: '20:00' },
]

// --- Reconciliation --------------------------------------------------------
export const reconChecks: ReconCheck[] = [
  { label: 'Attendance ↔ Payroll', ok: true, detail: '203 mandays match payroll working days' },
  { label: 'Payroll ↔ Wage Register', ok: true, detail: 'Gross ₹1,24,094 · Net ₹1,11,124' },
  { label: 'TA/DA ↔ DA Invoice', ok: true, detail: '₹1,500 claimed matches DA invoice' },
  { label: 'Ambulance ↔ Contract', ok: true, detail: '1 ALS + 1 BLS deployed per contract' },
  { label: 'Rate ↔ Work Order', ok: true, detail: 'ALS ₹1,90,000 · BLS ₹1,30,000 match WO' },
  { label: 'Service Period ↔ Invoice', ok: true, detail: '01–31 Aug 2026 on all invoices' },
  { label: 'Employee ↔ PF', ok: false, detail: '1 employee PF contribution below expected' },
  { label: 'Employee ↔ Bank', ok: true, detail: 'All 8 employees have valid bank details' },
]

// --- Exceptions ------------------------------------------------------------
export const exceptions: Exception[] = [
  { id: 'EX1', group: 'Payroll', message: 'PF contribution mismatch vs 12% of basic', severity: 'medium', entity: 'EMP006 · Kiran Vaghela' },
  { id: 'EX2', group: 'Attendance', message: '3 attendance records pending approval', severity: 'low', entity: 'Jul 2026 register' },
  { id: 'EX3', group: 'Payroll', message: 'Overtime claimed without supervisor approval', severity: 'medium', entity: 'EMP005 · Rameshbhai Solanki' },
  { id: 'EX4', group: 'Billing', message: 'DA invoice not yet generated (still Draft)', severity: 'high', entity: 'KEN/GHCL/DA/26-27/043' },
  { id: 'EX5', group: 'Billing', message: 'TA claimed but pending approval', severity: 'low', entity: 'EMP002 · 23 Aug 2026' },
]

// --- Audit log -------------------------------------------------------------
export const auditLog: AuditEntry[] = [
  { id: 'AU1', who: 'HR (Rajesh)', what: "Changed Mahesh's working days", when: '2026-08-05 11:20', oldValue: '25', newValue: '26', reason: 'Attendance correction' },
  { id: 'AU2', who: 'Payroll (Nita)', what: 'Validated payroll run PR-2026-07', when: '2026-08-06 16:02', oldValue: 'Draft', newValue: 'Validated', reason: 'Monthly payroll processing' },
  { id: 'AU3', who: 'Accounts (Amit)', what: 'Generated ALS invoice', when: '2026-08-31 18:45', oldValue: '—', newValue: 'KEN/GHCL/ALS/26-27/041', reason: 'Month-end billing' },
]

// --- Month close -----------------------------------------------------------
export const monthClose: MonthCloseItem[] = [
  { label: 'Employee Master', done: true },
  { label: 'Attendance', done: true },
  { label: 'Overtime', done: false },
  { label: 'TA / DA', done: false },
  { label: 'Payroll', done: true },
  { label: 'Wage Register', done: true },
  { label: 'Payslips', done: true },
  { label: 'Bank Payment', done: false },
  { label: 'Compliance', done: true },
  { label: 'GHCL Billing', done: false },
  { label: 'Reconciliation', done: false },
]
