import { z } from "zod";
import postsData from "$lib/assets/posts.json";
import { postSchema } from "./getPostById";

const blogDataSchema = z.object({
  posts: z.array(postSchema),
});

type Post = z.infer<typeof postSchema>;

let cache: Post[] | undefined;

export function getPosts(): Post[] {
  if (cache) return cache;

  const result = blogDataSchema.safeParse(postsData);
  if (!result.success) {
    throw new Error(
      `Invalid JSON structure for posts.json: ${result.error.message}`,
    );
  }

  cache = result.data.posts.filter((post) => post.active);
  return cache;
}
