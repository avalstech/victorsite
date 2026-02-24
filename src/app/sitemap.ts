import { MetadataRoute } from "next";
import { site } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/about", "/services", "/portfolio", "/blog", "/speaking", "/contact", "/book"];
  return routes.map((r) => ({ url: `${site.url}${r}`, lastModified: new Date() }));
}
