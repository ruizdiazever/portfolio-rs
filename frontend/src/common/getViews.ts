import { getServerVisit } from "./serverApi";

const TTL = 60 * 1000;
const cache = new Map<string, { at: number; visits: number }>();

export async function getVisitRequest(
  projectId: string,
): Promise<{ projectId: string; visits: number }> {
  const cached = cache.get(projectId);
  if (cached && Date.now() - cached.at < TTL) {
    return { projectId, visits: cached.visits };
  }

  try {
    const { visits } = await getServerVisit(projectId);
    const normalized = Number.isFinite(visits) ? visits : 0;
    cache.set(projectId, { at: Date.now(), visits: normalized });
    return { projectId, visits: normalized };
  } catch {
    return { projectId, visits: cached?.visits ?? 0 };
  }
}
