export const formatMoney = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export const currentMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export const today = () => new Date().toISOString().slice(0, 10)

export const errorMessage = (error: unknown, fallback = 'Não foi possível concluir a operação.') =>
  error instanceof Error ? error.message : fallback
