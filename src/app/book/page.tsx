import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BookPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Book a Call</h1>
      <p className="text-slate-600">Choose a time that works. If you have a brief, include it in the booking notes.</p>

      <Card>
        <CardHeader><div className="text-sm font-semibold">Calendar</div></CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-700">
            Connect your calendar tool of choice (Calendly, Google Appointment Schedule, etc.) by replacing the link below.
          </div>
          <a href="https://calendly.com/" target="_blank">
            <Button size="lg">Open Booking Link</Button>
          </a>
          <div className="text-xs text-slate-500">Tip: use UTM parameters so you can track conversions in Analytics.</div>
          <Link href="/contact" className="text-sm font-medium">Prefer email? Contact me →</Link>
        </CardContent>
      </Card>
    </div>
  );
}
