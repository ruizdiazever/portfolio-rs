import type { APIRoute } from "astro";
import { getAgentManifest, llmsText } from "$lib/common/agent";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(llmsText(getAgentManifest("en")), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
