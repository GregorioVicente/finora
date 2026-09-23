import type { ReactNode } from 'react'
import { formatMoney } from '../../utils/formatters'

type Props = { label: string; value: number; good?: boolean; icon: ReactNode }

export function MetricCard({ label, value, good = false, icon }: Props) {
  return <div className="metric">
    <span className={`metric-icon ${good ? 'good' : ''}`}>{icon}</span>
    <div><small>{label}</small><b>{formatMoney(value)}</b><p className={value >= 0 ? 'up' : ''}><span>{value >= 0 ? '↑' : '↓'} atualizado</span></p></div>
  </div>
}
