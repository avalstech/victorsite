import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { dataClient } from "@/lib/amplify/data";
import { ArrowRight, Briefcase, Cloud, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

// async function getFeatured() {
//   const [cases, posts, services, testimonials] = await Promise.all([
//     dataClient.models.CaseStudy.list({ filter: { featured: { eq: true }, status: { eq: "PUBLISHED" } }, limit: 3 }),
//     dataClient.models.BlogPost.list({ filter: { featured: { eq: true }, status: { eq: "PUBLISHED" } }, limit: 3 }),
//     dataClient.models.Service.list({ filter: { isActive: { eq: true } }, limit: 6 }),
//     dataClient.models.Testimonial.list({ filter: { isActive: { eq: true } }, limit: 6 })
//   ]);
//   return {
//     cases: cases.data ?? [],
//     posts: posts.data ?? [],
//     services: services.data ?? [],
//     testimonials: testimonials.data ?? []
//   };
// }

export default async function HomePage() {
  // const { cases, posts, services, testimonials } = await getFeatured();
  const cases = [];
  const posts = [];
  const services = [];
  const testimonials = [];

  return (
    <div className="space-y-10">
      <section className="grid gap-6 md:grid-cols-12 md:items-center">
        <div className="md:col-span-7">
          <Badge className="border-brand-200 bg-brand-50 text-brand-800">Available for select engagements</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            I build products that convert, scale, and ship.
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Senior Product Manager and Fullstack/AWS Engineer. I help teams go from ambiguity to measurable outcomes,
            with a bias for execution.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/book"><Button size="lg">Book a Call</Button></Link>
            <Link href="/services"><Button size="lg" variant="outline">Hire Victor</Button></Link>
            <a href="/Victor_Udoka_Anene_CV.pdf" download><Button size="lg" variant="secondary">Download CV</Button></a>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4 text-brand-700" /> Product Strategy</div>
              <div className="mt-1 text-sm text-slate-600">Positioning, roadmaps, metrics, growth loops.</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm font-semibold"><Briefcase className="h-4 w-4 text-brand-700" /> Fullstack Delivery</div>
              <div className="mt-1 text-sm text-slate-600">Next.js, APIs, data, performance, DX.</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm font-semibold"><Cloud className="h-4 w-4 text-brand-700" /> AWS Architecture</div>
              <div className="mt-1 text-sm text-slate-600">Amplify Gen2, CDK, serverless, security.</div>
            </Card>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-soft">
            <Image src="/headshot.svg" alt="Victor Udoka Anene" width={900} height={900} className="h-auto w-full" priority />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
            <div className="rounded-2xl border border-slate-200 bg-white p-3"><div className="text-lg font-semibold text-slate-900">10+</div>Shipped MVPs</div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3"><div className="text-lg font-semibold text-slate-900">5+</div>Startups</div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3"><div className="text-lg font-semibold text-slate-900">AWS</div>Serverless</div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">Featured Case Studies</div>
                <div className="text-sm text-slate-600">Execution you can validate.</div>
              </div>
              <Link href="/portfolio" className="text-sm font-medium inline-flex items-center gap-1">View all <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            {cases.map((c) => (
              <Link key={c.id} href={`/portfolio/${c.slug}`} className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
                <div className="font-semibold">{c.title}</div>
                <div className="mt-1 line-clamp-2 text-sm text-slate-600">{c.summary}</div>
                <div className="mt-2 flex flex-wrap gap-2">{(c.tags ?? []).slice(0, 4).map((t) => <Badge key={t}>{t}</Badge>)}</div>
              </Link>
            ))}
            {cases.length === 0 ? <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">No featured case studies yet.</div> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">Latest Insights</div>
                <div className="text-sm text-slate-600">Signal over noise.</div>
              </div>
              <Link href="/blog" className="text-sm font-medium inline-flex items-center gap-1">Read more <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            {posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
                <div className="font-semibold">{p.title}</div>
                <div className="mt-1 line-clamp-2 text-sm text-slate-600">{p.excerpt}</div>
                <div className="mt-2 flex flex-wrap gap-2">{(p.tags ?? []).slice(0, 4).map((t) => <Badge key={t}>{t}</Badge>)}</div>
              </Link>
            ))}
            {posts.length === 0 ? <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">No posts yet.</div> : null}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-12 md:items-stretch">
        <Card className="md:col-span-7">
          <CardHeader>
            <div className="text-sm font-semibold text-slate-900">Services</div>
            <div className="text-sm text-slate-600">Pick a lane, I’ll run it with you.</div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {services.slice(0, 4).map((s) => (
              <div key={s.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="font-semibold">{s.name}</div>
                <div className="mt-1 text-sm text-slate-600">{s.shortDescription}</div>
                <div className="mt-3 text-sm font-semibold text-slate-900">{s.priceRange}</div>
              </div>
            ))}
            <Link href="/services" className="rounded-2xl border border-dashed border-slate-300 p-6 hover:bg-slate-50 flex items-center justify-center text-sm font-medium">
              View full catalog <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="md:col-span-5">
          <CardHeader>
            <div className="text-sm font-semibold text-slate-900">Testimonials</div>
            <div className="text-sm text-slate-600">Social proof that reads like outcomes.</div>
          </CardHeader>
          <CardContent className="grid gap-3">
            {testimonials.slice(0, 3).map((t) => (
              <div key={t.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="text-sm text-slate-700">“{t.quote}”</div>
                <div className="mt-2 text-xs font-semibold text-slate-900">{t.name}</div>
                <div className="text-xs text-slate-600">{t.title}</div>
              </div>
            ))}
            <Link href="/contact" className="rounded-2xl bg-slate-900 p-6 text-white hover:opacity-95">
              <div className="text-sm font-semibold">Ready to move?</div>
              <div className="mt-1 text-sm text-white/80">Tell me your goal. I’ll respond with a plan and next steps.</div>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">Start a conversation <ArrowRight className="h-4 w-4" /></div>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
