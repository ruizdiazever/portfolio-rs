import { z } from "zod";
import postsData from "$lib/assets/posts.json";
import { postSchema } from "./getPostById";

const blogDataSchema = z.object({
  posts: z.array(postSchema),
});

type Post = z.infer<typeof postSchema>;

export async function getPosts(): Promise<Post[]> {
  const result = blogDataSchema.safeParse(postsData);
  if (!result.success) {
    throw new Error(
      `Invalid JSON structure for posts.json: ${result.error.message}`,
    );
  }
  const activePosts = result.data.posts.filter((post: Post) => post.active);
  return activePosts;
}
