import EditBlogPostPage from "./EditBlogPostClient";

export default async function EditBlogPage(props: { params: { id: string } }) {
  const { id } = await Promise.resolve(props.params);
  const token = process.env.NEXT_PUBLIC_BASEROW_TOKEN || "";
  return <EditBlogPostPage id={id} token={token} />;
}

