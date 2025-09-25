"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./adminBlog.module.css";

export default function AdminBlogTable({ posts: initialPosts, mode }: { posts: any[], mode: "draft" | "published" }) {
  const [posts, setPosts] = useState(initialPosts);
  // Synchronisiere posts-State mit Props!
  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!window.confirm("Diesen Blogpost wirklich löschen?")) return;
    setLoading(id);
    setError(null);
    try {
      const res = await fetch("/api/admin/deleteBlogPost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error(await res.text());
      setPosts(posts.filter((p) => p.id !== id));
    } catch (e: any) {
      setError(e.message || "Fehler beim Löschen");
    }
    setLoading(null);
  }

  return (
    <div style={{marginTop: 18, width: '100%'}}>
      {error && <div className={styles.adminBlogError}>{error}</div>}
      {posts.length > 0 ? (
        <div className={styles.adminBlogTableContainer}>
          <table className={styles.adminBlogTable}>
            <thead>
              <tr>
                <th>Titel</th>
                <th>Kategorie</th>
                <th>Status</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post: any) => (
                <tr key={post.id}>
                  <td data-label="Titel">{post.title}</td>
                  <td data-label="Kategorie">{post.category||'-'}</td>
                  <td data-label="Status">
                    {post.isDraft === '1' || post.isDraft === 1 ? 'Entwurf' : 'Veröffentlicht'}
                  </td>
                  <td data-label="Aktionen">
                    <Link 
                      href={`/admin/blog/edit/${post.id}`} 
                      className={styles.adminBlogActionLink}
                    >
                      Bearbeiten
                    </Link>
                    <button 
                      onClick={() => handleDelete(post.id)} 
                      className={styles.adminBlogDeleteButton}
                      disabled={loading === post.id}
                    >
                      {loading === post.id ? "Lösche..." : "Löschen"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.adminBlogEmpty}>
          {mode === "draft" ? "Keine Entwürfe vorhanden." : "Keine veröffentlichten Blogposts."}
        </div>
      )}
    </div>
  );
}
