// Hilfsfunktionen für Baserow Blogposts

const API_URL = process.env.BASEROW_API_URL || process.env.NEXT_PUBLIC_BASEROW_API_URL;
const BLOG_TABLE_ID = process.env.BASEROW_BLOG_TABLE_ID || process.env.NEXT_PUBLIC_BASEROW_BLOG_TABLE_ID;
const TOKEN = process.env.BASEROW_TOKEN || process.env.NEXT_PUBLIC_BASEROW_TOKEN;

const BLOG_URL = `${API_URL}/database/rows/table/${BLOG_TABLE_ID}/`;

// Hilfsfunktionen für Baserow API-Konfiguration
const BASEROW_API_URL = process.env.BASEROW_API_URL || process.env.NEXT_PUBLIC_BASEROW_API_URL;
const BASEROW_BLOG_TABLE_ID = process.env.BASEROW_BLOG_TABLE_ID || process.env.NEXT_PUBLIC_BASEROW_BLOG_TABLE_ID;
const BASEROW_TOKEN = process.env.BASEROW_TOKEN || process.env.NEXT_PUBLIC_BASEROW_TOKEN;
const BASEROW_BLOG_URL = `${BASEROW_API_URL}/database/rows/table/${BASEROW_BLOG_TABLE_ID}`;

export async function fetchBlogPosts({ draft = null } = {}) {
  // isDraft: "0" (veröffentlicht), "1" (Entwurf)
  let filter = '';
  if (draft === false) filter = '&filter__isDraft__equal=0';
  if (draft === true) filter = '&filter__isDraft__equal=1';
  const url = `${BLOG_URL}?user_field_names=true${filter}`;
  const res = await fetch(url, { headers: { Authorization: `Token ${TOKEN}` } });

  let json;
  try {
    json = await res.json();
  } catch (e) {
    throw new Error('Fehler beim Parsen der Baserow-Antwort');
  }

  if (!res.ok) throw new Error('Fehler beim Laden der Blogposts');
  return json;
}

export async function fetchBlogPostBySlug(slug: string) {
  const res = await fetch(
    `${BLOG_URL}?user_field_names=true&filter__slug__equal=${slug}`,
    { headers: { Authorization: `Token ${TOKEN}` } }
  );
  if (!res.ok) throw new Error('Fehler beim Laden des Blogposts');
  const data = await res.json();
  return data.results?.[0] || null;
}

export async function createBlogPost(data: Record<string, any>) {
  const res = await fetch(BLOG_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Fehler beim Erstellen des Blogposts');
  return res.json();
}

export async function updateBlogPost(id: string, data: Record<string, any>) {
  const res = await fetch(`${BLOG_URL}${id}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Token ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Fehler beim Aktualisieren des Blogposts');
  return res.json();
}

export async function deleteBlogPost(id: string) {
  const res = await fetch(`${BLOG_URL}${id}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${TOKEN}`,
    },
  });
  if (!res.ok) throw new Error('Fehler beim Löschen des Blogposts');
  return true;
}
