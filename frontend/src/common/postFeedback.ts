import { API_URL } from "astro:env/client";
import { fetchJson } from "./api";

export async function postFeedback(
  id: string,
  reaction: number,
  msg: string,
  title: string,
  language: string,
): Promise<boolean> {
  try {
    await fetchJson(
      `${API_URL}/feedback`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, reaction, msg, title, language }),
      },
      10_000,
    );
    return true;
  } catch {
    return false;
  }
}
