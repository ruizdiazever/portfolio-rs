import { z } from "zod";
import organizationsData from "$lib/assets/organizations.json";

const urlsSchema = z.object({
  rustSponsors: z.string().url(),
  rustFoundation: z.string().url(),
  rustLang: z.string().url(),
  crates: z.string().url(),
});

const organizationSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  founded: z.number(),
  industry: z.string(),
  description: z.string(),
  country: z.string(),
  market: z.boolean(),
  sponsor: z.string(),
  source: z.string(),
});

const rootSchema = z.object({
  urls: urlsSchema,
  organizations: z.array(organizationSchema),
});

type Organization = z.infer<typeof organizationSchema>;
export type RootData = z.infer<typeof rootSchema>;

export async function getOrganizations(): Promise<RootData> {
  const result = rootSchema.safeParse(organizationsData);

  if (!result.success) {
    throw new Error(`Invalid JSON structure: ${result.error.message}`);
  }
  return result.data;
}
