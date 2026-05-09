// TableCRM API Types

export interface Contragent {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  inn?: string;
}

export interface Organization {
  id: string;
  name: string;
  inn?: string;
  kpp?: string;
  address?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  organization_id?: string;
  address?: string;
}

export interface Paybox {
  id: string;
  name: string;
  organization_id?: string;
  amount?: number;
}

export interface PriceType {
  id: string;
  name: string;
  currency?: string;
}

export interface Nomenclature {
  id: string;
  name: string;
  article?: string;
  unit?: string;
  unit_price?: number;
  category?: string;
}

export interface SalePosition {
  nomenclature_id: string;
  quantity: number;
  unit_price: number;
}

export interface SalePayload {
  token: string;
  contragent_id: string | null;
  organization_id: string;
  paybox_id: string;
  warehouse_id: string;
  price_type_id: string;
  comment: string;
  positions: SalePosition[];
}

export interface SaleDocument {
  id: string;
  status: "draft" | "committed" | "cancelled";
  created_at: string;
  total: number;
}

export interface CartItem {
  id: string;
  nomenclature_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface ApiError {
  detail: string;
  status_code: number;
}