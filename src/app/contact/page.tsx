"use client";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { dataClient } from "@/lib/amplify/data";
import { uploadData } from "aws-amplify/storage";
import { getCurrentUser } from "aws-amplify/auth";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  inquiryType: z.enum(["Product Management", "Fullstack/AWS Consulting", "Speaking", "Startup Collaboration", "Other"]),
  message: z.string().min(20),
  company: z.string().optional(),
  budget: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export default function ContactPage() {
  const [file, setFile] = useState<File | null>(null);
  const [subEmail, setSubEmail] = useState("");
  const [subLoading, setSubLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { inquiryType: "Product Management" }
  });

  const submit = async (values: FormValues) => {
    try {
      const user = await getCurrentUser().catch(() => null);
      let attachmentKey: string | undefined;

      if (file) {
        const okTypes = ["application/pdf", "image/png", "image/jpeg"];
        if (!okTypes.includes(file.type)) throw new Error("Only PDF, PNG, or JPG allowed");
        if (file.size > 10 * 1024 * 1024) throw new Error("File too large (max 10MB)");
        const key = `inquiries/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        await uploadData({ path: key, data: file, options: { contentType: file.type } }).result;
        attachmentKey = key;
      }

      await dataClient.models.Lead.create({
        name: values.name,
        email: values.email,
        inquiryType: values.inquiryType,
        message: values.message,
        company: values.company ?? "",
        budget: values.budget ?? "",
        attachmentKey: attachmentKey ?? "",
        status: "NEW",
        source: "website",
        userId: user?.userId ?? ""
      });

      // trigger email via backend function (Amplify custom function) by writing an Outbox record
      await dataClient.models.Outbox.create({
        type: "CONTACT_CONFIRMATION",
        payloadJson: JSON.stringify({ email: values.email, name: values.name, inquiryType: values.inquiryType }),
        status: "PENDING"
      });

      toast.success("Sent. You'll get a confirmation email shortly.");
      form.reset();
      setFile(null);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to send");
    }
  };

  const subscribe = async () => {
    setSubLoading(true);
    try {
      const email = subEmail.trim().toLowerCase();
      if (!email) throw new Error("Email required");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email");

      // Create pending subscriber with token. Lambda will email confirm link.
      const token = crypto.randomUUID();
      await dataClient.models.NewsletterSubscriber.upsert({
        id: email,
        email,
        status: "PENDING",
        token,
        confirmedAt: "",
        unsubscribedAt: ""
      });

      await dataClient.models.Outbox.create({
        type: "NEWSLETTER_CONFIRM",
        payloadJson: JSON.stringify({ email, token }),
        status: "PENDING"
      });

      toast.success("Almost done. Check your email to confirm subscription.");
      setSubEmail("");
    } catch (e: any) {
      toast.error(e?.message ?? "Subscription failed");
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-7">
          <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
          <p className="mt-2 text-slate-600">Share what you’re building and what “success” looks like. I’ll respond with next steps.</p>

          <Card className="mt-6">
            <CardHeader><div className="text-sm font-semibold">Inquiry Form</div></CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(submit)} className="grid gap-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-slate-700">Name</label>
                    <Input {...form.register("name")} />
                    <p className="mt-1 text-xs text-red-600">{form.formState.errors.name?.message}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700">Email</label>
                    <Input {...form.register("email")} />
                    <p className="mt-1 text-xs text-red-600">{form.formState.errors.email?.message}</p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-slate-700">Company (optional)</label>
                    <Input {...form.register("company")} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700">Budget (optional)</label>
                    <Input {...form.register("budget")} placeholder="$5k-$15k" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">Inquiry type</label>
                  <select
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none ring-brand-300 focus:ring-2"
                    {...form.register("inquiryType")}
                  >
                    <option>Product Management</option>
                    <option>Fullstack/AWS Consulting</option>
                    <option>Speaking</option>
                    <option>Startup Collaboration</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">Message</label>
                  <Textarea {...form.register("message")} placeholder="What are you building, what’s stuck, and what outcome do you want?" />
                  <p className="mt-1 text-xs text-red-600">{form.formState.errors.message?.message}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">Attach a brief (optional: PDF/PNG/JPG, max 10MB)</label>
                  <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </div>

                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Sending…" : "Send message"}
                </Button>
                <div className="text-xs text-slate-500">
                  You’ll receive a confirmation email. For urgent requests, use the WhatsApp button.
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-5">
          <Card>
            <CardHeader><div className="text-sm font-semibold">Newsletter</div></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-600">1 email per week. No spam. Practical product + AWS insights.</p>
              <Input value={subEmail} onChange={(e) => setSubEmail(e.target.value)} placeholder="you@company.com" />
              <Button onClick={subscribe} disabled={subLoading}>{subLoading ? "Submitting…" : "Sign up"}</Button>
              <p className="text-xs text-slate-500">Double opt-in required. You can unsubscribe anytime.</p>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader><div className="text-sm font-semibold">Direct Links</div></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <a className="font-medium" href="https://calendly.com/" target="_blank">Calendar booking</a>
              <div className="text-slate-600">Email: hello@victoranene.com</div>
              <div className="text-slate-600">LinkedIn: /in/anenevictor</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
