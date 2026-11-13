import { postServerVisit } from "./serverApi";

export async function postVisitRequest(projectId: string): Promise<number> {
  try {
    const { visits } = await postServerVisit(projectId);
    return Number.isFinite(visits) ? visits : 0;
  } catch {
    return 0;
  }
}
