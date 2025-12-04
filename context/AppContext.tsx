'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react'

interface Contragent {
  id: number
  name: string
  phone?: string
  [key: string]: any
}

interface Paybox {
  id: number
  name: string
  [key: string]: any
}

interface Organization {
  id: number
  name: string
  [key: string]: any
}

interface Warehouse {
  id: number
  name: string
  [key: string]: any
}

interface PriceType {
  id: number
  name: string
  [key: string]: any
}

interface NomenclatureItem {
  id: number
  name: string
  price?: number
  [key: string]: any
}

interface CartItem {
  nomenclature: NomenclatureItem
  quantity: number
  price: number
}

interface AppContextType {
  token: string | null
  setToken: (token: string | null) => void
  contragent: Contragent | null
  setContragent: (contragent: Contragent | null) => void
  selectedPaybox: Paybox | null
  setSelectedPaybox: (paybox: Paybox | null) => void
  selectedOrganization: Organization | null
  setSelectedOrganization: (org: Organization | null) => void
  selectedWarehouse: Warehouse | null
  setSelectedWarehouse: (warehouse: Warehouse | null) => void
  selectedPriceType: PriceType | null
  setSelectedPriceType: (priceType: PriceType | null) => void
  cart: CartItem[]
  addToCart: (item: NomenclatureItem, quantity: number, price: number) => void
  updateCartItem: (itemId: number, quantity: number) => void
  removeFromCart: (itemId: number) => void
  clearCart: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null)
  const [contragent, setContragent] = useState<Contragent | null>(null)
  const [selectedPaybox, setSelectedPaybox] = useState<Paybox | null>(null)
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null)
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null)
  const [selectedPriceType, setSelectedPriceType] = useState<PriceType | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])

  // Загружаем токен из localStorage при инициализации
  useEffect(() => {
    const savedToken = localStorage.getItem('tablecrm_token')
    if (savedToken) {
      setTokenState(savedToken)
    }
  }, [])

  // Сохраняем токен в localStorage при изменении
  const setToken = (newToken: string | null) => {
    setTokenState(newToken)
    if (newToken) {
      localStorage.setItem('tablecrm_token', newToken)
    } else {
      localStorage.removeItem('tablecrm_token')
    }
  }

  const addToCart = (item: NomenclatureItem, quantity: number, price: number) => {
    setCart(prev => {
      const existing = prev.find(c => c.nomenclature.id === item.id)
      if (existing) {
        return prev.map(c =>
          c.nomenclature.id === item.id
            ? { ...c, quantity: c.quantity + quantity, price }
            : c
        )
      }
      return [...prev, { nomenclature: item, quantity, price }]
    })
  }

  const updateCartItem = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.nomenclature.id === itemId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const removeFromCart = (itemId: number) => {
    setCart(prev => prev.filter(item => item.nomenclature.id !== itemId))
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <AppContext.Provider
      value={{
        token,
        setToken,
        contragent,
        setContragent,
        selectedPaybox,
        setSelectedPaybox,
        selectedOrganization,
        setSelectedOrganization,
        selectedWarehouse,
        setSelectedWarehouse,
        selectedPriceType,
        setSelectedPriceType,
        cart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export { AppContext }

