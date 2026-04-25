import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join, extname } from 'path'
import { randomUUID } from 'crypto'
import { getAdminSession } from '@/lib/auth'
import { query } from '@/lib/db'

async function getOrCreateDefaultCollection(): Promise<number> {
  const rows = await query<{ id: number }>('SELECT id FROM collections LIMIT 1')
  if (rows.length > 0) {
    return rows[0].id
  }
  await query(
    "INSERT INTO collections (slug, title, description, display_order) VALUES ('portfolio', 'Portfolio', 'Main portfolio', 1)"
  )
  const created = await query<{ id: number }>('SELECT id FROM collections WHERE slug = ?', ['portfolio'])
  return created[0].id
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const widthSpan = parseInt(formData.get('width') as string) || 1
    const heightSpan = parseInt(formData.get('height') as string) || 1

    if (!file) {
      return NextResponse.json({ error: 'File required' }, { status: 400 })
    }

    const ext = extname(file.name) || '.jpg'
    const filename = `${randomUUID()}${ext}`
    const uploadDir = join(process.cwd(), 'public', 'uploads')

    await mkdir(uploadDir, { recursive: true })

    const bytes = await file.arrayBuffer()
    await writeFile(join(uploadDir, filename), Buffer.from(bytes))

    const imageUrl = `/uploads/${filename}`
    const collectionId = await getOrCreateDefaultCollection()

    await query(
      'INSERT INTO images (collection_id, title, image_url, width_span, height_span) VALUES (?, ?, ?, ?, ?)',
      [collectionId, title || file.name, imageUrl, widthSpan, heightSpan]
    )

    return NextResponse.json({ message: 'Image uploaded', url: imageUrl }, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
