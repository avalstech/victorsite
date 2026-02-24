import { dataClient } from "@/lib/amplify/data";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LikeBookmark } from "@/components/site/like-bookmark";

export const dynamic = "force-dynamic";

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const res = await dataClient.models.CaseStudy.list({ filter: { slug: { eq: params.slug }, status: { eq: "PUBLISHED" } }, limit: 1 });
  const cs = res.data?.[0];
  if (!cs) return <div className="rounded-2xl bg-slate-50 p-10 text-slate-700">Case study not found.</div>;

  const sections = cs.sections ?? [];

  return (
    <div className="space-y-6">
      <div className="text-xs font-semibold text-brand-700">{cs.industry}</div>
      <h1 className="text-4xl font-semibold tracking-tight">{cs.title}</h1>
      <p className="text-slate-600">{cs.summary}</p>
      <div className="flex flex-wrap gap-2">{(cs.tags ?? []).map((t) => <Badge key={t}>{t}</Badge>)}</div>

      <div className="flex flex-wrap gap-2">
        {(cs.techStack ?? []).slice(0, 10).map((t) => <Badge key={t} className="bg-brand-50 border-brand-200 text-brand-800">{t}</Badge>)}
      </div>

      <LikeBookmark contentType="CASE" contentId={cs.id} />

      <div className="grid gap-3 md:grid-cols-3">
        {(cs.metrics ?? []).slice(0, 6).map((m, i) => (
          <Card key={i} className="p-5">
            <div className="text-xs text-slate-600">{m.label}</div>
            <div className="mt-1 text-xl font-semibold">{m.value}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <article className="prose prose-slate max-w-none">
          {sections.map((s: any, i: number) => (
            <section key={i} className="mb-8">
              <h2>{s.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: s.bodyHtml }} />
            </section>
          ))}
        </article>
      </Card>
    </div>
  );
}
