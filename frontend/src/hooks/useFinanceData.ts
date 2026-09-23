import { useCallback, useEffect, useState } from 'react'
import { financeApi } from '../services/api'
import type { Budget, Dashboard, Transaction } from '../types'
import { errorMessage } from '../utils/formatters'

const EMPTY_DASHBOARD: Dashboard = { income: 0, expenses: 0, balance: 0, transactionCount: 0, categories: {}, evolution: [] }

export function useFinanceData(month: string, onError: (message: string) => void) {
  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      const [nextDashboard, nextTransactions, nextBudgets] = await Promise.all([
        financeApi.getDashboard(month),
        financeApi.getTransactions(month),
        financeApi.getBudgets(month),
      ])
      setDashboard(nextDashboard)
      setTransactions(nextTransactions)
      setBudgets(nextBudgets)
    } catch (error) {
      onError(errorMessage(error, 'Erro ao carregar os dados.'))
    } finally {
      setLoading(false)
    }
  }, [month, onError])

  const importStatement = useCallback(async (file?: File) => {
    if (!file) return
    setLoading(true)
    try {
      const result = await financeApi.importCsv(file)
      await reload()
      return result.message
    } finally {
      setLoading(false)
    }
  }, [reload])

  useEffect(() => { void reload() }, [reload])

  return { dashboard, transactions, budgets, loading, reload, importStatement }
}
