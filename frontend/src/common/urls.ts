import { getLocale } from "@paraglide/runtime";

export function getUrls() {
  const locale = getLocale();
  return {
    about: `/${locale}/sections/about`,
    cv: `/${locale}/sections/cv`,
    books: `/${locale}/sections/books`,
    contact: `/${locale}/sections/contact`,
    home: `/${locale}`,
    articles: `/${locale}/blog/articles`,
  };
}
