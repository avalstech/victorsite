import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dataClient } from "@/lib/amplify/data";

export const dynamic = "force-dynamic";

async function getAbout() {
  const settings = await dataClient.models.SiteSettings.get({ id: "global" });
  return settings.data;
}

export default async function AboutPage() {
  const s = await getAbout();

  const timeline = (s?.timeline ?? [
    { year: "2018", title: "Started building", text: "Self-taught, shipping real projects and learning in public." },
    { year: "2021", title: "Product leadership", text: "Owning roadmaps, experimentation, and delivery outcomes." },
    { year: "2024", title: "AWS + Fullstack", text: "Production systems, serverless workflows, secure deployments." }
  ]) as any[];

  const skills = (s?.skills ?? ["Product Strategy", "PRDs & Roadmaps", "Next.js", "TypeScript", "AWS Amplify Gen2", "DynamoDB", "Lambda", "Go-to-Market"]) as string[];
  const values = (s?.values ?? ["Clarity over hype", "Systems > heroics", "Outcomes > output", "Security by default"]) as string[];

  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-12 md:items-center">
        <div className="md:col-span-7">
          <h1 className="text-4xl font-semibold tracking-tight">About Victor</h1>
          <p className="mt-3 text-lg text-slate-600">
            I’m a self-taught builder and product leader. I help teams turn messy problem spaces into clean, shippable systems.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.slice(0, 10).map((k) => <Badge key={k}>{k}</Badge>)}
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-soft">
            <Image src="/about.svg" alt="About" width={900} height={900} className="h-auto w-full" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><div className="text-sm font-semibold">Values</div></CardHeader>
          <CardContent className="space-y-2">
            {values.map((v) => <div key={v} className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">{v}</div>)}
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader><div className="text-sm font-semibold">Story Timeline</div></CardHeader>
          <CardContent className="grid gap-3">
            {timeline.map((t) => (
              <div key={t.year} className="rounded-2xl border border-slate-200 p-4">
                <div className="text-xs font-semibold text-brand-700">{t.year}</div>
                <div className="mt-1 font-semibold">{t.title}</div>
                <div className="mt-1 text-sm text-slate-600">{t.text}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><div className="text-sm font-semibold">Badges & Certifications</div></CardHeader>
          <CardContent className="grid gap-2">
            {(s?.badges ?? ["AWS (Serverless)", "Product Management", "Security-first delivery"]).map((b: string) => (
              <div key={b} className="rounded-2xl border border-slate-200 p-4 text-sm">{b}</div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><div className="text-sm font-semibold">Media Mentions</div></CardHeader>
          <CardContent className="grid gap-2">
            {(s?.mediaMentions ?? ["LinkedIn thought leadership", "Startup collaborations", "Community talks"]).map((m: string) => (
              <div key={m} className="rounded-2xl border border-slate-200 p-4 text-sm">{m}</div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
