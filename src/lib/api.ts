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

const CORS_PROXY = "https://corsproxy.io/?";

async function fetchApi<T>(
  endpoint: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  try {
    const url = `https://app.tablecrm.com/api/v1/${endpoint}?token=${token}`;
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`, {
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
    const msg = err instanceof Error ? err.message : "Error";
    if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
      throw new Error("CORS error! Try another method.");
    }
    throw err;
  }
}