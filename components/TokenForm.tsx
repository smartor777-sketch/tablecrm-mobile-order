'use client'

import { useState, useContext } from 'react'
import { AppContext } from '@/context/AppContext'
import { PlugZap, CheckCircle, XCircle } from 'lucide-react'

export default function TokenForm() {
  const [tokenInput, setTokenInput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setToken } = useContext(AppContext)!

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!tokenInput.trim()) {
      setError('Пожалуйста, введите токен')
      setLoading(false)
      return
    }

    try {
      setToken(tokenInput.trim())
    } catch (err) {
      setError('Ошибка при сохранении токена')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-4 rounded-3xl border border-border/70 bg-card/95 p-4 shadow-sm backdrop-blur">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">tablecrm.com</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Мобильный заказ</h1>
        <p className="mt-1 text-sm text-muted-foreground">WebApp для создания продажи и проведения в один клик.</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap bg-secondary text-secondary-foreground">
            <XCircle className="size-3" />
            Касса не подключена
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mb-4 rounded-xl border border-border/60 bg-card/95 p-4 shadow-sm">
        <div className="font-medium text-base mb-3 flex items-center gap-2">
          <PlugZap className="size-4" />
          1. Подключение кассы
        </div>
        <p className="text-sm text-muted-foreground mb-4">Введите токен и загрузите справочники</p>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm leading-none font-medium select-none">
            Token
          </label>
          <input
            id="token"
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Введите token кассы"
            className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive md:text-sm"
            disabled={loading}
          />
          
          {error && (
            <div className="text-destructive text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground h-8 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Проверка...' : 'Подключить'}
          </button>
        </div>
      </form>
    </div>
  )
}