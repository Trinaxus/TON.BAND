import { NextRequest, NextResponse } from 'next/server';
import { createBlogPost } from '@/lib/baserow';

export async function POST(req: NextRequest) {
  const {
    title,
    slug,
    content,
    excerpt,
    coverImage,
    author,
    tags,
    category,
    isDraft,
    seoTitle,
    seoDescription
  } = await req.json();
  if (!title || !content) {
    return NextResponse.json({ error: 'Titel und Inhalt sind erforderlich.' }, { status: 400 });
  }
  try {
    // Mappe alle Felder auf die Baserow-Feldnamen!
    // Zeitstempel generieren
    const now = new Date().toISOString();
    const data: Record<string, any> = {
      field_4306509: title,           // title
      field_4306510: slug,            // slug
      field_4306511: content,         // content
      field_4306512: excerpt,         // excerpt
      field_4306513: coverImage,      // coverImage
      field_4306514: author,          // author
      field_4306518: tags,            // tags
      field_4306519: category,        // category
      field_4306520: isDraft === "1" || isDraft === true ? "1" : "0",  // isDraft
      field_4306521: seoTitle,        // seoTitle
      field_4306522: seoDescription,  // seoDescription
      field_4306517: now,             // updatedAt
      field_4306515: !(isDraft === "1" || isDraft === true) ? "1" : "0",  // published
      field_4306516: isDraft === "1" || isDraft === true ? null : now  // publishedAt
    };
    console.log('Creating blog post with data:', data);
    const post = await createBlogPost(data);
    console.log('Created blog post:', post);
    return NextResponse.json({ success: true, post });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Fehler beim Erstellen' }, { status: 500 });
  }
}
