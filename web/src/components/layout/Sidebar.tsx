import { NavLink } from 'react-router-dom'
import { Ambulance } from 'lucide-react'
import { visibleGroups } from './nav'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { role } = useApp()
  const groups = visibleGroups(role)

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2 border-b px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Ambulance className="size-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">GHCL Payroll</p>
          <p className="text-[10px] text-muted-foreground">Workforce & Billing</p>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )
                    }
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
}
