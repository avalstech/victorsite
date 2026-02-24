"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search, Menu } from "lucide-react";
import { useState } from "react";
import { GlobalSearchDialog } from "./search-dialog";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Case Studies" },
  { href: "/blog", label: "Insights" },
  { href: "/speaking", label: "Speaking/Press" },
  { href: "/contact", label: "Contact" }
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white font-semibold">V</span>
            <span className="font-semibold tracking-tight text-slate-900">Victor Udoka Anene</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50",
                  pathname === l.href && "bg-slate-100 text-slate-900"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden md:inline-flex" onClick={() => setSearchOpen(true)}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Link href="/book" className="hidden md:inline-flex">
              <Button>Book a Call</Button>
            </Link>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 md:hidden"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <div className="mx-auto max-w-6xl px-4 py-3">
              <div className="grid gap-1">
                <button
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => {
                    setSearchOpen(true);
                    setOpen(false);
                  }}
                >
                  <Search className="h-4 w-4" /> Search
                </button>
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50",
                      pathname === l.href && "bg-slate-100 text-slate-900"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
                <Link href="/book" onClick={() => setOpen(false)}>
                  <Button className="w-full">Book a Call</Button>
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
