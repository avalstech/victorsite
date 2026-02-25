"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { dataClient } from "@/lib/amplify/data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pager } from "@/components/site/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type Case = Awaited<ReturnType<typeof dataClient.models.CaseStudy.list>>["data"][number];

export default function PortfolioPage() {
  const [q, setQ] = useState("");
  const [industry, setIndustry] = useState<string | "">("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Case[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [prevTokens, setPrevTokens] = useState<string[]>([]);

  const load = useCallback(async (token: string | null, direction: "next" | "prev") => {
    setLoading(true);
    try {
      const filter: any = { status: { eq: "PUBLISHED" } };
      if (q.trim()) filter.or = [{ title: { contains: q } }, { summary: { contains: q } }, { tags: { contains: q } }];
      if (industry) filter.industry = { eq: industry };

      const res = await dataClient.models.CaseStudy.list({ filter, limit: 10, nextToken: token ?? undefined });
      setItems(res.data ?? []);
      setNextToken(res.nextToken ?? null);
      if (direction === "next" && token) setPrevTokens((p) => [...p, token]);
      if (direction === "prev") setPrevTokens((p) => p.slice(0, -1));
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load case studies");
    } finally {
      setLoading(false);
    }
  }, [q, industry]);

  useEffect(() => { load(null, "next"); }, [load]);
  useEffect(() => {
    const t = setTimeout(() => load(null, "next"), 250);
    return () => clearTimeout(t);
  }, [q, industry, load]);

  const industries = useMemo(() => Array.from(new Set(items.map((c) => c.industry).filter(Boolean) as string[])).slice(0, 10), [items]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Case Studies</h1>
          <p className="mt-2 text-slate-600">Deep dives into outcomes, architecture, and delivery.</p>
        </div>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search case studies…" />
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setIndustry("")} className={`rounded-full border px-3 py-1 text-xs ${industry === "" ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 hover:bg-slate-50"}`}>All industries</button>
        {industries.map((i) => (
          <button key={i} onClick={() => setIndustry(i)} className={`rounded-full border px-3 py-1 text-xs ${industry === i ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 hover:bg-slate-50"}`}>{i}</button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-5/6" />
              <Skeleton className="mt-4 h-6 w-1/3" />
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-10 text-center text-slate-600">No case studies found.</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((c) => (
            <Link key={c.id} href={`/portfolio/${c.slug}`}>
              <Card className="p-5 hover:bg-slate-50 transition">
                <div className="text-xs font-semibold text-brand-700">{c.industry}</div>
                <div className="mt-1 text-lg font-semibold">{c.title}</div>
                <div className="mt-2 line-clamp-2 text-sm text-slate-600">{c.summary}</div>
                <div className="mt-3 flex flex-wrap gap-2">{(c.tags ?? []).slice(0, 5).map((t) => <Badge key={t}>{t}</Badge>)}</div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Pager
        hasPrev={prevTokens.length > 0}
        hasNext={!!nextToken}
        onPrev={() => load(prevTokens[prevTokens.length - 1] ?? null, "prev")}
        onNext={() => load(nextToken, "next")}
      />
    </div>
  );
}
