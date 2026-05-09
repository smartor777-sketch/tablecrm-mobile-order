import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useStore } from "@/hooks/useStore";

export function ParamsSection() {
  const {
    isLoadingReferences,
    organizations,
    payboxes,
    warehouses,
    priceTypes,
    selectedOrganization,
    selectedPaybox,
    selectedWarehouse,
    selectedPriceType,
    setSelectedOrganization,
    setSelectedPaybox,
    setSelectedWarehouse,
    setSelectedPriceType,
  } = useStore();

  const disabled = isLoadingReferences || organizations.length === 0;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">3. Параметры продажи</CardTitle>
        <p className="text-sm text-muted-foreground">Счёт, организация, склад и тип цены</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="organization">Организация</Label>
          <Select
            value={selectedOrganization}
            onValueChange={setSelectedOrganization}
            disabled={disabled}
          >
            <SelectTrigger id="organization">
              <SelectValue placeholder={disabled ? "Загрузка..." : "Выберите организацию"} />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paybox">Счёт</Label>
          <Select
            value={selectedPaybox}
            onValueChange={setSelectedPaybox}
            disabled={disabled}
          >
            <SelectTrigger id="paybox">
              <SelectValue placeholder={disabled ? "Загрузка..." : "Выберите счёт"} />
            </SelectTrigger>
            <SelectContent>
              {payboxes.map((pb) => (
                <SelectItem key={pb.id} value={pb.id}>
                  {pb.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="warehouse">Склад</Label>
          <Select
            value={selectedWarehouse}
            onValueChange={setSelectedWarehouse}
            disabled={disabled}
          >
            <SelectTrigger id="warehouse">
              <SelectValue placeholder={disabled ? "Загрузка..." : "Выберите склад"} />
            </SelectTrigger>
            <SelectContent>
              {warehouses.map((wh) => (
                <SelectItem key={wh.id} value={wh.id}>
                  {wh.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceType">Тип цены</Label>
          <Select
            value={selectedPriceType}
            onValueChange={setSelectedPriceType}
            disabled={disabled}
          >
            <SelectTrigger id="priceType">
              <SelectValue placeholder={disabled ? "Загрузка..." : "Выберите тип ��ены"} />
            </SelectTrigger>
            <SelectContent>
              {priceTypes.map((pt) => (
                <SelectItem key={pt.id} value={pt.id}>
                  {pt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}