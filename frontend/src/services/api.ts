import type { Auth, Budget, Dashboard, Transaction } from '../types'

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

const jsonBody = (body: unknown): RequestInit => ({
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

export const authApi = {
  login: (email: string, password: string) => request<Auth>('/api/auth/login', { method: 'POST', ...jsonBody({ email, password }) }, false),
  register: (email: string, password: string) => request<Auth>('/api/auth/register', { method: 'POST', ...jsonBody({ email, password }) }, false),
}

export const financeApi = {
  getDashboard: (month: string) => request<Dashboard>(`/api/dashboard?month=${month}`),
  getTransactions: (month: string) => request<Transaction[]>(`/api/transactions?month=${month}`),
  createTransaction: (data: { date: string; description: string; amount: number; category: string }) => request<Transaction>('/api/transactions', { method: 'POST', ...jsonBody(data) }),
  updateCategory: (id: number, category: string) => request<Transaction>(`/api/transactions/${id}/category`, { method: 'PATCH', ...jsonBody({ category }) }),
  deleteTransaction: (id: number) => request<void>(`/api/transactions/${id}`, { method: 'DELETE' }),
  importCsv: (file: File) => { const body = new FormData(); body.append('file', file); return request<{ imported: number; message: string }>('/api/transactions/import', { method: 'POST', body }) },
  getBudgets: (month: string) => request<Budget[]>(`/api/budgets?month=${month}`),
  saveBudget: (month: string, category: string, limitAmount: number) => request<Budget>('/api/budgets', { method: 'POST', ...jsonBody({ month, category, limitAmount }) }),
  deleteBudget: (id: number) => request<void>(`/api/budgets/${id}`, { method: 'DELETE' }),
}
