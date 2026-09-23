import { useRef } from 'react'
import { Bell, ChevronDown, Menu, Upload } from 'lucide-react'
import { PAGE_CONTENT, type Page } from '../../constants/finance'

type Props = { firstName: string; page: Page; month: string; onMonthChange: (month: string) => void; onMenuOpen: () => void; onUpload: (file?: File) => void }

export function PageHeader({ firstName, page, month, onMonthChange, onMenuOpen, onUpload }: Props) {
  const fileInput = useRef<HTMLInputElement>(null)
  const content = PAGE_CONTENT[page]
  const description = page === 'dashboard' ? `Olá, ${firstName}! ${content.description}` : content.description

  return <header>
    <button className="hamb" onClick={onMenuOpen}><Menu /></button>
    <div><h1>{content.title}</h1><p>{description}</p></div>
    <div className="actions"><button className="icon"><Bell /></button><label className="month"><input type="month" value={month} onChange={event => onMonthChange(event.target.value)} /><ChevronDown /></label>{page !== 'planning' && <button className="primary" onClick={() => fileInput.current?.click()}><Upload />Importar extrato</button>}<input ref={fileInput} hidden type="file" accept=".csv" onChange={event => onUpload(event.target.files?.[0])} /></div>
  </header>
}
