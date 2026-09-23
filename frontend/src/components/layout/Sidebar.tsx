import { CircleDollarSign, LayoutDashboard, LogOut, PiggyBank, Settings, WalletCards, X } from 'lucide-react'
import type { Page } from '../../constants/finance'
import type { Auth } from '../../types'

type Props = { auth: Auth; page: Page; open: boolean; onNavigate: (page: Page) => void; onClose: () => void; onLogout: () => void }

export function Sidebar({ auth, page, open, onNavigate, onClose, onLogout }: Props) {
  return <aside className={open ? 'open' : ''}>
    <div className="brand"><span><CircleDollarSign /></span>finora.</div>
    <button className="close" onClick={onClose}><X /></button>
    <nav><a className={page === 'dashboard' ? 'active' : ''} onClick={() => onNavigate('dashboard')}><LayoutDashboard />Visão geral</a><a className={page === 'transactions' ? 'active' : ''} onClick={() => onNavigate('transactions')}><WalletCards />Transações</a><a className={page === 'planning' ? 'active' : ''} onClick={() => onNavigate('planning')}><PiggyBank />Planejamento</a></nav>
    <div className="aside-bottom"><a><Settings />Configurações</a><div className="profile"><div>{auth.name.slice(0, 2).toUpperCase()}</div><span><b>{auth.name}</b><small>{auth.email}</small></span><button className="logout" title="Sair" onClick={onLogout}><LogOut /></button></div></div>
  </aside>
}
