"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EditBlogPostForm from "../EditBlogPostForm";

export default function EditBlogPostPage({ id, token }: { id: string, token: string }) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(
          `https://api.baserow.io/api/database/rows/table/539981/${id}/?user_field_names=true`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        if (!res.ok) {
          router.replace("/404");
          return;
        }
        const data = await res.json();
        setPost(data);
      } catch (e) {
        router.replace("/404");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id, token, router]);

  if (loading) return <div>Lade...</div>;
  if (!post) return null;

  return <EditBlogPostForm post={post} />;
}
