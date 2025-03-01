import { API_URL } from "astro:env/client";

export async function postFeedback(
  id: string,
  reaction: number,
  msg: string,
  title: string,
  language: string,
): Promise<boolean> {
  let endpoint = `${API_URL}/feedback`;
  const body = {
    id,
    reaction,
    msg,
    title,
    language,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return true;
    } else {
      console.log(
        `Error during the visit POST request: ${response.status} in URL ${endpoint}`,
      );
      return false;
    }
  } catch (err) {
    console.log(`POST request failed in postVisitRequest: ${err}`);
    return false;
  }
}
