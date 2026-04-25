import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, slug, description } = await request.json()

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug required' },
        { status: 400 }
      )
    }

    await query(
      'INSERT INTO collections (title, slug, description) VALUES (?, ?, ?)',
      [name, slug, description || '']
    )

    return NextResponse.json(
      { message: 'Collection created' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Collection creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
