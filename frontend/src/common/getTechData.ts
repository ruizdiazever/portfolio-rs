import { z } from "zod";
import technologiesData from "$lib/assets/technologies.json";

const technologySchema = z.object({
  name: z.string(),
  description: z.object({
    en: z.string(),
    zh: z.string(),
  }),
  url: z.url(),
});

const technologiesSchema = z.object({
  technologies: z.record(z.string(), technologySchema),
});

export type Technology = z.infer<typeof technologySchema>;

let cache: Record<string, Technology> | undefined;

export function getTechnologiesFromJson(): Record<string, Technology> {
  if (cache) return cache;

  const result = technologiesSchema.safeParse(technologiesData);
  if (!result.success) {
    throw new Error(`Invalid JSON structure: ${result.error.message}`);
  }

  cache = result.data.technologies;
  return cache;
}
