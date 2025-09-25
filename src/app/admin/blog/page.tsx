// Admin-Blogverwaltung: Übersicht & Management aller Blogposts
"use client";
import { useEffect, useState, useRef } from "react";
import { fetchBlogPosts } from '@/lib/baserow';
import Link from 'next/link';
import AdminBlogTable from './AdminBlogTable';
import AuthCheck from "../../components/AuthCheck";
import AdminNav from "../AdminNav";
import styles from "../admin.module.css";

export default function AdminBlogPage() {
  const [data, setData] = useState({ results: [] });

  const loadedRef = useRef(false);
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    fetchBlogPosts({ draft: null }).then(setData);
  }, []);

  // Blogposts-Array flexibel extrahieren
  const posts = Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : [];
  const publishedPosts = posts.filter((p:any)=>p.isDraft==='0'||p.isDraft===0);
  const draftPosts = posts.filter((p:any)=>p.isDraft==='1'||p.isDraft===1);

  return (
    <AuthCheck requiredRole="admin">
      <div className={styles.container}>
        <div className={styles.adminNavContainer}>
  <AdminNav />
</div>
<h1 className={styles.adminTitle} style={{ 
          textAlign: 'center', 
          width: '100%', 
          display: 'block',
          marginBottom: '24px'
        }}>Blog verwalten</h1>
        <main style={{ alignItems:'center', maxWidth: 900, margin: '0 auto', padding: 0 }}>

        <Link href="/admin/blog/create" style={{
          display: 'inline-block',
          background: '#00e1ff',
          color: '#fff',
          fontWeight: 600,
          borderRadius: 14,
          padding: '10px 26px',
          marginBottom: 0,
          textDecoration: 'none',
          fontSize: 18,
          boxShadow: '0 2px 8px rgba(0,225,255,0.09)',
          transition: 'background 0.18s, color 0.18s'
        }}>Neuen Blogpost anlegen</Link>
        <h2 style={{fontSize:22,margin:'32px 0 12px'}}>Veröffentlichte Blogposts</h2>
        <AdminBlogTable posts={publishedPosts} mode="published" />
        <h2 style={{fontSize:22,margin:'42px 0 12px'}}>Entwürfe</h2>
        <AdminBlogTable posts={draftPosts} mode="draft" />
      </main>
      </div>
    </AuthCheck>
  );
}
