import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT = path.join(ROOT, ".media-output");
const VERSION = "v1";
const OUT_VERSION = path.join(OUT, VERSION);

const FORMATS = {
  avif: { quality: 58, effort: 6 },
  webp: { quality: 82, effort: 5 },
  png: { compressionLevel: 9, palette: true },
};

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

async function responsive({ src, key, widths, fit = "inside", formats = ["avif", "webp"] }) {
  const input = path.join(ROOT, src);
  for (const width of widths) {
    for (const format of formats) {
      const dest = path.join(OUT_VERSION, `${key}-${width}.${format}`);
      ensureDir(dest);
      await sharp(input)
        .resize({ width, fit, withoutEnlargement: true })
        .toFormat(format, FORMATS[format])
        .toFile(dest);
    }
  }
}

async function single({ src, key, format = "png", width, height, fit = "inside", background }) {
  const dest = path.join(OUT_VERSION, key);
  ensureDir(dest);
  let pipeline = sharp(path.join(ROOT, src));
  if (width || height) {
    pipeline = pipeline.resize({ width, height, fit, background });
  }
  if (background) pipeline = pipeline.flatten({ background });
  await pipeline.toFormat(format, FORMATS[format]).toFile(dest);
}

function copy({ src, key }) {
  const dest = path.join(OUT_VERSION, key);
  ensureDir(dest);
  fs.copyFileSync(path.join(ROOT, src), dest);
}

async function maskable() {
  const dest = path.join(OUT_VERSION, "site/icons/icon-mask-512.png");
  ensureDir(dest);
  await sharp(path.join(ROOT, "media-src/site/icons/icon-512.png"))
    .resize(410, 410)
    .extend({ top: 51, bottom: 51, left: 51, right: 51, background: "#96513c" })
    .png()
    .toFile(dest);
}

const books = [
  ["media-src/books/foundation/1_im-robot.jpeg", "books/science-fiction/i-robot/cover"],
  ["media-src/books/foundation/2_the-caves-of-steel.jpg", "books/science-fiction/the-caves-of-steel/cover"],
  ["media-src/books/foundation/3_the-naked-sun.jpeg", "books/science-fiction/the-naked-sun/cover"],
  ["media-src/books/generic/theillustratedman.jpg", "books/science-fiction/the-illustrated-man/cover"],
  ["media-src/books/generic/loveinthetimeofcolera.jpg", "books/literary-fiction/love-in-the-time-of-cholera/cover"],
  ["media-src/books/generic/animalfarm.jpg", "books/political-satire/animal-farm/cover"],
  ["media-src/books/technical/deepseek.png", "books/technical-paper/deepseek-r1/cover"],
  ["media-src/books/generic/theclovenviscount.jpg", "books/fantasy/the-cloven-viscount/cover"],
  ["media-src/books/generic/elonmusk.jpg", "books/biography/elon-musk/cover"],
  ["media-src/books/technical/rustatomicsandlocks.jpg", "books/technical/rust-atomics-and-locks/cover"],
  ["media-src/books/technical/therustprogramminglanguage.jpg", "books/technical/the-rust-programming-language/cover"],
  ["media-src/books/technical/zerotoproductionrust.png", "books/technical/zero-to-production-in-rust/cover"],
  ["media-src/books/comics/batmanthedarkknightreturns.jpg", "books/comics/batman-the-dark-knight-returns/cover"],
  ["media-src/books/comics/doomsdayclock.jpg", "books/comics/doomsday-clock/cover"],
  ["media-src/books/comics/watchmen.jpg", "books/comics/watchmen/cover"],
  ["media-src/books/geralt/thelastwish.webp", "books/fantasy/the-last-wish/cover"],
  ["media-src/books/geralt/swordofdestiny.jpg", "books/fantasy/sword-of-destiny/cover"],
  ["media-src/books/geralt/bloodofelves.jpg", "books/fantasy/blood-of-elves/cover"],
  ["media-src/books/geralt/timeofcontempt.jpg", "books/fantasy/time-of-contempt/cover"],
  ["media-src/books/geralt/baptismoffire.jpg", "books/fantasy/baptism-of-fire/cover"],
  ["media-src/books/geralt/thetowerofswallows.jpg", "books/fantasy/the-tower-of-swallows/cover"],
  ["media-src/books/geralt/theladyofthelake.webp", "books/fantasy/the-lady-of-the-lake/cover"],
];

async function build() {
  fs.rmSync(OUT, { recursive: true, force: true });

  await responsive({
    src: "media-src/site/avatar.jpeg",
    key: "site/avatar",
    widths: [96, 192],
    fit: "cover",
  });
  await responsive({
    src: "media-src/site/about.avif",
    key: "site/about",
    widths: [800, 1600],
  });
  await responsive({
    src: "media-src/site/mascot.png",
    key: "site/mascot",
    widths: [96, 192],
  });
  await responsive({
    src: "media-src/site/authors/ever.webp",
    key: "site/authors/ever",
    widths: [44, 88],
    fit: "cover",
  });
  await responsive({
    src: "media-src/site/authors/maxi.avif",
    key: "site/authors/maxi",
    widths: [44, 88],
    fit: "cover",
  });

  await responsive({
    src: "media-src/blog/minisforum-ms-01/cover.avif",
    key: "blog/hardware/minisforum-ms-01/cover",
    widths: [400, 800, 1600],
  });
  await responsive({
    src: "media-src/blog/portfolio-wasm/grafana.webp",
    key: "blog/portfolio-wasm/grafana",
    widths: [1280],
    formats: ["webp"],
  });

  for (const [src, key] of books) {
    await responsive({ src, key, widths: [480] });
  }

  copy({ src: "media-src/site/icons/favicon.svg", key: "site/icons/favicon.svg" });
  copy({ src: "media-src/site/icons/favicon.ico", key: "site/icons/favicon.ico" });
  await single({ src: "media-src/site/icons/apple-touch-icon.png", key: "site/icons/apple-touch-icon.png", width: 180, height: 180 });
  await single({ src: "media-src/site/icons/icon-192.png", key: "site/icons/icon-192.png", width: 192, height: 192 });
  await single({ src: "media-src/site/icons/icon-512.png", key: "site/icons/icon-512.png", width: 512, height: 512 });
  await single({ src: "media-src/site/icons/ms-icon-70.png", key: "site/icons/ms-icon-70.png", width: 70, height: 70 });
  await single({ src: "media-src/site/icons/ms-icon-144.png", key: "site/icons/ms-icon-144.png", width: 144, height: 144 });
  await single({ src: "media-src/site/icons/ms-icon-150.png", key: "site/icons/ms-icon-150.png", width: 150, height: 150 });
  await single({ src: "media-src/site/icons/ms-icon-310.png", key: "site/icons/ms-icon-310.png", width: 310, height: 310 });
  await single({ src: "media-src/site/icons/dark.png", key: "site/icons/dark.png", width: 192, height: 192 });
  await maskable();

  const reactions = [
    ["0", "reaction-default"],
    ["1", "reaction-sad"],
    ["2", "reaction-neutral"],
    ["3", "reaction-happy"],
    ["4", "reaction-love"],
  ];
  for (const [file, key] of reactions) {
    await single({
      src: `media-src/feedback/${file}.png`,
      key: `feedback/${key}.png`,
      width: 80,
      height: 80,
    });
  }

  copy({ src: "media-src/blog/portfolio-wasm/architecture.svg", key: "blog/portfolio-wasm/architecture.svg" });

  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else files.push(full);
    }
  }
  walk(OUT_VERSION);
  const bytes = files.reduce((total, file) => total + fs.statSync(file).size, 0);
  console.log(`built ${files.length} objects (${(bytes / 1024 / 1024).toFixed(1)} MiB) in ${OUT_VERSION}`);

  if (process.argv.includes("--upload")) {
    const config = process.env.RCLONE_CONFIG;
    if (!config) throw new Error("RCLONE_CONFIG is required for --upload");
    const remote = process.env.MEDIA_REMOTE ?? "rustfs";
    const bucket = process.env.MEDIA_BUCKET ?? "portfolio";
    execFileSync(
      "rclone",
      [
        "--config", config,
        "copy", OUT_VERSION, `${remote}:${bucket}/${VERSION}`,
        "--checksum",
        "--header-upload", "Cache-Control: public, max-age=31536000, immutable",
      ],
      { stdio: "inherit" },
    );
    console.log(`uploaded ${VERSION}/ to ${remote}:${bucket}`);
  }
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
