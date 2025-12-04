import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')
  const phone = searchParams.get('phone')

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 })
  }

  try {
    const url = new URL('https://app.tablecrm.com/api/v1/contragents')
    url.searchParams.set('token', token)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `Ошибка ${response.status}: ${errorText || response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Если передан phone, фильтруем результаты
    if (phone) {
      const cleanedPhone = phone.replace(/\D/g, '')
      if (cleanedPhone) {
        const contragents = Array.isArray(data) ? data : (data.result || [])
        const filtered = contragents.filter((c: any) => {
          const clientPhone = c.phone?.replace(/\D/g, '') || ''
          return clientPhone.includes(cleanedPhone) || cleanedPhone.includes(clientPhone)
        })
        return NextResponse.json({ data: filtered })
      }
    }

    // Извлекаем массив из ответа
    const result = Array.isArray(data) ? data : (data.result || [])
    return NextResponse.json({ data: result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Неизвестная ошибка' },
      { status: 500 }
    )
  }
}

