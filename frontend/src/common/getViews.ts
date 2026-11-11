import { API_URL } from "astro:env/client";

// Runtime server env (not astro:env: server+public fields are inlined at build).
const serverApiUrl = process.env.INTERNAL_API_URL ?? API_URL;
const TTL = 60 * 1000;
const cache = new Map<string, { at: number; visits: number }>();

export async function getVisitRequest(
  projectId: string,
): Promise<{ projectId: string; visits: number }> {
  const cached = cache.get(projectId);
  if (cached && Date.now() - cached.at < TTL) {
    return { projectId, visits: cached.visits };
  }

  const endpoint = `${serverApiUrl}/visit/${projectId}`;

  try {
    const response = await fetch(endpoint, {
      signal: AbortSignal.timeout(2_000),
    });
    if (!response.ok) return { projectId, visits: cached?.visits ?? 0 };

    const data = await response.json();
    const visits = Number(data.visits) || 0;
    cache.set(projectId, { at: Date.now(), visits });
    return { projectId, visits };
  } catch (err) {
    console.log("GET request failed in getVisitRequest:", err);
    return { projectId, visits: cached?.visits ?? 0 };
  }
}
