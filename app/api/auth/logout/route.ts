import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { message: 'Logged out' },
    { status: 200 }
  )

  response.cookies.delete('admin_session')

  return response
}
