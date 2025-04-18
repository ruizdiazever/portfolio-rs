import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(
  ({ cookies, url, redirect }, next) => {
    // Dynamic lang based on cookie value
    const supportedPrefixes = ["/en", "/zh"];
    const isPrefixedPath = supportedPrefixes.some((prefix) =>
      url.pathname.startsWith(prefix),
    );

    // Prefix language
    const urlsToHandle = [
      "/blog/hardware/minisforum-ms-01",
      "/blog/organizations-using-rust",
    ];

    if (
      !isPrefixedPath &&
      urlsToHandle.some((path) => url.pathname.startsWith(path))
    ) {
      const preferredLang = cookies.get("preferredLang")?.value || "en";
      const newUrl = `/${preferredLang}${url.pathname}`;
      cookies.set("preferredLang", preferredLang, {
        path: "/",
        sameSite: "lax",
      });
      return redirect(newUrl);
    }

    // Language detection
    if (isPrefixedPath) {
      const preferredLang = cookies.get("preferredLang")?.value || "en";
      const currentLang = url.pathname.split("/")[1];

      if (currentLang !== preferredLang) {
        const newUrl = `/${preferredLang}${url.pathname.slice(
          currentLang.length + 1,
        )}`;
        cookies.set("preferredLang", preferredLang, {
          path: "/",
          sameSite: "lax",
        });
        return redirect(newUrl);
      }
    }

    return next();
  },
);
