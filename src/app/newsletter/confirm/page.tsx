"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { dataClient } from "@/lib/amplify/data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function NewsletterConfirmPage() {
  const sp = useSearchParams();
  const email = sp.get("email") ?? "";
  const token = sp.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    (async () => {
      try {
        if (!email || !token) throw new Error("Missing confirmation parameters");
        const res = await dataClient.models.NewsletterSubscriber.get({ id: email.toLowerCase() });
        const s = res.data;
        if (!s || s.token !== token) throw new Error("Invalid confirmation link");
        await dataClient.models.NewsletterSubscriber.update({
          id: s.id,
          status: "CONFIRMED",
          confirmedAt: new Date().toISOString()
        });
        setStatus("ok");
      } catch (e: any) {
        toast.error(e?.message ?? "Confirmation failed");
        setStatus("error");
      }
    })();
  }, [email, token]);

  return (
    <div className="mx-auto max-w-xl">
      <Card className="p-8 text-center">
        {status === "loading" ? (
          <div className="text-slate-700">Confirming…</div>
        ) : status === "ok" ? (
          <>
            <div className="text-2xl font-semibold">You’re subscribed.</div>
            <p className="mt-2 text-slate-600">Welcome. You’ll receive the next issue soon.</p>
            <div className="mt-6 flex justify-center gap-2">
              <Link href="/"><Button>Go home</Button></Link>
              <Link href="/blog"><Button variant="outline">Read insights</Button></Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-2xl font-semibold">Confirmation failed.</div>
            <p className="mt-2 text-slate-600">The link may be invalid or expired. Try subscribing again.</p>
            <div className="mt-6 flex justify-center gap-2">
              <Link href="/contact"><Button>Back to Contact</Button></Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
