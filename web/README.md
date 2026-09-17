# GHCL Payroll — Web (Phase 0 UI MVP)

React + TypeScript + Vite + Tailwind + shadcn-style UI. Clickable MVP with
**mock data** covering the full GHCL ambulance workflow. No backend yet — see
[`../docs/UI-PLAN.md`](../docs/UI-PLAN.md) for the plan and
[`../docs/PLAN.md`](../docs/PLAN.md) for overall scope.

## Getting started

```bash
cd web
npm install
npm run dev        # start dev server (http://localhost:5173)
npm run build      # typecheck + production build
npm run preview    # preview the production build
```

## What's included

All screens render with reconciling mock data (203 mandays, ₹1,24,094 gross,
₹1,500 TA/DA, ALS/BLS/DA invoices):

- **Dashboard** — KPIs, revenue-vs-cost chart, alerts
- **Employees** — list + profile (profile / statutory / bank / documents / assignment / salary)
- **Ambulances** — list + profile with document expiry tracking
- **Roster** — weekly ambulance/crew grid
- **Attendance** — monthly P / A / W-O matrix
- **Overtime** & **TA/DA** — tables with approval workflow
- **Payroll** — runs, run detail, printable **payslip**
- **Wage Register** — register + versioned wage-rate history
- **Contracts** — work orders & service rates
- **Invoices** — ALS / BLS / DA list + printable **GST tax invoice**
- **Reconciliation** — cross-check grid
- **Exceptions & Audit** — error detection + audit trail
- **Reports** — grouped report index
- **Month Close** — checklist + lock flow
- **Settings** — salary components, wage rates, shifts, role matrix

Extras: light/dark theme, role switcher (nav adapts per role), global period
picker, CSV export, print-to-PDF for payslips and invoices, responsive layout.

## Structure

- `src/components/ui` — shadcn-style primitives (button, card, table, tabs, dialog…)
- `src/components/common` — DataTable, StatCard, StatusPill, ExpiryBadge, MoneyText, ApprovalTimeline
- `src/components/layout` — Sidebar, Topbar, nav config
- `src/features/*` — one folder per module
- `src/mock` — seed data (swap for a real API adapter in Phase 1)
- `src/types` — domain types (mirror the target DB schema)
