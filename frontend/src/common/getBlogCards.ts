import { z } from "zod";
import postsData from "$lib/assets/posts.json";

const postSchema = z.object({
  id: z.string().uuid(),
  author: z.array(z.string()),
  home: z.boolean(),
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
  active: z.boolean(),
});

const blogDataSchema = z.object({
  posts: z.array(postSchema),
});

type Post = z.infer<typeof postSchema>;

export async function getPostsFromJson(): Promise<Post[]> {
  const result = blogDataSchema.safeParse(postsData);
  if (!result.success) {
    throw new Error(
      `Invalid JSON structure for posts.json: ${result.error.message}`,
    );
  }
  const activePosts = result.data.posts.filter((post: Post) => post.active);
  return activePosts;
}
