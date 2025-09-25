import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const token = process.env.BASEROW_TOKEN;
    const baserowApiUrl = process.env.BASEROW_API_URL;
    const blogTableId = process.env.BASEROW_BLOG_TABLE_ID;

    const res = await fetch(
      `${baserowApiUrl}/database/rows/table/${blogTableId}/${id}/?user_field_names=true`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: res.status });
    }

    const data = await res.json();
    const post = {
      id: data.id,
      title: data.field_4306509,
      slug: data.field_4306510,
      content: data.field_4306511,
      excerpt: data.field_4306512,
      coverImage: data.field_4306513,
      author: data.field_4306514,
      tags: data.field_4306518,
      category: data.field_4306519,
      isDraft: data.field_4306520 ? "1" : "0",
      seoTitle: data.field_4306521,
      seoDescription: data.field_4306522,
    };

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
