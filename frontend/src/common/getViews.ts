import { API_URL } from "astro:env/client";

// Runtime server env (not astro:env: server+public fields are inlined at build).
const serverApiUrl = process.env.INTERNAL_API_URL ?? API_URL;

export async function getVisitRequest(
  projectId: string,
): Promise<{ projectId: string; visits: number }> {
  let endpoint = `${serverApiUrl}/visit/${projectId}`;

  try {
    const response = await fetch(endpoint, {
      signal: AbortSignal.timeout(2_000),
    });
    if (response.ok) {
      try {
        const data = await response.json();
        return {
          projectId,
          visits: data.visits || 0,
        };
      } catch (err) {
        console.log("Failed to parse JSON response:", err);
        return {
          projectId,
          visits: 0,
        };
      }
    } else {
      console.log("Error during the visit request:", response.status);
      return {
        projectId,
        visits: 0,
      };
    }
  } catch (err) {
    console.log("GET request failed in getVisitRequest:", err);
    return {
      projectId,
      visits: 0,
    };
  }
}
