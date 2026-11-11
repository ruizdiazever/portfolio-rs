import type { APIRoute } from "astro";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { satoriAstroOG } from "satori-astro";
import { html } from "satori-html";
import { getOgContent } from "$lib/common/og";

export const prerender = false;

const WIDTH = 1200;
const HEIGHT = 630;
const require = createRequire(import.meta.url);

type Font = {
    name: string;
    data: Buffer;
    weight: 400;
    style: "normal";
};

let fontsPromise: Promise<Font[]> | undefined;

function loadFonts(): Promise<Font[]> {
    fontsPromise ??= Promise.all([
        readFile(
            require.resolve(
                "@fontsource-variable/eb-garamond/files/eb-garamond-latin-wght-normal.woff2",
            ),
        ),
        readFile(
            require.resolve(
                "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
            ),
        ),
    ]).then(([garamond, inter]) => [
        {
            name: "EB Garamond",
            data: garamond,
            weight: 400 as const,
            style: "normal" as const,
        },
        {
            name: "Inter",
            data: inter,
            weight: 400 as const,
            style: "normal" as const,
        },
    ]);

    return fontsPromise;
}

export const GET: APIRoute = async ({ params }) => {
    const key = String(params.slug ?? "home").replace(/\.png$/i, "");
    const content = await getOgContent(key);
    const fonts = await loadFonts();

    const kicker = content.kicker.toUpperCase();
    const titleSize =
        content.title.length > 52 ? 52 : content.title.length > 34 ? 62 : 76;
    const description =
        content.description.length > 170
            ? `${content.description.slice(0, 167).trimEnd()}…`
            : content.description;

    const template = html`<div
        style="width:1200px;height:630px;display:flex;flex-direction:column;justify-content:space-between;padding:64px 72px;background-color:#fafafa;color:#171717;box-sizing:border-box;"
    >
        <div
            style="display:flex;align-items:center;justify-content:space-between;font-family:Inter;font-size:18px;color:#737373;letter-spacing:0.08em;"
        >
            <div style="display:flex;align-items:center;">
                <div
                    style="width:10px;height:10px;border-radius:999px;background-color:#96513c;margin-right:12px;"
                ></div>
                <div>EVER RUIZ DIAZ</div>
            </div>
            <div>PORTFOLIO</div>
        </div>

        <div
            style="display:flex;flex:1;flex-direction:column;justify-content:center;"
        >
            <div style="display:flex;align-items:center;margin-bottom:26px;">
                <div
                    style="width:48px;height:2px;background-color:#96513c;margin-right:16px;"
                ></div>
                <div
                    style="font-family:Inter;font-size:18px;color:#96513c;letter-spacing:0.08em;"
                >
                    ${kicker}
                </div>
            </div>
            <div
                style="font-family:'EB Garamond';font-size:${titleSize}px;line-height:1.05;letter-spacing:-0.02em;color:#171717;max-width:1000px;"
            >
                ${content.title}
            </div>
            <div
                style="font-family:'EB Garamond';font-size:27px;line-height:1.45;color:#525252;margin-top:24px;max-width:940px;"
            >
                ${description}
            </div>
        </div>

        <div
            style="display:flex;align-items:center;justify-content:space-between;font-family:Inter;font-size:18px;color:#737373;"
        >
            <div>${content.footer}</div>
            <div>EVERDEV.IT</div>
        </div>
    </div>`;

    return satoriAstroOG({ template, width: WIDTH, height: HEIGHT }).toResponse({
        satori: { fonts },
        response: {
            headers: {
                "Cache-Control": "public, max-age=3600",
            },
        },
    });
};
