import type { APIRoute } from "astro";
import { agentsGuide, getAgentManifest } from "$lib/common/agent";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(agentsGuide(getAgentManifest("en")), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
