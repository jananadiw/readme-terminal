import HomeTemplate from "@/components/templates/HomeTemplate";
import { getBlogPreviewArticles } from "@/lib/blogContent";

export default async function Home() {
  const blogArticles = await getBlogPreviewArticles();

  return <HomeTemplate blogArticles={blogArticles} />;
}
