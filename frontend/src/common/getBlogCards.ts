import fs from "fs/promises";
import path from "path";
import { z } from "zod";

const postSchema = z.object({
  id: z.string().uuid(),
  author: z.array(z.string()),
  home: z.boolean(),
  url: z.string().startsWith("/"),
  title: z.string(),
  description: z.string(),
  readtime: z.number().int().min(1),
  tags: z.array(z.string()),
  date: z.coerce.date(),
  active: z.boolean(),
});

const blogDataSchema = z.object({
  posts: z.array(postSchema),
});

type Post = z.infer<typeof postSchema>;

export async function getPostsFromJson(language: string): Promise<Post[]> {
  const filePath = path.join(
    process.cwd(),
    "src",
    "assets",
    "blog",
    `${language}.json`,
  );
  const rawData = await fs.readFile(filePath, "utf-8");
  const parsedData = JSON.parse(rawData);
  const result = blogDataSchema.safeParse(parsedData);
  if (!result.success) {
    throw new Error(
      `Invalid JSON structure for ${language}.json: ${result.error.message}`,
    );
  }
  const activePosts = result.data.posts.filter((post: Post) => post.active);
  return activePosts;
}
