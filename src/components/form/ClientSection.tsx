import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/useStore";
import { validatePhone, formatPhone } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function ClientSection() {
  const [phone, setPhone] = useState("");
  const { token, searchClient, selectedClient, isLoading, error } = useStore();
  const [localError, setLocalError] = useState("");
  const disabled = !token;

  const handleSearch = async () => {
    setLocalError("");
    if (!validatePhone(phone)) {
      setLocalError("Неверный формат телефона");
      return;
    }
    await searchClient(phone);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">2. Клиент</CardTitle>
        <p className="text-sm text-muted-foreground">Поиск клиента по телефону</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="tel"
            placeholder="Телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={disabled || isLoading}
          />
          <Button onClick={handleSearch} disabled={disabled || isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Найти"}
          </Button>
        </div>

        {localError && <p className="text-sm text-red-500">{localError}</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {selectedClient ? (
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium">{selectedClient.name}</p>
            {selectedClient.phone && (
              <p className="text-sm text-muted-foreground">
                {formatPhone(selectedClient.phone)}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Клиент не выбран</p>
        )}
      </CardContent>
    </Card>
  );
}