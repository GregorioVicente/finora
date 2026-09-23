import { ArrowDownRight, ArrowUpRight, Sparkles, WalletCards } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CHART_COLORS } from '../../constants/finance'
import type { Dashboard } from '../../types'
import { formatMoney } from '../../utils/formatters'
import { MetricCard } from './MetricCard'

export function DashboardPage({ dashboard }: { dashboard: Dashboard }) {
  const categories = Object.entries(dashboard.categories).map(([name, value]) => ({ name, value }))
  const savedPercentage = dashboard.income ? Math.round(dashboard.balance / dashboard.income * 100) : 0

  return <>
    <div className="cards">
      <MetricCard label="Saldo do mês" value={dashboard.balance} icon={<WalletCards />} />
      <MetricCard label="Receitas" value={dashboard.income} good icon={<ArrowUpRight />} />
      <MetricCard label="Despesas" value={dashboard.expenses} icon={<ArrowDownRight />} />
      <div className="metric insight"><span className="metric-icon"><Sparkles /></span><div><small>Insight do mês</small><b>Você economizou {savedPercentage}% da sua renda</b><p>Seu saldo está {dashboard.balance >= 0 ? 'saudável' : 'negativo'}.</p></div></div>
    </div>
    <div className="charts">
      <div className="panel evolution">
        <div className="panel-head"><div><h2>Evolução financeira</h2><p>Receitas e despesas nos últimos 6 meses</p></div></div>
        <div className="chart"><ResponsiveContainer><AreaChart data={dashboard.evolution}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" /><YAxis tickFormatter={value => `${value / 1000}k`} /><Tooltip formatter={value => formatMoney(Number(value))} /><Area dataKey="income" stroke="#24c78e" fill="#24c78e22" /><Area dataKey="expenses" stroke="#7357ff" fill="#7357ff11" /></AreaChart></ResponsiveContainer></div>
      </div>
      <div className="panel categories">
        <div className="panel-head"><div><h2>Gastos por categoria</h2><p>Distribuição das despesas</p></div></div>
        <div className="donut"><ResponsiveContainer><PieChart><Pie data={categories} dataKey="value" innerRadius={60} outerRadius={88}>{categories.map((category, index) => <Cell key={category.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}</Pie><Tooltip formatter={value => formatMoney(Number(value))} /></PieChart></ResponsiveContainer><div><b>{formatMoney(dashboard.expenses)}</b><small>Total</small></div></div>
        <div className="cat-list">{categories.map((category, index) => <span key={category.name}><i style={{ background: CHART_COLORS[index % CHART_COLORS.length] }} />{category.name}<b>{dashboard.expenses ? Math.round(category.value / dashboard.expenses * 100) : 0}%</b></span>)}</div>
      </div>
    </div>
  </>
}
