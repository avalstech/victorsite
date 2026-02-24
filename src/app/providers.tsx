"use client";
import { useEffect } from "react";
import { configureAmplify } from "@/lib/amplify/config";
import { toast } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    configureAmplify().catch((e) => toast.error(e.message));
  }, []);
  return <>{children}</>;
}
