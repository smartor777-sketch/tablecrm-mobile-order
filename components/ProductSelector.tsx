'use client'

import { useState, useContext, useEffect } from 'react'
import { AppContext } from '@/context/AppContext'
import { getNomenclature } from '@/services/api'
import { PackagePlus, Search } from 'lucide-react'

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

  const filteredProducts = searchQuery.trim()
    ? products.filter((p) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const getProductPrice = (product: any) => {
    return product.price || product.price_sale || 0
  }

  const handleAddToCart = () => {
    if (!selectedProduct) return

    const price = getProductPrice(selectedProduct)
    addToCart(selectedProduct, quantity, price)

    setSelectedProduct(null)
    setQuantity(1)
    setSearchQuery('')
  }

  return (
    <div className="rounded-xl border border-border/70 bg-card/95 p-4 shadow-sm">
      <div className="font-medium text-base mb-3 flex items-center gap-2">
        <PackagePlus className="size-4" />
        4. Товары
      </div>
      <p className="text-sm text-muted-foreground mb-4">Поиск и добавление номенклатуры</p>
      
      <div className="space-y-3">
        <input
          type="text"
          id="productSearch"
          value={searchQuery}
          onChange={(e) => {
            const value = e.target.value
            setSearchQuery(value)
            if (!value.trim()) {
              setSelectedProduct(null)
            }
          }}
          placeholder="Поиск товара по названию"
          className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive md:text-sm"
        />

        {loading && (
          <div className="text-center py-4 text-muted-foreground">Загрузка...</div>
        )}

        {error && (
          <div className="text-destructive text-sm">{error}</div>
        )}

        {!loading && searchQuery.trim() && filteredProducts.length > 0 && (
          <div className="relative h-56 rounded-xl border">
            <div className="size-full rounded-[inherit] overflow-y-auto p-2 space-y-1">
              {filteredProducts.slice(0, 20).map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => setSelectedProduct(product)}
                  className={`w-full text-left px-2 py-2 hover:bg-accent rounded-md ${
                    selectedProduct?.id === product.id ? 'bg-accent' : ''
                  }`}
                >
                  <div className="font-medium text-sm">{product.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {getProductPrice(product).toFixed(2)} ₽
                  </div>
                </button>
              ))}
              {filteredProducts.length > 20 && (
                <div className="text-center py-2 text-muted-foreground text-sm">
                  Показано 20 из {filteredProducts.length}
                </div>
              )}
            </div>
          </div>
        )}

        {!searchQuery.trim() && !loading && products.length > 0 && (
          <div className="relative h-56 rounded-xl border">
            <div className="size-full rounded-[inherit] overflow-y-auto p-2 space-y-1">
              <p className="px-2 py-4 text-sm text-muted-foreground text-center">
                Введите название товара для поиска
              </p>
            </div>
          </div>
        )}

        {selectedProduct && (
          <div className="bg-secondary/30 rounded-lg p-3 space-y-3">
            <div>
              <div className="font-medium">{selectedProduct.name}</div>
              <div className="text-sm text-muted-foreground">
                {getProductPrice(selectedProduct).toFixed(2)} ₽
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="text-sm">Количество:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="h-8 w-20 rounded-lg border border-input bg-transparent px-2.5 py-1 text-center transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-primary-foreground h-8 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                Добавить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}