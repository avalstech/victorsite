import { dataClient } from "@/lib/amplify/data";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LikeBookmark } from "@/components/site/like-bookmark";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const res = await dataClient.models.BlogPost.list({ filter: { slug: { eq: params.slug }, status: { eq: "PUBLISHED" } }, limit: 1 });
  const post = res.data?.[0];
  if (!post) {
    return <div className="rounded-2xl bg-slate-50 p-10 text-slate-700">Post not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-xs font-semibold text-brand-700">{post.category}</div>
      <h1 className="text-4xl font-semibold tracking-tight">{post.title}</h1>
      <p className="text-slate-600">{post.excerpt}</p>
      <div className="flex flex-wrap gap-2">{(post.tags ?? []).map((t) => <Badge key={t}>{t}</Badge>)}</div>

      <LikeBookmark contentType="BLOG" contentId={post.id} />

      <Card className="p-6">
        <article className="prose prose-slate max-w-none">
          {/* Stored as rich text/MDX string */}
          <div dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
        </article>
      </Card>
    </div>
  );
}
