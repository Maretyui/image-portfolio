import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { query } from '@/lib/db'

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, slug, description } = await request.json()

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug required' }, { status: 400 })
    }

    if (typeof name !== 'string' || name.length > 255) {
      return NextResponse.json({ error: 'Name must be a string under 255 characters' }, { status: 400 })
    }

    if (typeof slug !== 'string' || slug.length > 100 || !SLUG_REGEX.test(slug)) {
      return NextResponse.json(
        { error: 'Slug must be lowercase alphanumeric with hyphens, max 100 characters' },
        { status: 400 }
      )
    }

    if (description !== undefined && description !== null) {
      if (typeof description !== 'string' || description.length > 1000) {
        return NextResponse.json({ error: 'Description must be a string under 1000 characters' }, { status: 400 })
      }
    }

    await query(
      'INSERT INTO collections (title, slug, description) VALUES (?, ?, ?)',
      [name, slug, description || '']
    )

    return NextResponse.json({ message: 'Collection created' }, { status: 201 })
  } catch (error) {
    console.error('Collection creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
