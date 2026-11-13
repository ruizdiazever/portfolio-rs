import type { APIRoute } from "astro";
import { getAgentManifest } from "$lib/common/agent";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(JSON.stringify(getAgentManifest("en"), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
