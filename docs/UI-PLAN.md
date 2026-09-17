# UI Plan — Phase 0 MVP (React + shadcn/ui)

> **Scope:** Clickable, UI-first MVP with realistic **mock data**. No real backend.
> **Goal:** Let the client see and approve the full experience before backend work.
> **Companion doc:** [PLAN.md](PLAN.md) (overall scope, data model, phases).
> **Last updated:** 2026-09-17

---

## 1. Tech stack

| Concern | Choice | Notes |
|---------|--------|-------|
| Build tool | **Vite** | Fast dev server, TS out of the box |
| Language | **TypeScript** | Types shared with future backend |
| UI library | **shadcn/ui** (Radix + Tailwind) | Copy-in components, fully themeable |
| Styling | **Tailwind CSS** | Utility-first, design tokens in `tailwind.config` |
| Routing | **React Router v6** | Nested layouts, protected routes |
| Tables | **TanStack Table v8** | Sorting, filtering, pagination, column visibility |
| Charts | **Recharts** | Dashboard KPIs, profitability, utilization |
| Forms | **React Hook Form + Zod** | Validation schemas reusable server-side |
| Data layer | **TanStack Query** over a **mock adapter** | Swap adapter for real API in Phase 1 with no screen changes |
| Dates | **date-fns** | Period math (attendance/payroll/invoice months) |
| Icons | **lucide-react** | Ships with shadcn/ui |
| PDF preview | **@react-pdf/renderer** or print-to-PDF via CSS | Payslip & invoice printing |
| State (UI) | React context + Query cache | No Redux needed for MVP |
| Tables export | CSV/Excel via **xlsx** (client-side) | Reports & registers |

---

## 2. Project structure

```
eb-ghcl-payroll/
├─ docs/                     # PLAN.md, UI-PLAN.md
└─ web/                      # the React app (Phase 0)
   ├─ index.html
   ├─ package.json
   ├─ tailwind.config.ts
   ├─ components.json        # shadcn/ui config
   └─ src/
      ├─ main.tsx
      ├─ App.tsx             # router + providers
      ├─ routes.tsx          # route table
      ├─ layouts/
      │   ├─ AppLayout.tsx   # sidebar + topbar + content
      │   └─ AuthLayout.tsx  # login / role-select
      ├─ components/
      │   ├─ ui/             # shadcn primitives (button, card, table…)
      │   ├─ layout/         # Sidebar, Topbar, Breadcrumbs, RoleBadge
      │   ├─ common/         # DataTable, PageHeader, StatCard, StatusPill,
      │   │                  # EmptyState, ConfirmDialog, MonthPicker,
      │   │                  # ExpiryBadge, MoneyText, ApprovalTimeline
      │   └─ charts/         # KpiChart, ProfitBar, UtilizationGauge
      ├─ features/           # one folder per module (see §5)
      │   ├─ dashboard/
      │   ├─ employees/
      │   ├─ ambulances/
      │   ├─ roster/
      │   ├─ attendance/
      │   ├─ overtime/
      │   ├─ tada/
      │   ├─ payroll/
      │   ├─ wages/
      │   ├─ contracts/
      │   ├─ invoices/
      │   ├─ reconciliation/
      │   ├─ exceptions/
      │   ├─ reports/
      │   ├─ month-close/
      │   └─ settings/
      ├─ mock/               # seed data from PLAN.md §1 + generators
      │   ├─ employees.ts
      │   ├─ attendance.ts
      │   ├─ payroll.ts
      │   ├─ invoices.ts
      │   ├─ contracts.ts
      │   └─ index.ts        # mock API adapter
      ├─ lib/                # utils: money, dates, gst, csv, cn()
      ├─ types/              # shared TS types (mirror DB schema)
      └─ hooks/              # useMockQuery, useRole, usePeriod
```

---

## 3. Design system

**Layout shell**
- **Left sidebar** (collapsible): grouped nav — Overview, Workforce, Operations, Payroll, Billing, Intelligence, Settings.
- **Topbar**: company/contract selector, **global period picker** (attendance/payroll/invoice month), role switcher (demo), search, notifications bell, user menu.
- **Content**: `PageHeader` (title, breadcrumbs, primary action) + body.

**Tokens**
- Neutral base with a medical/teal accent; semantic colors: `success` (paid/valid), `warning` (pending/expiring), `danger` (expired/error), `info`.
- Support **light + dark** via Tailwind `dark:` and CSS variables.

**Reusable primitives**
- `StatCard` — KPI value + label + trend + optional sparkline.
- `StatusPill` — Present/Absent/W-O, Approved/Pending/Rejected, Paid/Unpaid, Open/Closed.
- `ExpiryBadge` — 🔴 Expired / 🟠 ≤30 days / 🟢 Valid.
- `MoneyText` — ₹ INR formatting with lakh grouping.
- `DataTable` — TanStack wrapper: search, column filters, sort, pagination, column toggle, CSV export, row actions.
- `ApprovalTimeline` — vertical stepper for OT/TA-DA/payroll/invoice approvals.
- `MonthPicker` — month/year selector bound to global period.
- `PeriodBadges` — show attendance vs payroll vs invoice month when they differ.

---

## 4. Navigation & routing

```
/login                         → role select (demo)
/                              → Dashboard

Workforce
/employees                     → list
/employees/:id                 → profile (tabs: Profile, Statutory, Bank, Documents, Assignments, Salary)
/employees/new                 → create form (wizard)

Operations
/ambulances                    → list
/ambulances/:id                → profile (tabs: Details, Documents, Assignments, Trips, Maintenance)
/roster                        → calendar
/attendance                    → monthly matrix grid
/attendance/daily              → daily entry

Payroll
/overtime                      → OT list + approval
/tada                          → TA/DA claims + approval
/payroll                       → payroll runs list
/payroll/:runId                → run detail (employee rows)
/payroll/:runId/payslip/:empId → payslip preview / print
/wages                         → wage register + rate history

Billing
/contracts                     → contracts / work orders / rates
/invoices                      → invoice list (ALS / BLS / DA)
/invoices/new                  → generate invoice
/invoices/:id                  → invoice preview / print

Intelligence
/reconciliation                → reconciliation dashboard
/exceptions                    → exception & audit engine
/reports                       → reports index
/month-close                   → month close checklist

Settings
/settings/salary-components
/settings/wage-rates
/settings/shifts
/settings/roles
/settings/company
```

Client (GHCL) portal is a **role view** of a read-only subset (dashboard, attendance, service report, invoices) — same routes, filtered by role.

---

## 5. Screen-by-screen spec

Each screen lists its key components and the mock data it renders.

### 5.1 Dashboard `/`
- Header: period badges (Attendance Jul 2026 · Invoice Aug 2026).
- **StatCards:** Employees (8), Ambulances (2), Present mandays (203), Payroll gross (₹1,24,094), Net payroll (₹1,11,124), Deductions (₹12,970), TA/DA (₹1,500), Revenue (₹3,21,500).
- **Revenue vs cost** bar (Recharts) → gross margin.
- **Alerts panel:** 🔴 2 documents expired · 🟠 3 attendance pending · 🟠 1 OT pending · 🟠 invoice not generated · ✓ payroll validated.
- **Month status strip:** checklist chips from Month Close.

### 5.2 Employees `/employees`
- `DataTable`: code, name, designation, type (Driver/Nurse/EMT/Helper), site, shift, vehicle, status, doc-expiry badge.
- Filters: type, site, status, expiring docs.
- Row → profile.

**Profile `/employees/:id`** — tabs:
- **Profile:** personal + employment.
- **Statutory:** PF/UAN/ESIC/PAN/PT.
- **Bank:** account/IFSC/bank.
- **Documents:** grid of docs with `ExpiryBadge` + upload placeholder.
- **Assignments:** shift → vehicle → ambulance type → GHCL site.
- **Salary:** assigned salary structure + wage category + rate.

### 5.3 Ambulances `/ambulances`
- `DataTable`: vehicle no, type (ALS/BLS), site, driver, nurse/EMT, status, fitness/PUC/insurance expiry badges.
- Profile tabs: Details, Documents (expiry), Assignments, Trips, Maintenance.

### 5.4 Roster `/roster`
- Calendar (month view): rows = vehicles, cells = shift + assigned crew.
- Click cell → assign dialog (shift, driver, nurse/EMT).

### 5.5 Attendance `/attendance`
- **Monthly matrix** like the register: rows = employees, columns = days 1–31, cells = `P / A / W/O` pills; totals column (working days, present, W/O).
- Footer totals row → 203 mandays.
- Toolbar: month picker, import (mock), export CSV, bulk mark.
- **Daily entry** view: date, employee, vehicle, shift, in/out, status, OT hrs, remarks.

### 5.6 Overtime `/overtime`
- `DataTable`: employee, date, scheduled vs actual hours, OT hrs, rate, amount, approval status.
- `ApprovalTimeline` in row drawer: Driver → Supervisor → Payroll.
- Approve/reject actions (mock). Unapproved OT excluded from payroll.

### 5.7 TA/DA `/tada`
- `DataTable`: date, employee, code, Vardhi/route, TA, DA, amount, approval.
- Seed: Rajkot ₹300 entries, Aug total ₹1,500.
- Route rate config link (Rajkot → ₹300, other → ₹500…).
- Approval workflow: Employee → Supervisor → Accounts.

### 5.8 Payroll `/payroll`
- Runs list: period, status (Draft/Validated/Approved/Closed), gross, net, employee count.
- **Run detail:** employee rows → earnings/deductions/gross/net; validation badges; approval stepper (HR → Payroll → Manager → Accounts).
- **Payslip** `/payroll/:runId/payslip/:empId`: printable layout matching source slip — employee, pay date, mode, dept, PF no, bank, designation, month/working/present/W-O days, earnings, deductions, gross, net. Actions: Print / PDF / Email / WhatsApp (mock).

### 5.9 Wages `/wages`
- **Wage register** table: rate, working days, basic, HRA, special, PF, deductions, net.
- **Rate history** panel: version-controlled wage rates by effective date (₹522.50 current).
- Minimum-wage comparison flag (basic < applicable rate → warning).

### 5.10 Contracts `/contracts`
- Contracts → work orders → service rates.
- Rate table: GHCL · WO 4540043901 · ALS · ₹1,90,000; WO 4540043914 · BLS · ₹1,30,000; DA · variable.

### 5.11 Invoices `/invoices`
- List: ALS / BLS / DA invoices, service period, amount, GST, grand total, status.
- **Generate** wizard: contract → service period → service/type → rate → GST (9%+9%) → preview.
- **Invoice preview:** printable — number, date, project month, customer, work order, service period, ambulance type, SAC, qty, rate, CGST, SGST, subtotal, grand total, amount in words. Seed ALS ₹2,24,200 / BLS ₹1,53,400 / DA ₹1,770.

### 5.12 Reconciliation `/reconciliation`
- Summary dashboard (Aug 2026): employees, mandays, payroll gross/net, TA/DA, ALS/BLS/DA billing.
- **Check grid** with ✓/⚠: Attendance↔Payroll, Payroll↔Wage, TA/DA↔DA invoice, Ambulance↔Contract, Rate↔WO, Service period↔Invoice, Employee↔PF, Employee↔Bank.

### 5.13 Exceptions `/exceptions`
- Grouped list: Payroll / Attendance / Billing errors with severity pills.
- Examples seeded from PLAN.md §6.
- Audit trail table: who / what / when / old / new / reason.

### 5.14 Reports `/reports`
- Index cards grouped: HR, Attendance, Payroll, Wage, TA/DA, Contract, Ambulance, Client.
- Each opens a `DataTable` with export. MVP renders 6–8 representative reports.

### 5.15 Month Close `/month-close`
- Checklist: Employee Master, Attendance, OT, TA/DA, Payroll, Wage Register, Payslips, Bank Payment, Compliance, GHCL Billing, Reconciliation → each ✓/pending.
- **Close Month** button → locks period (visual read-only state).
- Correction flow dialog: reason + approval (mock).

### 5.16 Settings
- **Salary components:** master list with type (fixed/%/per-day/per-hour/formula) + PF/ESIC/PT/taxable flags.
- **Wage rates:** versioned list (effective from/to, category, basic, DA, OT rate).
- **Shifts:** configurable (G 09:00–18:00, break 13:00–14:00, + custom).
- **Roles:** matrix of role × permission.
- **Company:** company/client basics.

---

## 6. Mock data strategy

- All seed values pulled from **PLAN.md §1** so numbers reconcile across screens (203 mandays, ₹1,24,094 gross, ₹1,500 TA/DA, ALS/BLS/DA invoices).
- `mock/index.ts` exposes a **mock API adapter** (`getEmployees`, `getPayrollRun`, `getInvoices`…) returning promises with small latency, consumed via TanStack Query.
- Phase 1 swaps the adapter's implementation for real HTTP calls — **screens and hooks unchanged**.
- Generators fill 8 employees, a July attendance matrix, one payroll run, three invoices, TA/DA rows.

---

## 7. Build order (Phase 0 milestones)

1. **Scaffold** — Vite + TS + Tailwind + shadcn/ui + router; `AppLayout` shell (sidebar, topbar, period picker, role switcher).
2. **Common components** — `DataTable`, `StatCard`, `StatusPill`, `ExpiryBadge`, `MoneyText`, `PageHeader`.
3. **Dashboard** — KPIs + alerts (visual anchor for the demo).
4. **Employees** — list + profile tabs.
5. **Attendance** — monthly matrix.
6. **Payroll + Payslip** — run detail + printable slip.
7. **GHCL Invoices** — list + generate + printable invoice.
8. **Wages, OT, TA/DA** — tables + approvals.
9. **Contracts, Reconciliation, Exceptions** — the differentiators.
10. **Reports, Month Close, Settings** — round out the demo.
11. **Ambulances + Roster** — operations.
12. Polish: dark mode, empty states, responsive, print styles.

---

## 8. Acceptance for Phase 0

- Every route in §4 renders with mock data (no dead links).
- Numbers reconcile across Dashboard ↔ Payroll ↔ Wages ↔ Reconciliation.
- Payslip and invoice are print/PDF ready and match source-document layout.
- Approvals, month-close lock, and role switching are visually functional (mock).
- Responsive down to tablet; light/dark themes.
- Ready to swap the mock adapter for a real backend (§5, PLAN.md) with no screen rewrites.
