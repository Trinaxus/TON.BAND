import { NextRequest, NextResponse } from 'next/server';
import { updateBlogPost } from '@/lib/baserow';

export async function POST(req: NextRequest) {
  const {
    id,
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

  console.log('Received update request with data:', {
    id, title, slug, content, excerpt, coverImage, 
    author, tags, category, isDraft, seoTitle, seoDescription
  });

  if (!id || !title || !content) {
    console.error('Validation failed: Missing required fields');
    return NextResponse.json({ error: 'ID, Titel und Inhalt sind erforderlich.' }, { status: 400 });
  }

  try {
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

    console.log('Prepared Baserow data:', data);
    console.log('Baserow configuration:', {
      API_URL: process.env.BASEROW_API_URL,
      BLOG_TABLE_ID: process.env.BASEROW_BLOG_TABLE_ID,
      TOKEN_LENGTH: process.env.BASEROW_TOKEN?.length
    });

    const result = await updateBlogPost(id, data);
    console.log('Baserow update result:', JSON.stringify(result, null, 2));
    return NextResponse.json({ success: true, result });
  } catch (e: any) {
    console.error('Complete error object:', e);
    console.error('Error updating blog post:', e.message);
    if (e.response) {
      console.error('Baserow response:', await e.response.text());
    }
    return NextResponse.json({ error: e.message || 'Fehler beim Aktualisieren' }, { status: 500 });
  }
}
