import { z } from "zod";
import fs from "fs/promises";
import path from "path";

const projectSchema = z.object({
  id: z.string().uuid(),
  humanId: z.string(),
  author: z.array(z.string()),
  home: z.boolean(),
  url: z.string().startsWith("/"),
  title: z.string(),
  description: z.string(),
  readtime: z.number().int().min(0),
  tags: z.array(z.string()),
  icons: z.array(z.string()),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const projectDataSchema = z.object({
  posts: z.array(projectSchema),
});

type Project = z.infer<typeof projectSchema>;

export async function getProjectsFromJson(
  language: string,
): Promise<Project[]> {
  const filePath = path.join(
    process.cwd(),
    "src",
    "assets",
    "project",
    `${language}.json`,
  );
  const rawData = await fs.readFile(filePath, "utf-8");
  const parsedData = JSON.parse(rawData);

  const result = projectDataSchema.safeParse(parsedData);

  if (!result.success) {
    throw new Error(`Invalid JSON structure: ${result.error.message}`);
  }
  return result.data.posts;
}
