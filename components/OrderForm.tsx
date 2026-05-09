'use client'

import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/context/AppContext'
import { getPayboxes, getOrganizations, getWarehouses, getPriceTypes, createSale } from '@/services/api'
import ClientSearch from './ClientSearch'
import SelectField from './SelectField'
import ProductSelector from './ProductSelector'
import { PlugZap, Phone, PackagePlus, ShoppingCart, CheckCircle, ChevronDown, Search } from 'lucide-react'

interface CartItem {
  nomenclature: any
  quantity: number
  price: number
}

export default function OrderForm() {
  const {
    token,
    contragent,
    selectedPaybox,
    setSelectedPaybox,
    selectedOrganization,
    setSelectedOrganization,
    selectedWarehouse,
    setSelectedWarehouse,
    selectedPriceType,
    setSelectedPriceType,
    cart,
    clearCart,
  } = useContext(AppContext)!

  const [payboxes, setPayboxes] = useState<any[]>([])
  const [organizations, setOrganizations] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [priceTypes, setPriceTypes] = useState<any[]>([])
  const [comment, setComment] = useState('')
  
  const [loadingPayboxes, setLoadingPayboxes] = useState(false)
  const [loadingOrganizations, setLoadingOrganizations] = useState(false)
  const [loadingWarehouses, setLoadingWarehouses] = useState(false)
  const [loadingPriceTypes, setLoadingPriceTypes] = useState(false)
  
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [createSuccess, setCreateSuccess] = useState(false)

  const total = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0)

  useEffect(() => {
    if (token) {
      loadPayboxes()
      loadOrganizations()
      loadWarehouses()
      loadPriceTypes()
    }
  }, [token])

  const loadPayboxes = async () => {
    if (!token) return
    setLoadingPayboxes(true)
    try {
      const response = await getPayboxes(token)
      if (response.error) {
        setPayboxes([])
      } else if (response.data) {
        setPayboxes(response.data)
      } else {
        setPayboxes([])
      }
    } catch (err) {
      setPayboxes([])
    } finally {
      setLoadingPayboxes(false)
    }
  }

  const loadOrganizations = async () => {
    if (!token) return
    setLoadingOrganizations(true)
    try {
      const response = await getOrganizations(token)
      if (response.error) {
        setOrganizations([])
      } else if (response.data) {
        setOrganizations(response.data)
      } else {
        setOrganizations([])
      }
    } catch (err) {
      setOrganizations([])
    } finally {
      setLoadingOrganizations(false)
    }
  }

  const loadWarehouses = async () => {
    if (!token) return
    setLoadingWarehouses(true)
    try {
      const response = await getWarehouses(token)
      if (response.error) {
        setWarehouses([])
      } else if (response.data) {
        setWarehouses(response.data)
      } else {
        setWarehouses([])
      }
    } catch (err) {
      setWarehouses([])
    } finally {
      setLoadingWarehouses(false)
    }
  }

  const loadPriceTypes = async () => {
    if (!token) return
    setLoadingPriceTypes(true)
    try {
      const response = await getPriceTypes(token)
      if (response.error) {
        setPriceTypes([])
      } else if (response.data) {
        setPriceTypes(response.data)
      } else {
        setPriceTypes([])
      }
    } catch (err) {
      setPriceTypes([])
    } finally {
      setLoadingPriceTypes(false)
    }
  }

  const handleCreateSale = async (conduct: boolean) => {
    if (!token) {
      setCreateError('Токен не найден')
      return
    }

    if (!contragent) {
      setCreateError('Выберите клиента')
      return
    }

    if (cart.length === 0) {
      setCreateError('Добавьте товары в корзину')
      return
    }

    // require all params
    if (!selectedPaybox) {
      setCreateError('Выберите счёт')
      return
    }
    if (!selectedOrganization) {
      setCreateError('Выберите организацию')
      return
    }
    if (!selectedWarehouse) {
      setCreateError('Выберите склад')
      return
    }
    if (!selectedPriceType) {
      setCreateError('Выберите тип цены')
      return
    }

    setCreating(true)
    setCreateError('')
    setCreateSuccess(false)

    try {
      const saleData = {
        contragent_id: contragent.id,
        paybox_id: selectedPaybox.id,
        organization_id: selectedOrganization.id,
        warehouse_id: selectedWarehouse.id,
        price_type_id: selectedPriceType.id,
        comment: comment,
        items: cart.map((item: CartItem) => ({
          nomenclature_id: item.nomenclature.id,
          quantity: item.quantity,
          price: item.price,
        })),
      }

      const response = await createSale(token, saleData, conduct)
      
      if (response.error) {
        setCreateError(response.error)
      } else {
        setCreateSuccess(true)
        clearCart()
        setComment('')
        setTimeout(() => {
          setCreateSuccess(false)
        }, 3000)
      }
    } catch (err) {
      setCreateError('Ошибка при создании продажи')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-4">
      {createError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {createError}
        </div>
      )}

      {createSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm">
          Продажа успешно создана!
        </div>
      )}

      <ClientSearch />

      <div className="rounded-xl border border-border/70 bg-card/95 p-4 shadow-sm">
        <div className="font-medium text-base mb-3">3. Параметры продажи</div>
        <p className="text-sm text-muted-foreground mb-4">Счёт, организация, склад и тип цены</p>
        
        <div className="space-y-3">
          <SelectField
            label="Организация"
            value={selectedOrganization}
            onChange={setSelectedOrganization}
            options={organizations}
            loading={loadingOrganizations}
            getOptionLabel={(opt) => opt.name || opt.title || `Организация #${opt.id}`}
            getOptionValue={(opt) => opt.id}
          />

          <SelectField
            label="Счёт"
            value={selectedPaybox}
            onChange={setSelectedPaybox}
            options={payboxes}
            loading={loadingPayboxes}
            getOptionLabel={(opt) => opt.name || opt.title || `Счёт #${opt.id}`}
            getOptionValue={(opt) => opt.id}
          />

          <SelectField
            label="Склад"
            value={selectedWarehouse}
            onChange={setSelectedWarehouse}
            options={warehouses}
            loading={loadingWarehouses}
            getOptionLabel={(opt) => opt.name || opt.title || `Склад #${opt.id}`}
            getOptionValue={(opt) => opt.id}
          />

          <SelectField
            label="Тип цены"
            value={selectedPriceType}
            onChange={setSelectedPriceType}
            options={priceTypes}
            loading={loadingPriceTypes}
            getOptionLabel={(opt) => opt.name || opt.title || `Тип цены #${opt.id}`}
            getOptionValue={(opt) => opt.id}
          />
        </div>
      </div>

      <ProductSelector />

      <div className="rounded-xl border border-border/70 bg-card/95 p-4 shadow-sm">
        <div className="font-medium text-base mb-3 flex items-center gap-2">
          <ShoppingCart className="size-4" />
          Корзина
        </div>
        <p className="text-sm text-muted-foreground mb-4">Количество, цена и сумма по позициям</p>
        
        <div className="space-y-2">
          {cart.length === 0 ? (
            <p className="text-sm text-muted-foreground">Добавьте хотя бы один товар</p>
          ) : (
            cart.map((item: CartItem, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.nomenclature.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × {item.price.toFixed(2)} ₽
                  </p>
                </div>
                <p className="text-sm font-medium ml-2">
                  {(item.price * item.quantity).toFixed(2)} ₽
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border/70 bg-card/95 p-4 shadow-sm">
        <div className="font-medium text-base mb-3">Комментарий</div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Комментарий к заказу (необязательно)"
          className="flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
          rows={3}
        />
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto w-full max-w-md px-3 py-3">
          <div className="mb-3 flex items-center justify-between rounded-xl border bg-card px-3 py-2">
            <p className="text-sm text-muted-foreground">Итого</p>
            <p className="text-lg font-semibold">{total.toFixed(2)} ₽</p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleCreateSale(false)}
              disabled={creating}
              className="w-full bg-primary text-primary-foreground h-8 px-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {creating ? 'Создание...' : 'Создать продажу'}
            </button>
            <button
              onClick={() => handleCreateSale(true)}
              disabled={creating}
              className="w-full bg-secondary text-secondary-foreground h-8 px-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
            >
              <CheckCircle className="size-4 mr-2" />
              Создать и провести
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}