# EB-GHCL Payroll

Contract Workforce, Payroll, Ambulance Operations, Client Billing & Contract
Profitability platform for the GHCL / KENKO ambulance contract.

This is **not** a generic payroll app — it covers the full operation:
attendance → payroll → wage register → payslips → TA/DA → GHCL ALS/BLS/DA
invoices → reconciliation → contract profitability.

## Documentation

- **[docs/PLAN.md](docs/PLAN.md)** — full scope, architecture, data model,
  phased delivery plan, and backend options. Start here.
- **[docs/UI-PLAN.md](docs/UI-PLAN.md)** — in-depth Phase 0 UI MVP plan:
  tech stack, project structure, design system, routing, and a
  screen-by-screen spec.

## Roadmap (see PLAN.md for detail)

- **Phase 0 — UI MVP:** React + shadcn/ui, mock data, all screens clickable (current focus)
- **Phase 1 — Core payroll:** employees, attendance, OT, TA/DA, payroll, payslips, wage register
- **Phase 2 — GHCL billing:** ALS/BLS/DA invoices, GST, invoice reconciliation, client portal
- **Phase 3 — Ambulance operations:** vehicles, roster, trips, KM, fuel, maintenance
- **Phase 4 — Intelligence:** OCR import, exception detection, reconciliation, profitability
