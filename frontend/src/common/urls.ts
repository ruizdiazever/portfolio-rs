import { getLocale } from "@paraglide/runtime";

export function getUrls() {
  const locale = getLocale();
  return {
    about: `/${locale}/sections/about`,
    cv: `/${locale}/sections/cv`,
    library: `/${locale}/sections/library`,
    libraryDefault: `/${locale}/sections/library?filter=technical`,
    contact: `/${locale}/sections/contact`,
    privacy: `/${locale}/sections/privacy`,
    home: `/${locale}`,
    articles: `/${locale}/blog/articles`,
  };
}
