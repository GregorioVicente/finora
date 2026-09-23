export const CATEGORIES = ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Lazer', 'Compras', 'Outros'] as const

export const CHART_COLORS = ['#7357ff', '#24c78e', '#ffb648', '#ff6b6b', '#51a7ff', '#bd79ff', '#7a8499'] as const

export type Page = 'dashboard' | 'transactions' | 'planning'

export const PAGE_CONTENT: Record<Page, { title: string; description: string }> = {
  dashboard: { title: 'Visão geral', description: 'Aqui está seu resumo financeiro.' },
  transactions: { title: 'Transações', description: 'Revise e organize todas as suas movimentações.' },
  planning: { title: 'Planejamento', description: 'Defina limites e acompanhe o uso do seu orçamento.' },
}
