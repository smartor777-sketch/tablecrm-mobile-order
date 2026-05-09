import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useStore } from "@/hooks/useStore";
import { formatPrice } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function FooterActions() {
  const {
    token,
    isLoading,
    error,
    selectedOrganization,
    selectedPaybox,
    selectedWarehouse,
    selectedPriceType,
    cart,
    comment,
    getCartTotal,
    createSale,
    setComment,
  } = useStore();

  const [validationError, setValidationError] = useState("");
  const disabled = !token;

  const validateForm = (): boolean => {
    if (!selectedOrganization) {
      setValidationError("Выберите организацию");
      return false;
    }
    if (!selectedPaybox) {
      setValidationError("Выберите счёт");
      return false;
    }
    if (!selectedWarehouse) {
      setValidationError("Выберите склад");
      return false;
    }
    if (!selectedPriceType) {
      setValidationError("Выберите тип цены");
      return false;
    }
    if (cart.length === 0) {
      setValidationError("Добавьте хотя бы один товар");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleCreateSale = async (status: "draft" | "committed") => {
    if (!validateForm()) return;
    setValidationError("");
    await createSale(status);
  };

  return (
    <>
      <Card className="mb-20">
        <CardContent className="pt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comment">Комментарий</Label>
            <Input
              id="comment"
              placeholder="Комментарий к заказу (необязательно)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={disabled}
            />
          </div>

          <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
            <span className="font-medium">Итого</span>
            <span className="text-xl font-bold">{formatPrice(getCartTotal())}</span>
          </div>

          {(validationError || error) && (
            <p className="text-sm text-red-500">
              {validationError || error}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 space-y-2">
        <div className="max-w-md mx-auto flex gap-2">
          <Button
            onClick={() => handleCreateSale("draft")}
            disabled={isLoading || disabled}
            variant="outline"
            className="flex-1"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Создать продажу"
            )}
          </Button>
          <Button
            onClick={() => handleCreateSale("committed")}
            disabled={isLoading || disabled}
            className="flex-1"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Создать и провести"
            )}
          </Button>
        </div>
      </div>
    </>
  );
}