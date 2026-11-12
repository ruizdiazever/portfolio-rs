import type { APIRoute } from "astro";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { experimental_getFontFileURL, fontData } from "astro:assets";
import { satoriAstroOG } from "satori-astro";
import { html } from "satori-html";
import { getOgContent } from "$lib/common/og";

export const prerender = false;

const WIDTH = 1200;
const HEIGHT = 630;

type Font = {
    name: string;
    data: ArrayBuffer;
    weight: 400 | 600;
    style: "normal";
};

let fontsPromise: Promise<Font[]> | undefined;

async function readFont(
    sourceUrl: string,
    requestUrl: URL,
): Promise<ArrayBuffer> {
    const name = sourceUrl.split("/").pop() ?? "";
    const candidates = [
        join(process.cwd(), "dist", "client", sourceUrl),
        join(process.cwd(), ".astro", "fonts", name),
    ];

    for (const file of candidates) {
        try {
            const data = await readFile(file);
            return data.buffer.slice(
                data.byteOffset,
                data.byteOffset + data.byteLength,
            ) as ArrayBuffer;
        } catch {
            // Try the next location, then the runtime URL.
        }
    }

    const response = await fetch(
        experimental_getFontFileURL(sourceUrl, requestUrl),
    );
    if (!response.ok) {
        throw new Error(`Unable to load Inter: ${response.status}`);
    }

    return response.arrayBuffer();
}

async function loadFonts(requestUrl: URL): Promise<Font[]> {
    fontsPromise ??= (async () => {
        const faces = fontData["--font-inter"];
        const variable =
            faces?.find((face) => face.weight?.includes(" ")) ?? faces?.[0];
        const source =
            variable?.src.find((entry) => entry.format === "woff2") ??
            variable?.src[0];

        if (!source) {
            throw new Error("Inter is not registered in the Astro font config.");
        }

        const data = await readFont(source.url, requestUrl);
        return [
            { name: "Inter", data, weight: 400, style: "normal" },
            { name: "Inter", data, weight: 600, style: "normal" },
        ];
    })();

    return fontsPromise;
}

export const GET: APIRoute = async ({ params, url }) => {
    const key = String(params.slug ?? "home").replace(/\.png$/i, "");
    const content = await getOgContent(key);
    const fonts = await loadFonts(url);

    const kicker = content.kicker.toUpperCase();
    const titleSize =
        content.title.length > 52 ? 50 : content.title.length > 34 ? 58 : 68;
    const description =
        content.description.length > 170
            ? `${content.description.slice(0, 167).trimEnd()}…`
            : content.description;

    const template = html`<div
        style="width:1200px;height:630px;display:flex;flex-direction:column;justify-content:space-between;padding:64px 72px;background-color:#08090a;color:#ffffff;box-sizing:border-box;"
    >
        <div
            style="display:flex;align-items:center;justify-content:space-between;font-family:Inter;font-size:17px;font-weight:500;color:#8a8f98;letter-spacing:0.09em;"
        >
            <div style="display:flex;align-items:center;">
                <div
                    style="width:10px;height:10px;border-radius:999px;background-color:#d0d6e0;margin-right:12px;"
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
                    style="width:48px;height:2px;background-color:#d0d6e0;margin-right:16px;"
                ></div>
                <div
                    style="font-family:Inter;font-size:17px;font-weight:500;color:#8a8f98;letter-spacing:0.09em;"
                >
                    ${kicker}
                </div>
            </div>
            <div
                style="font-family:Inter;font-size:${titleSize}px;font-weight:600;line-height:1.04;letter-spacing:-0.022em;color:#ffffff;max-width:1000px;"
            >
                ${content.title}
            </div>
            <div
                style="font-family:Inter;font-size:26px;font-weight:400;line-height:1.45;letter-spacing:-0.01em;color:#d0d6e0;margin-top:24px;max-width:940px;"
            >
                ${description}
            </div>
        </div>

        <div
            style="display:flex;align-items:center;justify-content:space-between;font-family:Inter;font-size:17px;font-weight:400;color:#8a8f98;"
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
