import { z } from "zod";
import fs from "fs/promises";
import path from "path";

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
  const filePath = path.join(
    process.cwd(),
    "src",
    "assets",
    "technologies.json",
  );
  const rawData = await fs.readFile(filePath, "utf-8");
  const parsedData = JSON.parse(rawData);

  const result = technologiesSchema.safeParse(parsedData);

  if (!result.success) {
    throw new Error(`Invalid JSON structure: ${result.error.message}`);
  }
  return result.data.technologies;
}
