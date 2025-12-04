// Используем локальные API routes для обхода CORS
const API_BASE_URL = '/api'

export interface ApiResponse<T> {
  data?: T
  error?: string
}

async function fetchWithToken<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}?token=${token}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }))
      return {
        error: errorData.error || `Ошибка ${response.status}: ${response.statusText}`,
      }
    }

    const data = await response.json()
    return data
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
    }
  }
}

// Поиск клиентов по телефону
export async function searchContragentsByPhone(
  token: string,
  phone: string
): Promise<ApiResponse<any[]>> {
  const cleanedPhone = phone.replace(/\D/g, '')
  if (!cleanedPhone) {
    return { data: [] }
  }

  // Используем локальный API route, который фильтрует на сервере
  const url = `${API_BASE_URL}/contragents?token=${token}&phone=${encodeURIComponent(phone)}`
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }))
      return {
        error: errorData.error || `Ошибка ${response.status}: ${response.statusText}`,
      }
    }

    const data = await response.json()
    return data
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
    }
  }
}

// Получение всех счетов
export async function getPayboxes(token: string): Promise<ApiResponse<any[]>> {
  return fetchWithToken(`/payboxes`, token)
}

// Получение всех организаций
export async function getOrganizations(token: string): Promise<ApiResponse<any[]>> {
  return fetchWithToken(`/organizations`, token)
}

// Получение всех складов
export async function getWarehouses(token: string): Promise<ApiResponse<any[]>> {
  return fetchWithToken(`/warehouses`, token)
}

// Получение типов цен
export async function getPriceTypes(token: string): Promise<ApiResponse<any[]>> {
  return fetchWithToken(`/price-types`, token)
}

// Получение номенклатуры (товаров)
export async function getNomenclature(token: string): Promise<ApiResponse<any[]>> {
  return fetchWithToken(`/nomenclature`, token)
}

// Создание продажи
export async function createSale(
  token: string,
  saleData: any,
  conduct: boolean = false
): Promise<ApiResponse<any>> {
  const url = `${API_BASE_URL}/docs-sales?token=${token}`
  
  try {
    const payload = {
      ...saleData,
      conduct: conduct,
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }))
      return {
        error: errorData.error || `Ошибка ${response.status}: ${response.statusText}`,
      }
    }

    const data = await response.json()
    return data
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
    }
  }
}

