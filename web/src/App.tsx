import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { AppLayout } from '@/layouts/AppLayout'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { EmployeesPage } from '@/features/employees/EmployeesPage'
import { EmployeeDetailPage } from '@/features/employees/EmployeeDetailPage'
import { AmbulancesPage } from '@/features/ambulances/AmbulancesPage'
import { AmbulanceDetailPage } from '@/features/ambulances/AmbulanceDetailPage'
import { RosterPage } from '@/features/roster/RosterPage'
import { AttendancePage } from '@/features/attendance/AttendancePage'
import { OvertimePage } from '@/features/overtime/OvertimePage'
import { TadaPage } from '@/features/tada/TadaPage'
import { PayrollPage } from '@/features/payroll/PayrollPage'
import { PayrollRunPage } from '@/features/payroll/PayrollRunPage'
import { PayslipPage } from '@/features/payroll/PayslipPage'
import { WagesPage } from '@/features/wages/WagesPage'
import { ContractsPage } from '@/features/contracts/ContractsPage'
import { InvoicesPage } from '@/features/invoices/InvoicesPage'
import { InvoiceDetailPage } from '@/features/invoices/InvoiceDetailPage'
import { ReconciliationPage } from '@/features/reconciliation/ReconciliationPage'
import { ExceptionsPage } from '@/features/exceptions/ExceptionsPage'
import { ReportsPage } from '@/features/reports/ReportsPage'
import { MonthClosePage } from '@/features/month-close/MonthClosePage'
import { SettingsPage } from '@/features/settings/SettingsPage'

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/employees/:id" element={<EmployeeDetailPage />} />
            <Route path="/ambulances" element={<AmbulancesPage />} />
            <Route path="/ambulances/:id" element={<AmbulanceDetailPage />} />
            <Route path="/roster" element={<RosterPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/overtime" element={<OvertimePage />} />
            <Route path="/tada" element={<TadaPage />} />
            <Route path="/payroll" element={<PayrollPage />} />
            <Route path="/payroll/:runId" element={<PayrollRunPage />} />
            <Route path="/payroll/:runId/payslip/:empId" element={<PayslipPage />} />
            <Route path="/wages" element={<WagesPage />} />
            <Route path="/contracts" element={<ContractsPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
            <Route path="/reconciliation" element={<ReconciliationPage />} />
            <Route path="/exceptions" element={<ExceptionsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/month-close" element={<MonthClosePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  )
}
