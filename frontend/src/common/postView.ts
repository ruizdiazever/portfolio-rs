import { API_URL } from "astro:env/client";

export async function postVisitRequest(projectId: string): Promise<number> {
  const apiUrl = API_URL;

  const url =
    !apiUrl.startsWith("http://") && !apiUrl.startsWith("https://")
      ? `http://${apiUrl}/visit`
      : `${apiUrl}/visit`;

  const body = {
    project_id: projectId,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      try {
        const data = await response.json();
        return data.visits ?? 0;
      } catch (err) {
        console.log(`Failed to parse JSON response: ${err}`);
        return 0;
      }
    } else {
      console.log(
        `Error during the visit POST request: ${response.status} in URL ${url}`,
      );
      return 0;
    }
  } catch (err) {
    console.log(`POST request failed in postVisitRequest: ${err}`);
    return 0;
  }
}
