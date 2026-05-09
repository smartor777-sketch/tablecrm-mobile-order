import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/useStore";
import { validateToken } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function AuthSection() {
  const [tokenInput, setTokenInput] = useState("");
  const { token, setToken, loadReferences, isLoadingReferences, error } = useStore();
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken && validateToken(urlToken)) {
      setTokenInput(urlToken);
      setToken(urlToken);
      loadReferences();
    }
  }, []);

  const handleConnect = async () => {
    setLocalError("");
    if (!validateToken(tokenInput)) {
      setLocalError("Введите токен (минимум 10 символов)");
      return;
    }
    setToken(tokenInput);
    await loadReferences();
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">1. Подключение кассы</CardTitle>
        <p className="text-sm text-muted-foreground">Введите токен и загрузите справочники</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="Введите token кассы"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            disabled={isLoadingReferences}
          />
          <Button onClick={handleConnect} disabled={isLoadingReferences}>
            {isLoadingReferences ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Подключить"
            )}
          </Button>
        </div>
        {(localError || error) && (
          <p className="text-sm text-red-500">{localError || error}</p>
        )}
        {token && !error && (
          <p className="text-sm text-green-600">Касса подключена</p>
        )}
      </CardContent>
    </Card>
  );
}