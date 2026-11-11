import svelte from "@astrojs/svelte";
import { defineConfig, envField } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import { seoConfig } from "./src/common/seoConfig";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import mdx from "@astrojs/mdx";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import icon from "astro-icon";
import playformCompress from "@playform/compress";
import rehypeClassNames from "rehype-class-names";
import { remarkReadingTime } from "./remark-reading-time.mjs";

export default defineConfig({
  markdown: {
    processor: unified({
      remarkPlugins: [remarkReadingTime],
      rehypePlugins: [
        [
          rehypeClassNames,
          {
            h1: "blog-content-title",
            h2: "blog-content-subtitle",
            h3: "blog-content-features-title",
            p: "blog-content-paragraph",
            table: "blog-content-table",
            thead: "blog-content-table-head",
            tbody: "blog-content-table-body",
            tr: "blog-content-table-row",
            th: "blog-content-table-header",
            td: "blog-content-table-cell",
            ul: "blog-content-features-list",
            li: "blog-content-features-item",
            strong: "blog-content-features-strong",
          },
        ],
      ],
    }),
  },
  vite: {
    server: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:3002",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    plugins: [
      tailwindcss({
        applyBaseStyles: false,
      }),
      paraglideVitePlugin({
        project: "./project.inlang",
        outdir: "./src/paraglide",
        strategy: ["url", "cookie", "preferredLanguage", "baseLocale"],
        urlPatterns: [
          {
            pattern: "/:path(.*)?",
            localized: [
              ["en", "/en/:path(.*)?"],
              ["zh", "/zh/:path(.*)?"],
            ],
          },
        ],
      }),
    ],
  },
  adapter: node({
    mode: "standalone",
  }),
  output: "server",
  server: { port: 4321, host: true },
  site: seoConfig.baseURL,
  devToolbar: {
    enabled: false,
  },
  build: {
    inlineStylesheets: "auto",
  },
  compressHTML: true,
  integrations: [
    svelte(),
    mdx(),
    icon(),
    playformCompress({
      CSS: true,
      HTML: true,
      Image: true,
      JavaScript: true,
      SVG: true,
    }),
  ],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  redirects: {
    "/": {
      status: 302,
      destination: "/en",
    },
  },
  security: {
    checkOrigin: true,
  },
  env: {
    schema: {
      API_URL: envField.string({
        context: "client",
        access: "public",
        optional: false,
      }),
      GITHUB_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
    },
  },
});
