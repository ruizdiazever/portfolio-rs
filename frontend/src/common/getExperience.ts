import { z } from "zod";
import experiencesData from "$lib/assets/experiences.json";

const entrySchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable(),
  position: z.object({
    en: z.string(),
    zh: z.string(),
  }),
  company: z.string(),
  url: z.string().url(),
  description: z.object({
    en: z.string(),
    zh: z.string(),
  }),
  current: z.boolean(),
});

const entriesDataSchema = z.object({
  entries: z.array(entrySchema),
});

type Entry = z.infer<typeof entrySchema>;

export async function getEntriesFromJson(): Promise<Entry[]> {
  const result = entriesDataSchema.safeParse(experiencesData);
  if (!result.success) {
    throw new Error(`Invalid JSON structure: ${result.error.message}`);
  }
  return result.data.entries;
}
