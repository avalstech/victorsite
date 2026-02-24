import Link from "next/link";
import { dataClient } from "@/lib/amplify/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const res = await dataClient.models.Service.list({ filter: { isActive: { eq: true } }, limit: 50 });
  const services = res.data ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Services</h1>
          <p className="mt-2 text-slate-600">Engagements designed for velocity, clarity, and outcomes.</p>
        </div>
        <Link href="/book"><Button size="lg">Book a Call</Button></Link>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {services.map((s) => (
          <Card key={s.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold">{s.name}</div>
                <div className="mt-1 text-sm text-slate-600">{s.shortDescription}</div>
                <div className="mt-3 text-sm font-semibold">{s.priceRange}</div>
              </div>
              <Badge className="bg-brand-50 border-brand-200 text-brand-800">{s.category}</Badge>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-700">
                {(s.features ?? []).slice(0, 8).map((f) => <li key={f}>• {f}</li>)}
              </ul>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link href="/contact"><Button>Hire Victor</Button></Link>
                <Link href="/portfolio"><Button variant="outline">View Case Studies</Button></Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {services.length === 0 ? <div className="rounded-2xl bg-slate-50 p-10 text-slate-600">No services yet.</div> : null}
      </div>
    </div>
  );
}
