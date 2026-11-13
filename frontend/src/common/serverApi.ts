import { API_URL } from "astro:env/client";
import { fetchJson } from "./api";

const baseUrl = process.env.INTERNAL_API_URL ?? API_URL;

export interface VisitResponse {
  visits: number;
}

export async function getServerVisit(projectId: string): Promise<VisitResponse> {
  return fetchJson<VisitResponse>(`${baseUrl}/visit/${projectId}`, {}, 2_000);
}

export async function postServerVisit(projectId: string): Promise<VisitResponse> {
  return fetchJson<VisitResponse>(
    `${baseUrl}/visit`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: projectId }),
    },
    2_000,
  );
}
