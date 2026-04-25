import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { getAdminSession } from '@/lib/auth'
import { query } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: idParam } = await params
    const id = parseInt(idParam)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const rows = await query<{ image_url: string }>('SELECT image_url FROM images WHERE id = ?', [id])

    await query('DELETE FROM images WHERE id = ?', [id])

    if (rows.length > 0 && rows[0].image_url.startsWith('/uploads/')) {
      const filePath = join(process.cwd(), 'public', rows[0].image_url)
      await unlink(filePath).catch(() => {})
    }

    return NextResponse.json({ message: 'Image deleted' })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
