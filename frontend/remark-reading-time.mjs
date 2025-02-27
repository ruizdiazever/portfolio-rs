import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTimeEn = getReadingTime(textOnPage);
    const readingTimeZh = getReadingTime(textOnPage, {
      wordsPerMinute: 300, // Adjust WPM for Chinese
    });
    data.astro.frontmatter.minutesRead = {
      en: Math.ceil(readingTimeEn.minutes),
      zh: Math.ceil(readingTimeZh.minutes),
    };
  };
}
