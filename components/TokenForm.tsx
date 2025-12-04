'use client'

import { useState, useContext } from 'react'
import { AppContext } from '@/context/AppContext'

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

    // Простая валидация токена (можно добавить проверку через API)
    try {
      setToken(tokenInput.trim())
    } catch (err) {
      setError('Ошибка при сохранении токена')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
          Токен
        </label>
        <input
          id="token"
          type="text"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="Введите токен"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          disabled={loading}
        />
      </div>
      
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Проверка...' : 'Продолжить'}
      </button>
    </form>
  )
}

