import { NextRequest, NextResponse } from 'vercel/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get('endpoint');
  const token = searchParams.get('token');

  if (!endpoint || !token) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  try {
    const url = `https://app.tablecrm.com/api/v1/${endpoint}?token=${token}`;
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}