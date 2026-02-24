"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { dataClient } from "@/lib/amplify/data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Pager } from "@/components/site/pagination";
import { toast } from "sonner";

type Post = Awaited<ReturnType<typeof dataClient.models.BlogPost.list>>["data"][number];

export default function BlogPage() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | "">("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Post[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [prevTokens, setPrevTokens] = useState<string[]>([]);

  const load = async (token: string | null, direction: "next" | "prev") => {
    setLoading(true);
    try {
      const filter: any = { status: { eq: "PUBLISHED" } };
      if (q.trim()) filter.or = [{ title: { contains: q } }, { excerpt: { contains: q } }, { tags: { contains: q } }];
      if (tag) filter.tags = { contains: tag };

      const res = await dataClient.models.BlogPost.list({
        filter,
        limit: 10,
        nextToken: token ?? undefined
      });

      setItems(res.data ?? []);
      setNextToken(res.nextToken ?? null);
      if (direction === "next" && token) setPrevTokens((p) => [...p, token]);
      if (direction === "prev") setPrevTokens((p) => p.slice(0, -1));
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(null, "next");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(null, "next"), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, tag]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    items.forEach((p) => (p.tags ?? []).forEach((t) => set.add(t)));
    return Array.from(set).slice(0, 12);
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Insights</h1>
          <p className="mt-2 text-slate-600">Actionable notes on product, delivery, and AWS.</p>
        </div>
        <div className="flex w-full gap-2 md:w-auto">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search posts…" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setTag("")} className={`rounded-full border px-3 py-1 text-xs ${tag === "" ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 hover:bg-slate-50"}`}>All</button>
        {allTags.map((t) => (
          <button key={t} onClick={() => setTag(t)} className={`rounded-full border px-3 py-1 text-xs ${tag === t ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 hover:bg-slate-50"}`}>{t}</button>
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
        <div className="rounded-2xl bg-slate-50 p-10 text-center text-slate-600">No posts found.</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`}>
              <Card className="p-5 hover:bg-slate-50 transition">
                <div className="text-xs font-semibold text-brand-700">{p.category}</div>
                <div className="mt-1 text-lg font-semibold">{p.title}</div>
                <div className="mt-2 line-clamp-2 text-sm text-slate-600">{p.excerpt}</div>
                <div className="mt-3 flex flex-wrap gap-2">{(p.tags ?? []).slice(0, 5).map((t) => <Badge key={t}>{t}</Badge>)}</div>
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
