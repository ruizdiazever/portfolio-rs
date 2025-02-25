import { z } from "zod";
import fs from "fs/promises";
import path from "path";

const projectSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  author: z.array(z.string()),
  home: z.boolean(),
  url: z.string().startsWith("/"),
  title: z.string(),
  repository: z.string(),
  description: z.object({
    en: z.string(),
    zh: z.string(),
  }),
  readtime: z.number().int().min(0),
  tech: z.array(z.string()),
  tags: z.array(z.string()),
  date: z.coerce.date(),
});

const projectDataSchema = z.object({
  posts: z.array(projectSchema),
});

type Project = z.infer<typeof projectSchema>;

export async function getProjectsFromJson(): Promise<Project[]> {
  const filePath = path.join(process.cwd(), "src", "assets", "projects.json");
  const rawData = await fs.readFile(filePath, "utf-8");
  const parsedData = JSON.parse(rawData);

  const result = projectDataSchema.safeParse(parsedData);

  if (!result.success) {
    throw new Error(`Invalid JSON structure: ${result.error.message}`);
  }
  return result.data.posts;
}
