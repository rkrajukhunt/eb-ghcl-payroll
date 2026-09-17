# GHCL / KENKO — Contract Workforce & Ambulance Management System

> **Working title:** EB-GHCL Payroll
> **Real product:** **Contract Workforce, Payroll, Ambulance Operations, Client Billing & Contract Profitability Platform**
> **Status:** Planning — this document is the single source of truth for scope, architecture, and build phases.
> **Last updated:** 2026-09-17

---

## 0. Executive summary

The source documents (attendance register, wage register, salary slips, TA/DA sheet, and separate ALS / BLS / DA GHCL invoices) describe a single business workflow, not a generic payroll app. One operation produces **attendance → payroll → wage register → payslips → TA/DA → GHCL invoices → reconciliation**.

We therefore build this as an **Ambulance Contract Payroll + Workforce + Billing + Compliance system**, and deliver it in phases. **Phase 0 is a UI-first MVP** (React + shadcn/ui, mock data) so the client can see and approve the full experience before backend work begins.

### Key design decisions

| # | Decision | Why |
|---|----------|-----|
| 1 | Track **attendance month, payroll month, invoice month, service period, payment date** as separate fields | Source docs show attendance/wage/salary for **July 2026** but TA/DA and invoices for **August 2026** — periods do not always align |
| 2 | **Never overwrite wage rates** — version them by effective date | Historical payroll must recompute with the rate valid for its period |
| 3 | **No hard-coded salary components** — component master drives payroll | Payslips show many configurable earnings/deductions (Basic, HRA, Conveyance, Medical, Special, Bonus, OT, PF, PT, advances…) |
| 4 | **Month Close** locks a period read-only; changes need Correction → Reason → Approval → Audit Log | Payroll integrity and auditability |
| 5 | **Payroll ↔ Invoice reconciliation** is the differentiating feature | Ties cost (payroll) to revenue (GHCL billing) → contract profitability |
| 6 | Build **UI-first** with mock data, backend later | Client wants to approve UX quickly; keeps backend choice open (Supabase / Firebase / Neon+NestJS) |

---

## 1. Reference data from source documents

Use these as seed/mock values so the MVP feels real.

**Attendance / Wage / Salary — July 2026**
- 8 employees, **203 total working days**
- Statuses used: `P` (present), `A` (absent), `W/O` (weekly off)
- G shift: **09:00–18:00**, rest **13:00–14:00**
- Wage register: total earnings **₹1,24,094**, deductions **₹12,970**, net **₹1,11,124**
- Minimum-wage rate referenced: **₹522.50** (applicable category)
- GHCL named as principal employer

**TA/DA — August 2026**
- Fields: Date, Employee Name, Employee Code, Vardhi (route), TA
- Rajkot TA **₹300** entries; August total **₹1,500**

**GHCL invoices — service period 01/08/2026 – 31/08/2026**
| Service | Type | Work Order | Rate | GST (9% CGST + 9% SGST) | Grand total |
|---------|------|-----------|-----:|---|-----:|
| Hiring of Ambulance – ICU | ALS | 4540043901 | ₹1,90,000 | 18% | **₹2,24,200** |
| Hiring of Ambulance Non-ICU | BLS | 4540043914 | ₹1,30,000 | 18% | **₹1,53,400** |
| Ambulance Service (DA – Aug 26) | DA | 4540043901 | ₹1,500 | 18% | **₹1,770** |

**Contract revenue (Aug 2026):** ALS ₹1,90,000 + BLS ₹1,30,000 + DA ₹1,500 = **₹3,21,500** (pre-GST)

---

## 2. System architecture (modules)

```
                    GHCL AMBULANCE MANAGEMENT
                              │
        ┌─────────────────────┴─────────────────────┐
   WORKFORCE / HR                             CONTRACT / CLIENT
   Employee Master                            GHCL Contract
   Driver / Medical Staff                     Work Orders
   Documents & Expiry                         Service Rates (ALS/BLS/DA)
        └─────────────────────┬─────────────────────┘
                         OPERATIONS
                Ambulance • Roster • Attendance
              ┌───────────────┴───────────────┐
           PAYROLL                         BILLING
   Wage calc • PF/deductions •     GHCL invoices • TA/DA •
   OT • allowances • payslip        ALS/BLS/DA • reconciliation
              └───────────────┬───────────────┘
                         REPORTING & INTELLIGENCE
     Reconciliation • Exception engine • Profitability • Month Close • Audit
```

### Module list

1. **Dashboard** — KPIs, alerts, month status
2. **Company / Client / Contract / Work Order / Rate master**
3. **Employee Master** — profile, statutory, bank, documents, expiry tracking
4. **Ambulance Master** — vehicle, ALS/BLS type, docs, assignments, status
5. **Employee ↔ Shift ↔ Vehicle ↔ Ambulance ↔ Site mapping**
6. **Shift & Roster** — configurable shifts, calendar roster
7. **Attendance** — daily entry, statuses, sources (manual/Excel/biometric/mobile/GPS)
8. **Payroll engine** — salary component master, salary structures, payroll runs
9. **Wage calculation** — version-controlled wage rate master, minimum-wage compliance
10. **Overtime** — capture + approval workflow
11. **TA/DA** — claims, route-based rates, approvals
12. **GHCL Billing** — ALS/BLS/DA invoices, GST, PDF, invoice register
13. **Reconciliation** — attendance↔payroll↔wage↔TA/DA↔contract↔invoice
14. **Exception / Audit engine** — payroll/attendance/billing error detection
15. **Document import (OCR)** — PDF/Excel import with diff-and-approve
16. **Payslip generator** — PDF / print / email / WhatsApp + employee portal
17. **Compliance center** — PF, ESIC, PT, registers, compliance calendar
18. **Approval workflows** — payroll, invoice, OT, TA/DA
19. **Ambulance operations** — trips, utilization, KM, downtime
20. **Maintenance** — service schedule, expenses, cost per vehicle
21. **Profitability dashboard** — revenue vs cost per contract
22. **Reports** — HR / attendance / payroll / wage / TA-DA / contract / ambulance / client
23. **Month Close** — checklist + lock + correction workflow
24. **Audit trail** — who/what/when/old/new/reason
25. **Roles & permissions** — Super Admin, HR, Ops, Payroll, Accounts, GHCL client portal

---

## 3. Data model (target backend schema)

```
companies · clients · contracts · work_orders · contract_rates
employees · employee_documents · employee_bank_accounts · employee_statutory
departments · designations · salary_components · salary_structures · wage_rates
shifts · rosters · attendance · attendance_corrections
overtime · overtime_approvals
ta_da_claims · ta_da_approvals
payroll_runs · payroll_employees · payroll_earnings · payroll_deductions · payroll_contributions · payslips
ambulances · ambulance_documents · ambulance_assignments · ambulance_trips · ambulance_maintenance · ambulance_fuel
invoices · invoice_items · invoice_taxes · invoice_approvals
payments · reconciliations
compliance_tasks · notifications
audit_logs · users · roles · permissions
```

**Modeling rules**
- `wage_rates` and `contract_rates` carry `effective_from` / `effective_to` — never mutate, always insert a new version.
- Payroll always resolves the rate **valid for its payroll period**, not the latest.
- Every write to a closed period is blocked unless routed through `attendance_corrections` / audit-logged correction with approval.
- `audit_logs` records who / what / when / old value / new value / reason for all sensitive changes.

---

## 4. Phased delivery plan

### Phase 0 — UI MVP (current focus)
**Goal:** clickable React app with realistic mock data covering all screens, so the client approves UX. No real backend.

**Stack:** Vite + React + TypeScript, Tailwind CSS, **shadcn/ui**, React Router, TanStack Table, Recharts, Zod + React Hook Form, mock data in `/src/mock`, state via React Query (mock adapters) or simple context.

Screens (all wired with mock data):
- Dashboard (KPI cards, alerts, month status)
- Employee list + profile + documents/expiry
- Ambulance list + profile + assignments
- Roster calendar
- Attendance grid (P / A / W/O, monthly matrix like the register)
- Payroll run + payslip preview/PDF
- Wage register view
- OT list + approval
- TA/DA claims + approval
- Contracts / work orders / rates
- Invoices (ALS / BLS / DA) + GST + printable invoice
- Reconciliation dashboard
- Exceptions / audit view
- Reports index
- Month Close checklist
- Settings: salary components, wage rates, shifts, roles

### Phase 1 — Core payroll (backend)
Company, client, contract, work order, employee master, salary components, wage rate, attendance, OT, TA/DA, payroll, payslip, wage register, attendance register.

### Phase 2 — GHCL billing
ALS/BLS contracts, rate management, invoice generation, GST, DA invoice, invoice reconciliation, client portal.

### Phase 3 — Ambulance operations
Ambulance master, driver/nursing/EMT assignment, shift roster, trips, KM, fuel, maintenance, vehicle documents.

### Phase 4 — Intelligence
PDF/Excel import, OCR, payroll validation, exception detection, automated reconciliation, expiry alerts, contract profitability, management dashboard.

---

## 5. Backend options (decide before Phase 1)

| Option | Best for | Notes |
|--------|----------|-------|
| **Supabase** (recommended for MVP→prod) | Fast start, Postgres, auth, RLS, storage, edge functions | Postgres suits the relational/versioned schema; row-level security maps to roles; built-in file storage for documents/invoices |
| **Firebase** | Rapid prototyping | NoSQL is a poor fit for versioned payroll + reconciliation joins |
| **Neon (Postgres) + NestJS** | Full control, complex payroll rules, custom PDF/OCR pipelines | Most flexible for engines (payroll, OT, reconciliation), more setup |

**Recommendation:** Supabase for the MVP and early production. Move payroll/reconciliation/OCR heavy logic into a **NestJS service on top of the same Postgres** if/when rules outgrow edge functions. This keeps the DB stable while allowing a dedicated engine layer.

---

## 6. Reconciliation & exception engine (the differentiator)

**Reconciliation checks**
```
✓ Attendance ↔ Payroll        ✓ Payroll ↔ Wage Register
✓ TA/DA ↔ DA Invoice          ✓ Ambulance ↔ Contract
✓ Rate ↔ Work Order           ✓ Service Period ↔ Invoice
✓ Employee ↔ PF               ✓ Employee ↔ Bank
```

**Exception detection**
- Payroll: present but salary 0; absent but full salary; PF mismatch; basic below wage rate; unapproved/duplicate OT; duplicate employee; invalid bank.
- Attendance: present + weekly-off conflict; missing attendance; over-hours; shift overlap; employee on two vehicles; driver missing from roster.
- Billing: invoice rate ≠ contract; wrong work order; wrong service period; ALS/BLS mismatch; duplicate invoice; TA claimed but unapproved.

---

## 7. Roles

- **Super Admin** — everything
- **HR** — employees, attendance, documents, payroll
- **Operations Manager** — ambulance, driver, roster, attendance, trips
- **Payroll Manager** — salary, OT, PF, deductions, payslips
- **Accounts** — invoices, TA/DA, payments, reconciliation
- **GHCL client portal** — read-only attendance, service report, deployment, invoices, supporting docs; can approve attendance/OT/TA-DA/service/invoice

---

## 8. Immediate next steps

1. **Commit this plan** to the repo (this document). ✅ deliverable of the current task.
2. Scaffold the **Phase 0 React + shadcn/ui app** with routing and layout shell.
3. Build mock data from the reference values in §1.
4. Implement screens in §4 (Phase 0) module by module, starting with Dashboard, Employee Master, Attendance, Payroll/Payslip, and GHCL Invoices.
5. Review UI with the user, then choose the backend (§5) and begin Phase 1.
