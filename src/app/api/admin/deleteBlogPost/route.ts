import { NextRequest, NextResponse } from 'next/server';
import { deleteBlogPost } from '@/lib/baserow';

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    await deleteBlogPost(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Fehler beim Löschen' }, { status: 500 });
  }
}
