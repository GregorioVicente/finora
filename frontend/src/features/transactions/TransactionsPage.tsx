import { useMemo, useState } from 'react'
import { Download, Plus, Search } from 'lucide-react'
import { financeApi } from '../../services/api'
import type { Transaction } from '../../types'
import { errorMessage } from '../../utils/formatters'
import { TransactionModal } from './TransactionModal'
import { TransactionTable } from './TransactionTable'

type Props = { transactions: Transaction[]; reload: () => Promise<void>; showToast: (message: string) => void }

export function TransactionsPage({ transactions, reload, showToast }: Props) {
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const filtered = useMemo(() => transactions.filter(item => item.description.toLowerCase().includes(query.toLowerCase())), [query, transactions])

  const exportCsv = () => {
    const rows = ['data,descricao,valor,categoria', ...filtered.map(item => `${item.date},"${item.description}",${item.amount},${item.category}`)]
    const url = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'transacoes.csv'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const updateCategory = async (transaction: Transaction, category: string) => {
    try { await financeApi.updateCategory(transaction.id, category); await reload() }
    catch (error) { showToast(errorMessage(error)) }
  }

  const remove = async (id: number) => {
    try { await financeApi.deleteTransaction(id); await reload(); showToast('Transação excluída.') }
    catch (error) { showToast(errorMessage(error)) }
  }

  return <>
    <div className="panel transactions page-panel">
      <div className="panel-head"><div><h2>Todas as transações</h2><p>{filtered.length} movimentações encontradas</p></div><div className="table-actions"><label className="search"><Search /><input placeholder="Buscar transação" value={query} onChange={event => setQuery(event.target.value)} /></label><button onClick={exportCsv}><Download />Exportar</button><button className="manual-btn" onClick={() => setModalOpen(true)}><Plus />Novo lançamento</button></div></div>
      <TransactionTable transactions={filtered} onCategoryChange={updateCategory} onRemove={remove} />
    </div>
    {modalOpen && <TransactionModal onClose={() => setModalOpen(false)} onSaved={reload} showToast={showToast} />}
  </>
}
