export const dynamic = "force-dynamic";

import { fetchBlogPostBySlug } from '@/lib/baserow';
import { notFound } from 'next/navigation';

import Link from 'next/link';
import blogStyles from '../blogCards.module.css';
import '../blogCards.mobile-fix.css';

export default async function BlogDetail(props: { params: { slug: string } }) {
  const { slug } = await Promise.resolve(props.params);
  const decodedSlug = decodeURIComponent(slug);
  const post = await fetchBlogPostBySlug(decodedSlug);
  if (!post) return notFound();
  // Debug-Ausgabe für Blog-Content
  if (typeof window !== 'undefined') {
    console.log('BLOG CONTENT:', post.content);
  }
  return (
    <article style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <Link href="/blog" className={blogStyles.blogBackButton}>
        Zurück
      </Link>
      <h1>{post.title}</h1>
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }} />
      )}
      <div style={{ margin: '24px 0' }}>
        {/* Render richtig formatiertes HTML mit verarbeiteten Zeilenumbrüchen */}
        {post.content ? (
          <div 
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }} 
            style={{
              lineHeight: '1.6',
              fontSize: '16px',
            }}
          />
        ) : (
          <span style={{color:'#666'}}>Kein Inhalt vorhanden...</span>
        )}
      </div>
      <p style={{ fontSize: 14, color: '#888' }}>Autor: {post.author} | Geändert: {post.updatedAt ? new Date(post.updatedAt).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</p>
    </article>
  );
}
