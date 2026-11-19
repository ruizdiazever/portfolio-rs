import * as m from "@paraglide/messages.js";
import type { FaqEntry } from "$lib/common/schema";

/**
 * The questions the site answers about itself. The visible list and the
 * FAQPage JSON-LD read this one source, so the markup can never describe a
 * question the page does not show.
 */
export function faqEntries(): FaqEntry[] {
  return [
    { question: m.faqQ1(), answer: m.faqA1() },
    { question: m.faqQ2(), answer: m.faqA2() },
    { question: m.faqQ3(), answer: m.faqA3() },
    { question: m.faqQ4(), answer: m.faqA4() },
  ];
}
