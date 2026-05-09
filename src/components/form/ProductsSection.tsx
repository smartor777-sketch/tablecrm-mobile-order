import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/hooks/useStore";
import { formatPrice } from "@/lib/utils";
import { Plus, Minus, Trash2, Search, ShoppingCart } from "lucide-react";

export function ProductsSection() {
  const [search, setSearch] = useState("");
  const {
    isLoadingReferences,
    nomenclature,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    getCartTotal,
  } = useStore();

  const disabled = isLoadingReferences || nomenclature.length === 0;

  const filteredNomenclature = useMemo(() => {
    if (!search.trim() || disabled) return [];
    const query = search.toLowerCase();
    return nomenclature
      .filter((item) => item.name.toLowerCase().includes(query))
      .slice(0, 10);
  }, [nomenclature, search, disabled]);

  const handleAddToCart = (item: (typeof nomenclature)[0]) => {
    addToCart({
      nomenclature_id: item.id,
      name: item.name,
      quantity: 1,
      unit_price: item.unit_price || 0,
    });
    setSearch("");
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">4. Товары</CardTitle>
        <p className="text-sm text-muted-foreground">Поиск и добавление номенклатуры</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={disabled ? "Загрузка..." : "Поиск товара по названию"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={disabled}
            className="pl-9"
          />
          {filteredNomenclature.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredNomenclature.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAddToCart(item)}
                  className="w-full px-3 py-2 text-left hover:bg-muted flex justify-between items-center"
                >
                  <span>{item.name}</span>
                  <Badge variant="secondary">
                    {formatPrice(item.unit_price || 0)}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label>Количество, цена и сумма по позициям</Label>
          {cart.length === 0 ? (
            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg mt-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Добавьте хотя бы один товар
              </p>
            </div>
          ) : (
            <div className="space-y-2 mt-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.unit_price)} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        updateCartQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        updateCartQuantity(item.id, item.quantity + 1)
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="flex justify-between items-center p-4 bg-primary text-primary-foreground rounded-lg">
            <span className="font-medium">Итого</span>
            <span className="text-xl font-bold">{formatPrice(getCartTotal())}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}