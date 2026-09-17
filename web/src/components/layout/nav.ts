import {
  LayoutDashboard,
  Users,
  Ambulance,
  CalendarDays,
  ClipboardCheck,
  Clock,
  Route,
  Wallet,
  Receipt,
  FileText,
  FileSpreadsheet,
  GitCompareArrows,
  AlertTriangle,
  BarChart3,
  Lock,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import type { Role } from '@/types'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  roles?: Role[] // if set, only these roles see it
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', to: '/', icon: LayoutDashboard }],
  },
  {
    title: 'Workforce',
    items: [{ label: 'Employees', to: '/employees', icon: Users, roles: ['Super Admin', 'HR', 'Payroll'] }],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Ambulances', to: '/ambulances', icon: Ambulance, roles: ['Super Admin', 'Operations', 'GHCL Client'] },
      { label: 'Roster', to: '/roster', icon: Route, roles: ['Super Admin', 'Operations'] },
      { label: 'Attendance', to: '/attendance', icon: CalendarDays },
    ],
  },
  {
    title: 'Payroll',
    items: [
      { label: 'Overtime', to: '/overtime', icon: Clock, roles: ['Super Admin', 'Payroll', 'Operations'] },
      { label: 'TA / DA', to: '/tada', icon: ClipboardCheck, roles: ['Super Admin', 'Payroll', 'Accounts'] },
      { label: 'Payroll Runs', to: '/payroll', icon: Wallet, roles: ['Super Admin', 'Payroll'] },
      { label: 'Wage Register', to: '/wages', icon: FileText, roles: ['Super Admin', 'Payroll', 'HR'] },
    ],
  },
  {
    title: 'Billing',
    items: [
      { label: 'Contracts', to: '/contracts', icon: FileSpreadsheet, roles: ['Super Admin', 'Accounts'] },
      { label: 'Invoices', to: '/invoices', icon: Receipt, roles: ['Super Admin', 'Accounts', 'GHCL Client'] },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { label: 'Reconciliation', to: '/reconciliation', icon: GitCompareArrows, roles: ['Super Admin', 'Accounts', 'Payroll'] },
      { label: 'Exceptions', to: '/exceptions', icon: AlertTriangle, roles: ['Super Admin', 'Payroll', 'Accounts'] },
      { label: 'Reports', to: '/reports', icon: BarChart3 },
      { label: 'Month Close', to: '/month-close', icon: Lock, roles: ['Super Admin', 'Payroll', 'Accounts'] },
    ],
  },
  {
    title: 'Settings',
    items: [{ label: 'Settings', to: '/settings', icon: Settings, roles: ['Super Admin'] }],
  },
]

export function visibleGroups(role: Role): NavGroup[] {
  return navGroups
    .map((g) => ({
      ...g,
      items: g.items.filter((it) => !it.roles || it.roles.includes(role)),
    }))
    .filter((g) => g.items.length > 0)
}
