import { paraglideMiddleware } from "./paraglide/server.js";
import { defineMiddleware } from "astro:middleware";

const agentLinkHeader = [
    '</llms.txt>; rel="describedby"',
    '</agent.md>; rel="alternate"; type="text/markdown"',
    '</agent.json>; rel="alternate"; type="application/json"',
].join(", ");

export const onRequest = defineMiddleware(async (context, next) => {
    const response = await paraglideMiddleware(context.request, () => next());

    if (response.headers.get("content-type")?.includes("text/html")) {
        response.headers.set("Link", agentLinkHeader);
    }

    return response;
});
