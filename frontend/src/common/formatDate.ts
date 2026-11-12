import { getLocale } from "@paraglide/runtime";

export function formatMonth(date: Date): string {
    return new Intl.DateTimeFormat(getLocale() === "zh" ? "zh-CN" : "en-US", {
        month: "short",
        year: "numeric",
    }).format(date);
}
