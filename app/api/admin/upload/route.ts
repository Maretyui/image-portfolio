import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join, extname } from 'path'
import { randomUUID } from 'crypto'
import { getAdminSession } from '@/lib/auth'
import { query } from '@/lib/db'

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'])
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

function detectMimeType(bytes: Uint8Array): string | null {
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return 'image/jpeg'
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return 'image/png'
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return 'image/gif'
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return 'image/webp'
  return null
}

async function getOrCreateDefaultCollection(): Promise<number> {
  const rows = await query<{ id: number }>('SELECT id FROM collections LIMIT 1')
  if (rows.length > 0) return rows[0].id
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
    const widthSpan = Math.min(Math.max(parseInt(formData.get('width') as string) || 1, 1), 6)
    const heightSpan = Math.min(Math.max(parseInt(formData.get('height') as string) || 1, 1), 6)

    if (!file) {
      return NextResponse.json({ error: 'File required' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 400 })
    }

    const ext = extname(file.name).toLowerCase()
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const uint8 = new Uint8Array(bytes)

    // AVIF files start with an ftyp box — skip magic-byte check, trust extension + size limit
    if (ext !== '.avif' && detectMimeType(uint8) === null) {
      return NextResponse.json({ error: 'File content does not match a supported image format' }, { status: 400 })
    }

    const filename = `${randomUUID()}${ext}`
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
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
