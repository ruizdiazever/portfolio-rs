import type { IconNode } from "morphicons/astro";

export const languageIcons = {
    zh: [
        ["rect", { x: "5", y: "5", width: "14", height: "14", rx: "2" }],
        ["path", { d: "M12 2v20" }],
    ] satisfies IconNode,
    en: [
        ["path", { d: "M5 20 12 4l7 16" }],
        ["path", { d: "M8 14h8" }],
    ] satisfies IconNode,
};
