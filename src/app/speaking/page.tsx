import Link from "next/link";
import { dataClient } from "@/lib/amplify/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function SpeakingPage() {
  const talks = await dataClient.models.Talk.list({ limit: 50 });
  const items = (talks.data ?? []).sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Speaking & Press</h1>
          <p className="mt-2 text-slate-600">Talks, workshops, and press assets.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <a href="/press-kit.zip"><Button variant="outline">Download Press Kit</Button></a>
          <Link href="/contact"><Button>Invite Victor</Button></Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold">Talks</div>
          <div className="text-sm text-slate-600">Topics: product strategy, zero-to-one systems, AWS serverless, founder velocity.</div>
        </CardHeader>
        <CardContent className="grid gap-3">
          {items.map((t) => (
            <div key={t.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="font-semibold">{t.title}</div>
                  <div className="mt-1 text-sm text-slate-600">{t.eventName} • {t.location}</div>
                  <div className="mt-2 text-sm text-slate-700">{t.summary}</div>
                </div>
                <div className="flex items-center gap-2">
                  {t.date ? <Badge>{t.date}</Badge> : null}
                  {t.videoUrl ? <a className="text-sm font-medium" href={t.videoUrl} target="_blank">Video</a> : null}
                  {t.slidesUrl ? <a className="text-sm font-medium" href={t.slidesUrl} target="_blank">Slides</a> : null}
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 ? <div className="rounded-2xl bg-slate-50 p-10 text-slate-600">No talks yet.</div> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><div className="text-sm font-semibold">Press Kit</div></CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-700">
          <div>• Headshots, bios, logos, and one-pager.</div>
          <div>• Quick links, contact info, and social handles.</div>
          <div className="pt-2"><a href="/press-kit.zip"><Button>Download Press Kit</Button></a></div>
        </CardContent>
      </Card>
    </div>
  );
}
