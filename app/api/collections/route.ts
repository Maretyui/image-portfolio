import { query, Collection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const collections = await query<any>(
      'SELECT id, slug, title, description, display_order FROM collections ORDER BY display_order ASC'
    );
    return NextResponse.json(collections || []);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
