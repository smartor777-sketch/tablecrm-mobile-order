'use client'

import { useState, useContext, useEffect, useRef } from 'react'
import { AppContext } from '@/context/AppContext'
import { searchContragentsByPhone } from '@/services/api'
import { Phone, Search } from 'lucide-react'

export default function ClientSearch() {
  const { token, contragent, setContragent } = useContext(AppContext)!
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState<any[]>([])
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  const performSearch = async (searchPhone: string) => {
    if (!searchPhone.trim() || searchPhone.trim().length < 3) {
      setResults([])
      setError('')
      return
    }

    if (!token) {
      setError('Токен не найден')
      return
    }

    setLoading(true)
    setError('')
    setResults([])

    try {
      const response = await searchContragentsByPhone(token, searchPhone)
      if (response.error) {
        setError(response.error)
        setResults([])
      } else if (response.data && response.data.length > 0) {
        setResults(response.data)
        setError('')
      } else {
        setError('')
        setResults([])
      }
    } catch (err) {
      setError('Ошибка при поиске клиентов')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!phone.trim()) {
      setError('Введите номер телефона')
      return
    }
    await performSearch(phone)
  }

  const handlePhoneChange = (value: string) => {
    setPhone(value)
    
    if (contragent) {
      setContragent(null)
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    if (!value.trim()) {
      setResults([])
      setError('')
      return
    }

    debounceTimer.current = setTimeout(() => {
      if (value.trim().length >= 3) {
        performSearch(value)
      } else {
        setResults([])
        setError('')
      }
    }, 500)
  }

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  const handleSelectClient = (client: any) => {
    setContragent(client)
    setResults([])
    setPhone(client.phone || client.name || '')
    setError('')
  }

  return (
    <div className="rounded-xl border border-border/70 bg-card/95 p-4 shadow-sm">
      <div className="font-medium text-base mb-3 flex items-center gap-2">
        <Phone className="size-4" />
        2. Клиент
      </div>
      <p className="text-sm text-muted-foreground mb-4">Поиск клиента по телефону</p>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="tel"
            id="clientPhone"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="+79990000000"
            className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm"
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={loading || !phone.trim()}
            className="shrink-0 inline-flex items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-8 gap-1.5 px-2.5"
          >
            <Search className="size-4" />
          </button>
        </div>

        {error && (
          <div className="text-destructive text-sm">{error}</div>
        )}

        {results.length > 0 && (
          <div className="border border-border rounded-lg max-h-48 overflow-y-auto">
            {results.map((client) => (
              <button
                key={client.id}
                type="button"
                onClick={() => handleSelectClient(client)}
                className="w-full text-left px-4 py-2 hover:bg-accent border-b border-border last:border-b-0"
              >
                <div className="font-medium">{client.name}</div>
                {client.phone && (
                  <div className="text-sm text-muted-foreground">{client.phone}</div>
                )}
              </button>
            ))}
          </div>
        )}

        <label className="flex items-center gap-2 text-sm leading-none font-medium select-none">
          Найденный клиент
        </label>
        <button
          type="button"
          disabled
          className="flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-muted-foreground data-[size=default]:h-8 w-full"
        >
          <span className="flex flex-1 text-left">
            {contragent ? contragent.name : 'Клиент не выбран'}
          </span>
          <Search className="size-4 text-muted-foreground pointer-events-none" />
        </button>
      </div>
    </div>
  )
}