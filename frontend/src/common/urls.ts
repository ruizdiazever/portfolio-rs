import { getLocale } from "@paraglide/runtime";

export const urls = {
  about: `/${getLocale()}/sections/about`,
  cv: `/${getLocale()}/sections/cv`,
  books: `/${getLocale()}/sections/books`,
  contact: `/${getLocale()}/sections/contact`,
  home: `/${getLocale()}`,
  articles: `${getLocale()}/blog/articles`,
};
