import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/school", "/teacher", "/accountant", "/student", "/api"] },
    sitemap: "/sitemap.xml",
  };
}
