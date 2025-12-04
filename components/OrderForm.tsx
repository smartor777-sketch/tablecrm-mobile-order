'use client'

import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/context/AppContext'
import { getPayboxes, getOrganizations, getWarehouses, getPriceTypes, createSale } from '@/services/api'
import ClientSearch from './ClientSearch'
import SelectField from './SelectField'
import ProductSelector from './ProductSelector'

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
  
  const [loadingPayboxes, setLoadingPayboxes] = useState(false)
  const [loadingOrganizations, setLoadingOrganizations] = useState(false)
  const [loadingWarehouses, setLoadingWarehouses] = useState(false)
  const [loadingPriceTypes, setLoadingPriceTypes] = useState(false)
  
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [createSuccess, setCreateSuccess] = useState(false)

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
        console.error('Ошибка загрузки счетов:', response.error)
        setPayboxes([])
      } else if (response.data) {
        console.log('Загружено счетов:', response.data.length)
        setPayboxes(response.data)
      } else {
        console.warn('Счета не загружены, ответ:', response)
        setPayboxes([])
      }
    } catch (err) {
      console.error('Ошибка загрузки счетов:', err)
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
        console.error('Ошибка загрузки организаций:', response.error)
        setOrganizations([])
      } else if (response.data) {
        console.log('Загружено организаций:', response.data.length)
        setOrganizations(response.data)
      } else {
        console.warn('Организации не загружены, ответ:', response)
        setOrganizations([])
      }
    } catch (err) {
      console.error('Ошибка загрузки организаций:', err)
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
        console.error('Ошибка загрузки складов:', response.error)
        setWarehouses([])
      } else if (response.data) {
        console.log('Загружено складов:', response.data.length)
        setWarehouses(response.data)
      } else {
        console.warn('Склады не загружены, ответ:', response)
        setWarehouses([])
      }
    } catch (err) {
      console.error('Ошибка загрузки складов:', err)
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
        console.error('Ошибка загрузки типов цен:', response.error)
        setPriceTypes([])
      } else if (response.data) {
        console.log('Загружено типов цен:', response.data.length)
        setPriceTypes(response.data)
      } else {
        console.warn('Типы цен не загружены, ответ:', response)
        setPriceTypes([])
      }
    } catch (err) {
      console.error('Ошибка загрузки типов цен:', err)
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

    setCreating(true)
    setCreateError('')
    setCreateSuccess(false)

    try {
      // Формируем payload для создания продажи
      const saleData = {
        contragent_id: contragent.id,
        paybox_id: selectedPaybox?.id,
        organization_id: selectedOrganization?.id,
        warehouse_id: selectedWarehouse?.id,
        price_type_id: selectedPriceType?.id,
        items: cart.map(item => ({
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
        // Можно добавить сброс других полей
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
    <div className="p-4 space-y-6 pb-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Оформление заказа</h1>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('tablecrm_token')
              window.location.reload()
            }
          }}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Выйти
        </button>
      </div>

      <ClientSearch />

      <SelectField
        label={`Счет ${payboxes.length > 0 ? `(${payboxes.length})` : ''}`}
        value={selectedPaybox}
        onChange={setSelectedPaybox}
        options={payboxes}
        loading={loadingPayboxes}
        getOptionLabel={(opt) => opt.name || opt.title || `Счет #${opt.id}`}
        getOptionValue={(opt) => opt.id}
      />

      <SelectField
        label={`Организация ${organizations.length > 0 ? `(${organizations.length})` : ''}`}
        value={selectedOrganization}
        onChange={setSelectedOrganization}
        options={organizations}
        loading={loadingOrganizations}
        getOptionLabel={(opt) => opt.name || opt.title || `Организация #${opt.id}`}
        getOptionValue={(opt) => opt.id}
      />

      <SelectField
        label={`Склад ${warehouses.length > 0 ? `(${warehouses.length})` : ''}`}
        value={selectedWarehouse}
        onChange={setSelectedWarehouse}
        options={warehouses}
        loading={loadingWarehouses}
        getOptionLabel={(opt) => opt.name || opt.title || `Склад #${opt.id}`}
        getOptionValue={(opt) => opt.id}
      />

      <SelectField
        label={`Тип цены ${priceTypes.length > 0 ? `(${priceTypes.length})` : ''}`}
        value={selectedPriceType}
        onChange={setSelectedPriceType}
        options={priceTypes}
        loading={loadingPriceTypes}
        getOptionLabel={(opt) => opt.name || opt.title || `Тип цены #${opt.id}`}
        getOptionValue={(opt) => opt.id}
      />

      <ProductSelector />

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

      <div className="space-y-2 pt-4">
        <button
          onClick={() => handleCreateSale(false)}
          disabled={creating}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {creating ? 'Создание...' : 'Создать продажу'}
        </button>
        <button
          onClick={() => handleCreateSale(true)}
          disabled={creating}
          className="w-full bg-blue-700 text-white py-3 rounded-lg font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {creating ? 'Создание...' : 'Создать и провести'}
        </button>
      </div>
    </div>
  )
}

