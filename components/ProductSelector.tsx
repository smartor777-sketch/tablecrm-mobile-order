'use client'

import { useState, useContext, useEffect } from 'react'
import { AppContext } from '@/context/AppContext'
import { getNomenclature } from '@/services/api'

export default function ProductSelector() {
  const { token, selectedPriceType, cart, addToCart, updateCartItem, removeFromCart } = useContext(AppContext)!
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (token) {
      loadProducts()
    }
  }, [token])

  const loadProducts = async () => {
    if (!token) return

    setLoading(true)
    setError('')

    try {
      const response = await getNomenclature(token)
      if (response.error) {
        setError(response.error)
      } else if (response.data) {
        setProducts(response.data)
      }
    } catch (err) {
      setError('Ошибка при загрузке товаров')
    } finally {
      setLoading(false)
    }
  }

  // Фильтрация только при непустой строке поиска
  const filteredProducts = searchQuery.trim()
    ? products.filter((p) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const getProductPrice = (product: any) => {
    // Здесь можно добавить логику получения цены в зависимости от selectedPriceType
    return product.price || product.price_sale || 0
  }

  const handleAddToCart = () => {
    if (!selectedProduct) return

    const price = getProductPrice(selectedProduct)
    addToCart(selectedProduct, quantity, price)

    // После добавления в корзину скрываем выбор:
    // очищаем выбранный товар и строку поиска,
    // список товаров тоже скрывается, так как searchQuery пустой
    setSelectedProduct(null)
    setQuantity(1)
    setSearchQuery('')
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Товары
        </label>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            const value = e.target.value
            setSearchQuery(value)
            // Если строка поиска стала пустой — скрываем выбранный товар
            if (!value.trim()) {
              setSelectedProduct(null)
            }
          }}
          placeholder="Поиск товаров..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      {loading && (
        <div className="text-center py-4 text-gray-500">Загрузка товаров...</div>
      )}

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      {/* Список товаров показываем только если есть непустой поиск и результаты */}
      {!loading && searchQuery.trim() && filteredProducts.length > 0 && (
        <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => setSelectedProduct(product)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                selectedProduct?.id === product.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="font-medium">{product.name}</div>
              <div className="text-sm text-gray-500">
                Цена: {getProductPrice(product).toLocaleString('ru-RU')} ₽
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedProduct && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <div>
            <div className="font-medium text-blue-900">{selectedProduct.name}</div>
            <div className="text-sm text-blue-700">
              Цена: {getProductPrice(selectedProduct).toLocaleString('ru-RU')} ₽
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700">Количество:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Добавить
            </button>
          </div>
        </div>
      )}

      {cart.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4 space-y-2">
          <div className="font-medium text-gray-700 mb-2">Корзина</div>
          {cart.map((item) => (
            <div key={item.nomenclature.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex-1">
                <div className="font-medium text-sm">{item.nomenclature.name}</div>
                <div className="text-xs text-gray-500">
                  {item.price.toLocaleString('ru-RU')} ₽ × {item.quantity}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateCartItem(item.nomenclature.id, Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeFromCart(item.nomenclature.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-gray-200 font-medium text-lg">
            Итого: {cartTotal.toLocaleString('ru-RU')} ₽
          </div>
        </div>
      )}
    </div>
  )
}

