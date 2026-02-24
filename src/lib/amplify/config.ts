import { Amplify } from "aws-amplify";

/**
 * Loads Amplify outputs at runtime.
 * In Amplify Hosting, NEXT_PUBLIC_AMPLIFY_OUTPUTS_URL is auto-injected if you set it.
 * Locally, you can generate amplify_outputs.json via `amplify pull`.
 */
export async function configureAmplify() {
  if (typeof window === "undefined") return;
  if ((globalThis as any).__amplifyConfigured) return;

  const url = process.env.NEXT_PUBLIC_AMPLIFY_OUTPUTS_URL;
  const local = process.env.NEXT_PUBLIC_AMPLIFY_OUTPUTS_LOCAL === "true";

  let outputs: any;
  if (local) {
    outputs = (await import("../../../amplify_outputs.json")).default;
  } else if (url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load Amplify outputs");
    outputs = await res.json();
  } else {
    // Fallback: local file if present
    try {
      outputs = (await import("../../../amplify_outputs.json")).default;
    } catch {
      throw new Error("Amplify outputs not found. Run `amplify pull` or set NEXT_PUBLIC_AMPLIFY_OUTPUTS_URL.");
    }
  }

  Amplify.configure(outputs, { ssr: true });
  (globalThis as any).__amplifyConfigured = true;
}
