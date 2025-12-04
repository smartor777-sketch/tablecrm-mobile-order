import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 })
  }

  try {
    const url = new URL('https://app.tablecrm.com/api/v1/organizations')
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
    console.log('Organizations API response:', { isArray: Array.isArray(data), hasResult: !!data.result, dataKeys: Object.keys(data) })
    const result = Array.isArray(data) ? data : (data.result || data.data || [])
    console.log('Organizations extracted:', result.length, 'items')
    return NextResponse.json({ data: result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Неизвестная ошибка' },
      { status: 500 }
    )
  }
}

