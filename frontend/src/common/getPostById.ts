import { z } from "zod";
import postsData from "$lib/assets/posts.json";

export const postSchema = z.object({
  id: z.uuid(),
  author: z.array(z.string()),
  pinned: z.boolean(),
  active: z.boolean(),
  url: z.string().startsWith("/"),
  title: z.object({
    en: z.string(),
    zh: z.string(),
  }),
  description: z.object({
    en: z.string(),
    zh: z.string(),
  }),
  readTime: z.number().int().min(1),
  tags: z.array(z.string()),
  date: z.coerce.date(),
});

const blogDataSchema = z.object({
  posts: z.array(postSchema),
});

type Post = z.infer<typeof postSchema>;

export async function getPost(id: string): Promise<Post | undefined> {
  const result = blogDataSchema.safeParse(postsData);
  if (!result.success) {
    throw new Error(
      `Invalid JSON structure for posts.json: ${result.error.message}`,
    );
  }
  const post = result.data.posts.find((post: Post) => post.id === id);
  return post;
}
