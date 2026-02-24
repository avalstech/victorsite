"use client";
import { useEffect, useMemo, useState } from "react";
import { dataClient } from "@/lib/amplify/data";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Result = { type: "blog" | "case"; title: string; slug: string; excerpt?: string; tags?: string[] };

export function GlobalSearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);

  const canSearch = q.trim().length >= 2;

  const runSearch = async () => {
    if (!canSearch) return;
    setLoading(true);
    try {
      const [posts, cases] = await Promise.all([
        dataClient.models.BlogPost.list({
          filter: { or: [{ title: { contains: q } }, { excerpt: { contains: q } }, { tags: { contains: q } }] },
          limit: 6
        }),
        dataClient.models.CaseStudy.list({
          filter: { or: [{ title: { contains: q } }, { summary: { contains: q } }, { tags: { contains: q } }] },
          limit: 6
        })
      ]);

      const mapped: Result[] = [
        ...(posts.data ?? []).map((p) => ({ type: "blog", title: p.title, slug: p.slug, excerpt: p.excerpt ?? "", tags: p.tags ?? [] })),
        ...(cases.data ?? []).map((c) => ({ type: "case", title: c.title, slug: c.slug, excerpt: c.summary ?? "", tags: c.tags ?? [] }))
      ];

      setResults(mapped.slice(0, 10));
    } catch (e: any) {
      toast.error(e?.message ?? "Search failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    setQ("");
    setResults([]);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(runSearch, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 p-4">
      <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="flex items-center gap-2 border-b border-slate-200 p-4">
          <Search className="h-4 w-4 text-slate-500" />
          <Input
            autoFocus
            placeholder="Search blog + case studies…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search"
          />
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-50"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {!canSearch ? (
            <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">Type at least 2 characters.</div>
          ) : loading ? (
            <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">Searching…</div>
          ) : results.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">No results found.</div>
          ) : (
            <div className="grid gap-2">
              {results.map((r) => (
                <Link
                  key={`${r.type}:${r.slug}`}
                  href={r.type === "blog" ? `/blog/${r.slug}` : `/portfolio/${r.slug}`}
                  onClick={() => onOpenChange(false)}
                >
                  <Card className={cn("p-4 hover:bg-slate-50 transition")}>
                    <div className="text-xs font-semibold text-brand-700">{r.type === "blog" ? "Insight" : "Case Study"}</div>
                    <div className="mt-1 font-semibold">{r.title}</div>
                    {r.excerpt ? <div className="mt-1 line-clamp-2 text-sm text-slate-600">{r.excerpt}</div> : null}
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
