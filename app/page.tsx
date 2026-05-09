'use client'

import { useContext, useEffect } from 'react'
import { AppContext } from '@/context/AppContext'
import TokenForm from '@/components/TokenForm'
import OrderForm from '@/components/OrderForm'

export default function Home() {
  const { token } = useContext(AppContext)!

  useEffect(() => {
    const savedToken = localStorage.getItem('tablecrm_token')
    if (savedToken && !token) {
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
    <main className="min-h-screen bg-[radial-gradient(1200px_400px_at_50%_-50%,rgba(249,115,22,0.26),transparent),radial-gradient(1100px_300px_at_90%_120%,rgba(20,184,166,0.2),transparent)]">
      <div className="mx-auto w-full max-w-md px-3 pb-44 pt-4">
        <OrderForm />
      </div>
    </main>
  )
}

