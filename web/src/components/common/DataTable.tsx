import { useMemo, useState, type ReactNode } from 'react'
import { ArrowUpDown, Download, Search } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { exportCsv } from '@/lib/utils'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  value?: (row: T) => string | number // for sorting/search/export
  sortable?: boolean
  className?: string
}

export function DataTable<T>({
  columns,
  rows,
  searchable = true,
  csvName,
  onRowClick,
  emptyText = 'No records found.',
}: {
  columns: Column<T>[]
  rows: T[]
  searchable?: boolean
  csvName?: string
  onRowClick?: (row: T) => void
  emptyText?: string
}) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const cellValue = (col: Column<T>, row: T): string | number => {
    if (col.value) return col.value(row)
    const v = (row as Record<string, unknown>)[col.key]
    return typeof v === 'number' ? v : String(v ?? '')
  }

  const filtered = useMemo(() => {
    let data = rows
    if (query.trim()) {
      const q = query.toLowerCase()
      data = data.filter((row) =>
        columns.some((c) => String(cellValue(c, row)).toLowerCase().includes(q)),
      )
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey)
      if (col) {
        data = [...data].sort((a, b) => {
          const av = cellValue(col, a)
          const bv = cellValue(col, b)
          const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv))
          return sortDir === 'asc' ? cmp : -cmp
        })
      }
    }
    return data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, query, sortKey, sortDir, columns])

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const handleExport = () => {
    const data = filtered.map((row) => {
      const rec: Record<string, string | number> = {}
      columns.forEach((c) => (rec[c.header] = cellValue(c, row)))
      return rec
    })
    exportCsv(data, csvName ?? 'export.csv')
  }

  return (
    <div className="space-y-3">
      {(searchable || csvName) && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {searchable ? (
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          ) : (
            <span />
          )}
          {csvName && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="size-4" /> Export CSV
            </Button>
          )}
        </div>
      )}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.key} className={c.className}>
                  {c.sortable ? (
                    <button
                      className="inline-flex items-center gap-1 hover:text-foreground"
                      onClick={() => toggleSort(c.key)}
                    >
                      {c.header}
                      <ArrowUpDown className="size-3" />
                    </button>
                  ) : (
                    c.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row, i) => (
                <TableRow
                  key={i}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? 'cursor-pointer' : ''}
                >
                  {columns.map((c) => (
                    <TableCell key={c.key} className={c.className}>
                      {c.render ? c.render(row) : (cellValue(c, row) as ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
