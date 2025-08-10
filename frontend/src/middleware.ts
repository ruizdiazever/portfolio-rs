import { paraglideMiddleware } from "./paraglide/server.js";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
    return paraglideMiddleware(context.request, () => next());
});