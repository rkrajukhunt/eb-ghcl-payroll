import { Bell, Menu, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/context/AppContext'
import { COMPANY } from '@/mock'
import type { Role } from '@/types'

const ROLES: Role[] = ['Super Admin', 'HR', 'Operations', 'Payroll', 'Accounts', 'GHCL Client']
const PERIODS = ['Jul 2026', 'Aug 2026', 'Jun 2026']

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggleTheme, role, setRole, period, setPeriod } = useApp()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="size-5" />
      </Button>

      <div className="hidden md:flex md:items-center md:gap-2">
        <span className="text-sm font-medium">{COMPANY.name}</span>
        <Badge variant="outline">{COMPANY.client}</Badge>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden sm:block">
          <Select value={period} onChange={(e) => setPeriod(e.target.value)} className="h-8 w-32 text-xs">
            {PERIODS.map((p) => (
              <option key={p} value={p}>
                Period: {p}
              </option>
            ))}
          </Select>
        </div>

        <Select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="h-8 w-36 text-xs"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>

        <Button variant="ghost" size="icon" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </Button>

        <Button variant="ghost" size="icon" className="relative" title="Alerts">
          <Bell className="size-5" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
        </Button>
      </div>
    </header>
  )
}
