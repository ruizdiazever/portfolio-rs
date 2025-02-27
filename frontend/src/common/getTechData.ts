import { z } from "zod";
import technologiesData from "$lib/assets/technologies.json";

const technologySchema = z.object({
  name: z.string(),
  description: z.object({
    en: z.string(),
    zh: z.string(),
  }),
  url: z.string().url(),
});

const technologiesSchema = z.object({
  technologies: z.record(z.string(), technologySchema),
});

type Technology = z.infer<typeof technologySchema>;

export async function getTechnologiesFromJson(): Promise<
  Record<string, Technology>
> {
  const result = technologiesSchema.safeParse(technologiesData);

  if (!result.success) {
    throw new Error(`Invalid JSON structure: ${result.error.message}`);
  }
  return result.data.technologies;
}
