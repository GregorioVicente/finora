import { ArrowDownRight, ArrowUpRight, Trash2 } from 'lucide-react'
import { CATEGORIES } from '../../constants/finance'
import type { Transaction } from '../../types'
import { formatMoney } from '../../utils/formatters'

type Props = {
  transactions: Transaction[]
  onCategoryChange: (transaction: Transaction, category: string) => void
  onRemove: (id: number) => void
}

export function TransactionTable({ transactions, onCategoryChange, onRemove }: Props) {
  return <div className="table-wrap">
    <table><thead><tr><th>Descrição</th><th>Data</th><th>Categoria</th><th>Valor</th><th /></tr></thead>
      <tbody>{transactions.map(transaction => <tr key={transaction.id}>
        <td><span className={`tx-icon ${transaction.amount > 0 ? 'positive' : ''}`}>{transaction.amount > 0 ? <ArrowUpRight /> : <ArrowDownRight />}</span><b>{transaction.description}</b></td>
        <td>{new Date(`${transaction.date}T12:00:00`).toLocaleDateString('pt-BR')}</td>
        <td><select value={transaction.category} onChange={event => onCategoryChange(transaction, event.target.value)}>{[...CATEGORIES, 'Renda'].map(category => <option key={category}>{category}</option>)}</select></td>
        <td className={`amount ${transaction.amount > 0 ? 'positive' : ''}`}>{formatMoney(transaction.amount)}</td>
        <td><button className="delete" onClick={() => onRemove(transaction.id)}><Trash2 /></button></td>
      </tr>)}</tbody>
    </table>
    {!transactions.length && <div className="empty">Nenhuma transação neste período.</div>}
  </div>
}
