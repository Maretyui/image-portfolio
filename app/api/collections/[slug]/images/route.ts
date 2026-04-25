import { query, Collection, PortfolioImage } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const collections = await query<Collection>(
      'SELECT * FROM collections WHERE slug = ? LIMIT 1',
      [slug]
    );

    if (collections.length === 0) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    const collectionId = collections[0].id;

    const images = await query<PortfolioImage>(
      'SELECT * FROM images WHERE collection_id = ? ORDER BY display_order ASC',
      [collectionId]
    );

    return NextResponse.json(images || []);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
