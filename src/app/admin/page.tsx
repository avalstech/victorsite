"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { signInWithRedirect, signOut } from "aws-amplify/auth";
import { currentUser, hasRole } from "@/lib/auth";
import { dataClient } from "@/lib/amplify/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

type Stats = {
  leadsNew: number;
  subsConfirmed: number;
  topPages: { path: string; count: number }[];
};

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<Stats>({ leadsNew: 0, subsConfirmed: 0, topPages: [] });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const cu = await currentUser();
      if (!cu) {
        setIsAuthed(false);
        setIsAdmin(false);
        return;
      }
      setIsAuthed(true);
      setIsAdmin(hasRole(cu.groups, "Editor"));

      if (!hasRole(cu.groups, "Editor")) return;

      const [leads, subs, pages] = await Promise.all([
        dataClient.models.Lead.list({ filter: { status: { eq: "NEW" } }, limit: 200 }),
        dataClient.models.NewsletterSubscriber.list({ filter: { status: { eq: "CONFIRMED" } }, limit: 200 }),
        dataClient.models.PageView.list({ limit: 200 })
      ]);

      const agg = new Map<string, number>();
      (pages.data ?? []).forEach((p) => agg.set(p.path, (agg.get(p.path) ?? 0) + 1));
      const topPages = Array.from(agg.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([path, count]) => ({ path, count }));

      setStats({ leadsNew: (leads.data ?? []).length, subsConfirmed: (subs.data ?? []).length, topPages });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const login = async () => {
    await signInWithRedirect({ provider: "Google" }).catch(() => signInWithRedirect());
  };

  const logout = async () => {
    await signOut();
    toast.success("Signed out");
    await load();
  };

  if (loading) return <div className="rounded-2xl bg-slate-50 p-10 text-slate-600">Loading…</div>;

  if (!isAuthed) {
    return (
      <Card className="p-8">
        <div className="text-2xl font-semibold">Admin Dashboard</div>
        <p className="mt-2 text-slate-600">Sign in to manage site content and analytics.</p>
        <div className="mt-6 flex gap-2">
          <Button onClick={login}>Sign in</Button>
          <Link href="/"><Button variant="outline">Back home</Button></Link>
        </div>
      </Card>
    );
  }

  if (!isAdmin) {
    return (
      <Card className="p-8">
        <div className="text-2xl font-semibold">Access denied</div>
        <p className="mt-2 text-slate-600">Your account does not have Editor/Admin permissions.</p>
        <div className="mt-6 flex gap-2">
          <Button onClick={logout} variant="outline">Sign out</Button>
          <Link href="/"><Button>Back home</Button></Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-slate-600">Content, leads, newsletter, and analytics.</p>
        </div>
        <Button variant="outline" onClick={logout}>Sign out</Button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card className="p-5">
          <div className="text-xs text-slate-600">New leads</div>
          <div className="mt-1 text-3xl font-semibold">{stats.leadsNew}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-600">Newsletter subscribers</div>
          <div className="mt-1 text-3xl font-semibold">{stats.subsConfirmed}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-600">Top pages</div>
          <div className="mt-2 space-y-1 text-sm">
            {stats.topPages.map((p) => (
              <div key={p.path} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <span className="font-medium">{p.path}</span>
                <span className="text-slate-600">{p.count}</span>
              </div>
            ))}
            {stats.topPages.length === 0 ? <div className="text-slate-500">No data yet.</div> : null}
          </div>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <AdminCrud title="Blog Posts" model="BlogPost" />
        <AdminCrud title="Case Studies" model="CaseStudy" />
        <AdminCrud title="Services" model="Service" />
        <AdminCrud title="Testimonials" model="Testimonial" />
      </div>

      <AdminLeads />
      <AdminOutbox />
    </div>
  );
}

function AdminCrud({ title, model }: { title: string; model: "BlogPost" | "CaseStudy" | "Service" | "Testimonial" }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await (dataClient.models as any)[model].list({ limit: 50 });
    setItems(res.data ?? []);
    setLoading(false);
  }, [model]);

  useEffect(() => { load(); }, [load]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="text-sm font-semibold">{title}</div>
        <Button size="sm" onClick={() => setOpen((v) => !v)}>{open ? "Hide" : "Manage"}</Button>
      </CardHeader>
      <CardContent>
        {loading ? <div className="text-sm text-slate-600">Loading…</div> : null}
        {!loading && !open ? <div className="text-sm text-slate-600">{items.length} items</div> : null}
        {!loading && open ? (
          <div className="space-y-2">
            {items.map((it) => (
              <div key={it.id} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold">{it.title ?? it.name}</div>
                    <div className="text-xs text-slate-600">{it.status ?? it.category ?? ""}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={async () => {
                      await (dataClient.models as any)[model].delete({ id: it.id });
                      await dataClient.models.AuditLog.create({ action: "DELETE", entity: model, entityId: it.id, metaJson: JSON.stringify({ title: it.title ?? it.name }) });
                      toast.success("Deleted");
                      load();
                    }}>Delete</Button>
                  </div>
                </div>
              </div>
            ))}
            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              Create/edit is done via quick JSON import below for speed. (Still validated + audited.)
            </div>
            <JsonUpsert model={model} onDone={load} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function JsonUpsert({ model, onDone }: { model: any; onDone: () => void }) {
  const [jsonText, setJsonText] = useState("");
  const upsert = async () => {
    try {
      const obj = JSON.parse(jsonText);
      const res = await (dataClient.models as any)[model].upsert(obj);
      await dataClient.models.AuditLog.create({ action: "UPSERT", entity: model, entityId: res.data?.id ?? "", metaJson: JSON.stringify({}) });
      toast.success("Saved");
      setJsonText("");
      onDone();
    } catch (e: any) {
      toast.error(e?.message ?? "Invalid JSON");
    }
  };
  return (
    <div className="space-y-2">
      <textarea className="min-h-[140px] w-full rounded-xl border border-slate-200 p-3 text-xs font-mono" value={jsonText} onChange={(e) => setJsonText(e.target.value)} placeholder='{"id":"...","title":"..."}' />
      <Button onClick={upsert}>Upsert</Button>
    </div>
  );
}

function AdminLeads() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await dataClient.models.Lead.list({ limit: 100 });
    setItems((res.data ?? []).sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "")));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="text-sm font-semibold">Leads</div>
        <Button size="sm" variant="outline" onClick={load}>Refresh</Button>
      </CardHeader>
      <CardContent>
        {loading ? <div className="text-sm text-slate-600">Loading…</div> : null}
        {!loading && items.length === 0 ? <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">No leads yet.</div> : null}
        <div className="grid gap-2">
          {items.slice(0, 25).map((l) => (
            <div key={l.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="font-semibold">{l.name} <span className="text-slate-500 text-sm">({l.email})</span></div>
                  <div className="text-xs text-brand-700 font-semibold">{l.inquiryType} • {l.status}</div>
                  <div className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{l.message}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={async () => {
                    await dataClient.models.Lead.update({ id: l.id, status: "CONTACTED" });
                    await dataClient.models.AuditLog.create({ action: "UPDATE", entity: "Lead", entityId: l.id, metaJson: JSON.stringify({ status: "CONTACTED" }) });
                    toast.success("Marked contacted");
                    load();
                  }}>Mark contacted</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AdminOutbox() {
  const [items, setItems] = useState<any[]>([]);
  const load = async () => {
    const res = await dataClient.models.Outbox.list({ limit: 50 });
    setItems((res.data ?? []).sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "")));
  };
  useEffect(() => { load(); }, []);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="text-sm font-semibold">Email Outbox</div>
        <Button size="sm" variant="outline" onClick={load}>Refresh</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {items.map((o) => (
            <div key={o.id} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{o.type}</div>
                <div className="text-xs text-slate-600">{o.status}</div>
              </div>
              <div className="mt-1 text-xs text-slate-600 line-clamp-2">{o.payloadJson}</div>
            </div>
          ))}
          {items.length === 0 ? <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">No outbox jobs.</div> : null}
        </div>
      </CardContent>
    </Card>
  );
}
