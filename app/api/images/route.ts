import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const images = await query(
      'SELECT id, title, image_url, width_span, height_span, display_order FROM images ORDER BY display_order ASC, created_at ASC'
    )
    return NextResponse.json(images)
  } catch (error) {
    console.error('Error fetching images:', error)
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}
