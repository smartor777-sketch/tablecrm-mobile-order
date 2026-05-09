'use client'

import { useContext, useEffect } from 'react'
import { AppContext } from '@/context/AppContext'
import TokenForm from '@/components/TokenForm'
import OrderForm from '@/components/OrderForm'
import { CheckCircle } from 'lucide-react'

export default function Home() {
  const { token } = useContext(AppContext)!

  useEffect(() => {
    const savedToken = localStorage.getItem('tablecrm_token')
    if (savedToken && !token) {
    }
  }, [token])

  const gradientBg = "min-h-dvh bg-[radial-gradient(1200px_400px_at_50%_-50%,rgba(249,115,22,0.26),transparent),radial-gradient(1100px_300px_at_90%_120%,rgba(20,184,166,0.2),transparent)]"

  if (!token) {
    return (
      <div className={gradientBg}>
        <div className="mx-auto w-full max-w-md px-3 pb-44 pt-4">
          <TokenForm />
        </div>
      </div>
    )
  }

  return (
    <div className={gradientBg}>
      <div className="mx-auto w-full max-w-md px-3 pb-44 pt-4">
        <div className="mb-4 rounded-3xl border border-border/70 bg-card/95 p-4 shadow-sm backdrop-blur">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">tablecrm.com</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Мобильный заказ</h1>
          <p className="mt-1 text-sm text-muted-foreground">WebApp для создания продажи и проведения в один клик.</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap bg-green-100 text-green-700">
              <CheckCircle className="size-3" />
              Касса подключена
            </span>
          </div>
        </div>
        <OrderForm />
      </div>
    </div>
  )
}