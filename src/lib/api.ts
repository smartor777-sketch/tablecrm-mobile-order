import type {
  Contragent,
  Organization,
  Warehouse,
  Paybox,
  PriceType,
  Nomenclature,
  SalePayload,
  SaleDocument,
  ApiError,
} from "./types";

const API_BASE = "https://app.tablecrm.com/api/v1";

async function fetchApi<T>(
  endpoint: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  try {
    const url = `${API_BASE}${endpoint}?token=${token}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: "Unknown error",
        status_code: response.status,
      }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Ошибка соединения";
    if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
      throw new Error("Не удалось连接到TableCRM. Проверьте интернет или CORS.");
    }
    throw err;
  }
}

export async function fetchContragents(token: string): Promise<Contragent[]> {
  return fetchApi<Contragent[]>("/contragents", token);
}

export async function searchClientByPhone(
  token: string,
  phone: string
): Promise<Contragent | null> {
  const clients = await fetchApi<Contragent[]>(
    `/contragents?phone=${encodeURIComponent(phone)}`,
    token
  );
  return clients[0] || null;
}

export async function fetchOrganizations(
  token: string
): Promise<Organization[]> {
  return fetchApi<Organization[]>("/organizations", token);
}

export async function fetchWarehouses(token: string): Promise<Warehouse[]> {
  return fetchApi<Warehouse[]>("/warehouses", token);
}

export async function fetchPayboxes(token: string): Promise<Paybox[]> {
  return fetchApi<Paybox[]>("/payboxes", token);
}

export async function fetchPriceTypes(token: string): Promise<PriceType[]> {
  return fetchApi<PriceType[]>("/price_types", token);
}

export async function fetchNomenclature(
  token: string
): Promise<Nomenclature[]> {
  return fetchApi<Nomenclature[]>("/nomenclature", token);
}

export async function createSale(
  token: string,
  payload: Omit<SalePayload, "token">,
  status: "draft" | "committed"
): Promise<SaleDocument> {
  return fetchApi<SaleDocument>("/docs_sales", token, {
    method: "POST",
    body: JSON.stringify({ ...payload, token, status }),
  });
}