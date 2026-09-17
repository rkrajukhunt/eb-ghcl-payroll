import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Role } from '@/types'

interface AppState {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  role: Role
  setRole: (r: Role) => void
  period: string
  setPeriod: (p: string) => void
}

const AppContext = createContext<AppState | null>(null)

const readTheme = (): 'light' | 'dark' => {
  try {
    const v = localStorage.getItem('theme')
    if (v === 'light' || v === 'dark') return v
  } catch {
    /* ignore */
  }
  return 'light'
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(readTheme)
  const [role, setRole] = useState<Role>('Super Admin')
  const [period, setPeriod] = useState('Jul 2026')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
        role,
        setRole,
        period,
        setPeriod,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
