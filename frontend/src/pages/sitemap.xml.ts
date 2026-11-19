import type { APIRoute } from "astro";
import { seoConfig } from "$lib/common/seoConfig";
import { sitemapUrlSet } from "$lib/common/siteRoutes";

export const GET: APIRoute = () =>
  new Response(sitemapUrlSet(seoConfig.baseURL), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
