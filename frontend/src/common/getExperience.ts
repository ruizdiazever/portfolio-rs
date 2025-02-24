import { z } from "zod";
import path from "path";
import fs from "fs/promises";

const entrySchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable(),
  position: z.string(),
  company: z.string(),
  url: z.string().url(),
  description: z.string(),
  current: z.boolean(),
});

const entriesDataSchema = z.object({
  entries: z.array(entrySchema),
});

type Entry = z.infer<typeof entrySchema>;

export async function getEntriesFromJson(language: string): Promise<Entry[]> {
  const filePath = path.join(
    process.cwd(),
    "src",
    "assets",
    "experience",
    `${language}.json`,
  );
  const rawData = await fs.readFile(filePath, "utf-8");
  const parsedData = JSON.parse(rawData);
  const result = entriesDataSchema.safeParse(parsedData);
  if (!result.success) {
    throw new Error(`Invalid JSON structure: ${result.error.message}`);
  }
  return result.data.entries;
}
