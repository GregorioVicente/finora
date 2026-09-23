import type { Auth, Budget, Dashboard, Transaction } from './types'

export const SESSION_EXPIRED_EVENT = 'finora:session-expired'

const parse = async <T,>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro inesperado' }))
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('finora_token')
      localStorage.removeItem('finora_auth')
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
    }
    throw new Error(error.message || `Erro HTTP ${response.status}`)
  }
  return response.status === 204 ? (undefined as T) : response.json()
}

const request = async <T,>(path: string, init: RequestInit = {}, authenticated = true): Promise<T> => {
  const headers = new Headers(init.headers)
  if (authenticated) {
    const token = localStorage.getItem('finora_token')
    if (!token) {
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
      throw new Error('Sua sessão expirou. Entre novamente.')
    }
    headers.set('Authorization', `Bearer ${token}`)
  }
  return parse<T>(await fetch(path, { ...init, headers }))
}

const jsonBody = (body: unknown): RequestInit => ({ headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

export const login = (email: string, password: string) => request<Auth>('/api/auth/login', { method: 'POST', ...jsonBody({ email, password }) }, false)
export const register = (email: string, password: string) => request<Auth>('/api/auth/register', { method: 'POST', ...jsonBody({ email, password }) }, false)
export const getDashboard = (month: string) => request<Dashboard>(`/api/dashboard?month=${month}`)
export const getTransactions = (month: string) => request<Transaction[]>(`/api/transactions?month=${month}`)
export const importCsv = (file: File) => { const body = new FormData(); body.append('file', file); return request<{ imported: number; message: string }>('/api/transactions/import', { method: 'POST', body }) }
export const updateCategory = (id: number, category: string) => request<Transaction>(`/api/transactions/${id}/category`, { method: 'PATCH', ...jsonBody({ category }) })
export const deleteTransaction = (id: number) => request<void>(`/api/transactions/${id}`, { method: 'DELETE' })
export const createTransaction = (data: { date: string; description: string; amount: number; category: string }) => request<Transaction>('/api/transactions', { method: 'POST', ...jsonBody(data) })
export const getBudgets = (month: string) => request<Budget[]>(`/api/budgets?month=${month}`)
export const saveBudget = (month: string, category: string, limitAmount: number) => request<Budget>('/api/budgets', { method: 'POST', ...jsonBody({ month, category, limitAmount }) })
export const deleteBudget = (id: number) => request<void>(`/api/budgets/${id}`, { method: 'DELETE' })
