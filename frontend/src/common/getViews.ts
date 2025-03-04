import { API_URL } from "astro:env/client";

export async function getVisitRequest(
  projectId: string,
): Promise<{ projectId: string; visits: number }> {
  let endpoint = `${API_URL}/visit/${projectId}`;

  try {
    const response = await fetch(endpoint);
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
