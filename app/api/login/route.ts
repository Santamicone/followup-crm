import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const secret = process.env.LOGIN_SECRET

  if (!secret) {
    return NextResponse.json({ error: 'LOGIN_SECRET non configurato' }, { status: 500 })
  }

  if (password !== secret) {
    return NextResponse.json({ error: 'Password errata' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('auth_token', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 giorni
    path: '/',
  })
  return res
}
