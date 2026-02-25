import type { Metadata } from "next";
import "./../styles/globals.css";
import { Nav } from "@/components/site/nav";
import { Providers } from "./providers";
import { AnalyticsTracker } from "@/components/site/analytics";
import { Footer } from "@/components/site/footer";
import { AppToaster } from "@/components/toaster";
import { site, jsonLdPerson } from "@/lib/seo";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    images: [{ url: site.ogImage, width: 1200, height: 630 }],
    locale: "en_US",
    type: "website"
  },
  robots: { index: true, follow: true },
  alternates: { canonical: site.url }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
        <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson()) }} />
      </head>
      <body>
        {/* Client Providers */}
        
        
        {/* <Providers> */}
        <AnalyticsTracker />
        <Nav />
        <div id="app" className="min-h-screen">
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <Footer />
        </div>
        {/* </Providers> */}
        <AppToaster />
      </body>
    </html>
  );
}
