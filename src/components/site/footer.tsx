import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Mail, Twitter, Youtube } from "lucide-react";

const socials = [
  { href: "https://www.linkedin.com/in/anenevictor", label: "LinkedIn", icon: Linkedin },
  { href: "https://github.com/", label: "GitHub", icon: Github },
  { href: "https://twitter.com/", label: "X", icon: Twitter },
  { href: "https://youtube.com/", label: "YouTube", icon: Youtube },
  { href: "mailto:hello@victoranene.com", label: "Email", icon: Mail }
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white font-semibold">V</span>
              <div className="font-semibold">Victor Udoka Anene</div>
              <Badge>Product • Fullstack • AWS</Badge>
            </div>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              Product leadership and engineering execution for teams that want measurable outcomes.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {socials.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Icon className="h-4 w-4" />
                  {s.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Victor Udoka Anene. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-700">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-700">Terms</Link>
            <Link href="/admin" className="hover:text-slate-700">Admin</Link>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/2340000000000"
        target="_blank"
        className="fixed bottom-5 right-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-white shadow-soft hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-green-300"
        aria-label="WhatsApp"
      >
        <span className="text-lg font-bold">WA</span>
      </a>
    </footer>
  );
}
