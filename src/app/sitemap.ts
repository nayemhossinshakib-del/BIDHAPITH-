import type { MetadataRoute } from "next";
import { db } from "@/db";
import { schools } from "@/db/schema";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const staticPages = ["", "/pricing", "/features", "/about", "/contact"].map((p) => ({
    url: `${base}${p || "/"}`,
  }));
  let schoolPages: MetadataRoute.Sitemap = [];
  try {
    schoolPages = db.select().from(schools).all().map((s) => ({ url: `${base}/s/${s.slug}` }));
  } catch {
    schoolPages = [];
  }
  return [...staticPages, ...schoolPages];
}
