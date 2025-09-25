export const dynamic = "force-dynamic";

import { fetchBlogPosts } from '@/lib/baserow';
import BlogList from './BlogList';

export default async function BlogPage() {
  let posts = [];
  try {
    const data = await fetchBlogPosts();
    posts = data.results || [];
  } catch (e) {
    posts = [];
  }
  return <BlogList posts={posts} />;
}
