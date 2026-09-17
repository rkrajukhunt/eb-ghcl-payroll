import { formatINR } from '@/lib/utils'

export function MoneyText({
  value,
  decimals,
  className,
}: {
  value: number
  decimals?: boolean
  className?: string
}) {
  return <span className={className}>{formatINR(value, { decimals })}</span>
}
