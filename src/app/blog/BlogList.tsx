"use client";
import { useState } from 'react';
import Link from 'next/link';
import blogStyles from './blogCards.module.css';
import styles from '../gallery/gallery.module.css';

function CategoryFilter({ categories, selected, setSelected }: { categories: string[]; selected: string; setSelected: (cat: string) => void }) {
  return (
    <div className={blogStyles.blogCategories}>
      <button
        className={blogStyles['blog-filter-button'] + (selected === 'Alle' ? ' ' + blogStyles.active : '')}
        onClick={() => setSelected('Alle')}
      >Alle</button>
      {categories.map(cat => (
        <button
          key={cat}
          className={blogStyles['blog-filter-button'] + (selected === cat ? ' ' + blogStyles.active : '')}
          onClick={() => setSelected(cat)}
        >{cat}</button>
      ))}
    </div>
  );
}

export default function BlogList({ posts }: { posts: any[] }) {
  const [selected, setSelected] = useState<string>('Alle');
  const [error, setError] = useState<string | null>(null);
  const placeholderImg = "https://placehold.co/600x300?text=Kein+Bild";

  const categories = Array.from(new Set(posts.map((p:any) => p.category).filter(Boolean)));
  const filteredPosts = selected === 'Alle'
    ? posts.filter((post: any) => post.isDraft === '0' || post.isDraft === 0 || post.isDraft === false)
    : posts.filter((post: any) => (post.isDraft === '0' || post.isDraft === 0 || post.isDraft === false) && post.category === selected);

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <CategoryFilter categories={categories} selected={selected} setSelected={setSelected} />
      {error && <div style={{ color: 'red', marginBottom: 16 }}>Fehler: {error}</div>}
      <div className={blogStyles.blogGrid}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post: any) => (
            <div className={blogStyles.blogCard} key={post.id}>
              <div className={blogStyles.blogImageContainer}>
                <img
                  src={post.coverImage || placeholderImg}
                  alt={post.title}
                  className={blogStyles.blogImage}
                  loading="lazy"
                />
              </div>
              <div className={blogStyles.blogContent}>
                <h2 className={blogStyles.blogTitle}>{post.title}</h2>
                <div className={blogStyles.blogCardLine} />
                <div className={blogStyles.blogMetaRow}>
                  {post.tags && post.tags.split(';').filter((t: string) => t.trim()).map((tag: string, i: number) => (
                    <span key={i} className={blogStyles.blogTag}>{tag.trim()}</span>
                  ))}
                </div>
                <div className={blogStyles.blogCardLine} />
                <div className={blogStyles.blogMetaRow}>
                  <span className={blogStyles.blogDate}>{new Date(post.publishedAt).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  {post.author && (
                    <span className={blogStyles.blogAuthor}>{post.author}</span>
                  )}
                </div>
                <div
                  className={blogStyles.blogExcerpt}
                  dangerouslySetInnerHTML={{ __html: (post.excerpt || "").replace(/\n/g, "<br>") }}
                />
                <Link className={blogStyles.blogReadMore} href={`/blog/${post.slug}`}>
                  Weiterlesen
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: '#888', marginTop: 32, fontSize: 18 }}>Keine Blogposts gefunden.</div>
        )}
      </div>
    </main>
  );
}
