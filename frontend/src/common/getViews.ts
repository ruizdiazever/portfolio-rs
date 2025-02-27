import { API_URL } from "astro:env/client";

export async function getVisitRequest(projectId: string): Promise<number> {
  const apiUrl = API_URL;
  const url =
    !apiUrl.startsWith("http://") && !apiUrl.startsWith("https://")
      ? `http://${apiUrl}/visit/${projectId}`
      : `${apiUrl}/visit/${projectId}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      try {
        const data = await response.json();
        return data.visits || 0;
      } catch (err) {
        console.log("Failed to parse JSON response:", err);
        return 0;
      }
    } else {
      console.log("Error during the visit request:", response.status);
      return 0;
    }
  } catch (err) {
    console.log("GET request failed in getVisitRequest:", err);
    return 0;
  }
}
