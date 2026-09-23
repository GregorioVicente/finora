import { useState, type FormEvent } from 'react'
import { ArrowDownRight, ArrowUpRight, LoaderCircle, Plus, X } from 'lucide-react'
import { CATEGORIES } from '../../constants/finance'
import { financeApi } from '../../services/api'
import { errorMessage, today } from '../../utils/formatters'

type Props = { onClose: () => void; onSaved: () => Promise<void>; showToast: (message: string) => void }

export function TransactionModal({ onClose, onSaved, showToast }: Props) {
  const [date, setDate] = useState(today)
  const [description, setDescription] = useState('')
  const [value, setValue] = useState('')
  const [category, setCategory] = useState<string>(CATEGORIES[0])
  const [kind, setKind] = useState<'expense' | 'income'>('expense')
  const [saving, setSaving] = useState(false)

  const save = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    try {
      await financeApi.createTransaction({ date, description, amount: (kind === 'expense' ? -1 : 1) * Number(value), category: kind === 'income' ? 'Renda' : category })
      await onSaved()
      showToast('Transação adicionada com sucesso.')
      onClose()
    } catch (error) {
      showToast(errorMessage(error, 'Erro ao adicionar a transação.'))
    } finally {
      setSaving(false)
    }
  }

  return <div className="modal-backdrop" onMouseDown={onClose}>
    <form className="modal" onSubmit={save} onMouseDown={event => event.stopPropagation()}>
      <div className="modal-head"><div><h2>Novo lançamento</h2><p>Adicione uma movimentação manualmente.</p></div><button type="button" onClick={onClose}><X /></button></div>
      <div className="kind-toggle"><button type="button" className={kind === 'expense' ? 'selected' : ''} onClick={() => setKind('expense')}><ArrowDownRight />Despesa</button><button type="button" className={kind === 'income' ? 'selected income' : ''} onClick={() => setKind('income')}><ArrowUpRight />Receita</button></div>
      <label>Descrição<input value={description} onChange={event => setDescription(event.target.value)} required placeholder="Ex.: Compra no mercado" /></label>
      <div className="form-row"><label>Valor (R$)<input type="number" min="0.01" step="0.01" value={value} onChange={event => setValue(event.target.value)} required placeholder="0,00" /></label><label>Data<input type="date" value={date} onChange={event => setDate(event.target.value)} required /></label></div>
      {kind === 'expense' && <label>Categoria<select value={category} onChange={event => setCategory(event.target.value)}>{CATEGORIES.map(item => <option key={item}>{item}</option>)}</select></label>}
      <button className="primary" disabled={saving}>{saving ? <LoaderCircle className="spin" /> : <Plus />}Adicionar {kind === 'expense' ? 'despesa' : 'receita'}</button>
    </form>
  </div>
}
