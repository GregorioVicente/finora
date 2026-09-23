import { useMemo, useState, type FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { CATEGORIES } from '../../constants/finance'
import { financeApi } from '../../services/api'
import type { Budget } from '../../types'
import { errorMessage, formatMoney } from '../../utils/formatters'

type Props = { budgets: Budget[]; month: string; reload: () => Promise<void>; showToast: (message: string) => void }

export function PlanningPage({ budgets, month, reload, showToast }: Props) {
  const [category, setCategory] = useState<string>(CATEGORIES[0])
  const [limit, setLimit] = useState('')
  const totals = useMemo(() => budgets.reduce((result, budget) => ({ limit: result.limit + budget.limitAmount, spent: result.spent + budget.spent }), { limit: 0, spent: 0 }), [budgets])

  const save = async (event: FormEvent) => {
    event.preventDefault()
    try { await financeApi.saveBudget(month, category, Number(limit)); setLimit(''); await reload(); showToast('Orçamento salvo.') }
    catch (error) { showToast(errorMessage(error)) }
  }

  const remove = async (id: number) => {
    try { await financeApi.deleteBudget(id); await reload(); showToast('Orçamento excluído.') }
    catch (error) { showToast(errorMessage(error)) }
  }

  return <>
    <div className="planning-summary"><div><small>Orçamento total</small><b>{formatMoney(totals.limit)}</b></div><div><small>Total utilizado</small><b>{formatMoney(totals.spent)}</b></div><div><small>Disponível</small><b>{formatMoney(totals.limit - totals.spent)}</b></div></div>
    <div className="planning-grid">
      <div className="panel"><div className="panel-head"><div><h2>Limites por categoria</h2><p>Acompanhe seu consumo mensal</p></div></div><div className="budget-list">{budgets.map(budget => { const percentage = Math.min(100, Math.round(budget.spent / budget.limitAmount * 100)); return <div className="budget" key={budget.id}><div><b>{budget.category}</b><span>{formatMoney(budget.spent)} de {formatMoney(budget.limitAmount)}</span><button className="delete" onClick={() => void remove(budget.id)}><Trash2 /></button></div><div className="progress"><i style={{ width: `${percentage}%`, background: percentage > 90 ? '#ff6b6b' : '#7357ff' }} /></div><small>{percentage}% utilizado</small></div> })}{!budgets.length && <div className="empty">Crie seu primeiro limite ao lado.</div>}</div></div>
      <form className="panel budget-form" onSubmit={save}><div className="form-icon"><Plus /></div><h2>Novo orçamento</h2><p>Defina quanto pretende gastar em uma categoria.</p><label>Categoria<select value={category} onChange={event => setCategory(event.target.value)}>{CATEGORIES.map(item => <option key={item}>{item}</option>)}</select></label><label>Limite mensal (R$)<input type="number" min="1" step="0.01" required value={limit} onChange={event => setLimit(event.target.value)} placeholder="Ex.: 800,00" /></label><button className="primary">Salvar planejamento</button></form>
    </div>
  </>
}
