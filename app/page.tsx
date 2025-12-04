'use client'

import { useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppContext } from '@/context/AppContext'
import TokenForm from '@/components/TokenForm'
import OrderForm from '@/components/OrderForm'

export default function Home() {
  const { token } = useContext(AppContext)
  const router = useRouter()

  useEffect(() => {
    // Проверяем наличие токена в localStorage при загрузке
    const savedToken = localStorage.getItem('tablecrm_token')
    if (savedToken && !token) {
      // Токен будет восстановлен через Context
    }
  }, [token])

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            TableCRM
          </h1>
          <TokenForm />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <OrderForm />
      </div>
    </main>
  )
}

