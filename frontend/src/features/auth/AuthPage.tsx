import { useState, type FormEvent } from 'react'
import { CircleDollarSign, LoaderCircle, Sparkles } from 'lucide-react'
import { authApi } from '../../services/api'
import type { Auth } from '../../types'
import { errorMessage } from '../../utils/formatters'

type AuthMode = 'login' | 'register'

export function AuthPage({ onAuth }: { onAuth: (auth: Auth) => void }) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('demo@finora.com')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      onAuth(mode === 'login' ? await authApi.login(email, password) : await authApi.register(email, password))
    } catch (cause) {
      setError(errorMessage(cause, 'Não foi possível continuar.'))
    } finally {
      setBusy(false)
    }
  }

  const toggleMode = () => {
    setMode(current => current === 'login' ? 'register' : 'login')
    setError('')
  }

  return <div className="auth-page">
    <div className="auth-art">
      <div className="brand"><span><CircleDollarSign /></span>finora.</div>
      <div><Sparkles /><h1>Seu dinheiro, com mais clareza.</h1><p>Organize despesas, planeje objetivos e tome decisões melhores em um só lugar.</p></div>
    </div>
    <form className="auth-card" onSubmit={submit}>
      <small>BEM-VINDO À FINORA</small>
      <h2>{mode === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}</h2>
      <p>{mode === 'register' ? 'Cadastre-se apenas com seu e-mail e uma senha.' : 'Use seus dados para continuar.'}</p>
      <label>E-mail<input type="email" value={email} onChange={event => setEmail(event.target.value)} required /></label>
      <label>Senha<input type="password" value={password} onChange={event => setPassword(event.target.value)} required /></label>
      {error && <div className="auth-error">{error}</div>}
      <button className="primary" disabled={busy}>{busy ? <LoaderCircle className="spin" /> : mode === 'login' ? 'Entrar' : 'Cadastrar e entrar'}</button>
      <button type="button" className="auth-switch" onClick={toggleMode}>{mode === 'register' ? 'Já tenho uma conta' : 'Criar conta'}</button>
      {mode === 'login' && <em>Conta de teste: demo@finora.com / demo123</em>}
    </form>
  </div>
}
