"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { dataClient } from "@/lib/amplify/data";

export function AnalyticsTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const run = async () => {
      try {
        await dataClient.models.PageView.create({ path: pathname, referrer: document.referrer ?? "", userAgent: navigator.userAgent ?? "" });
      } catch {
        // ignore
      }
    };
    run();
  }, [pathname]);
  return null;
}
