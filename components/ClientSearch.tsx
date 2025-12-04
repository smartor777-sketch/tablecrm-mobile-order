'use client'

import { useState, useContext, useEffect, useRef } from 'react'
import { AppContext } from '@/context/AppContext'
import { searchContragentsByPhone } from '@/services/api'

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
    
    // Сбрасываем выбранного клиента при изменении телефона
    if (contragent) {
      setContragent(null)
    }

    // Очищаем предыдущий таймер
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Если поле пустое, очищаем результаты
    if (!value.trim()) {
      setResults([])
      setError('')
      return
    }

    // Устанавливаем новый таймер для debounce (500ms)
    debounceTimer.current = setTimeout(() => {
      if (value.trim().length >= 3) {
        performSearch(value)
      } else {
        setResults([])
        setError('')
      }
    }, 500)
  }

  // Очистка таймера при размонтировании
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
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Клиент
      </label>
      
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="tel"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="Введите телефон (минимум 3 символа)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading || !phone.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '...' : 'Найти'}
        </button>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      {results.length > 0 && (
        <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto shadow-sm">
          <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b border-gray-200">
            Найдено: {results.length}
          </div>
          {results.map((client) => (
            <button
              key={client.id}
              type="button"
              onClick={() => handleSelectClient(client)}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="font-medium text-gray-900">{client.name}</div>
              {client.phone && (
                <div className="text-sm text-gray-500">{client.phone}</div>
              )}
            </button>
          ))}
        </div>
      )}

      {phone.trim().length > 0 && phone.trim().length < 3 && !loading && (
        <div className="text-gray-500 text-sm">
          Введите минимум 3 символа для поиска
        </div>
      )}

      {contragent && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="font-medium text-blue-900">Выбран: {contragent.name}</div>
          {contragent.phone && (
            <div className="text-sm text-blue-700">{contragent.phone}</div>
          )}
          <button
            type="button"
            onClick={() => {
              setContragent(null)
              setPhone('')
              setResults([])
            }}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Изменить
          </button>
        </div>
      )}
    </div>
  )
}

