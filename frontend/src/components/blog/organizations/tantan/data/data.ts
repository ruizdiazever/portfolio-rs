import { z } from "zod";
import Heart from "lucide-svelte/icons/heart";
import Link from "lucide-svelte/icons/link";
import SquareMenu from "lucide-svelte/icons/square-menu";

export const orgSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  founded: z.number(),
  industry: z.string(),
  description: z.string(),
  country: z.string(),
  market: z.boolean(),
  sponsor: z.string(),
  source: z.string(),
});

export type Organization = z.infer<typeof orgSchema>;

export const iconData = [
  {
    key: "founder",
    icon: Heart,
    color: "text-red-500 fill-red-500",
    description: "Founder and Sponsor of Rust Foundation",
    title: "Founder",
  },
  {
    key: "platinum",
    icon: Heart,
    color: "text-blue-500 fill-blue-500",
    description: "Platinum Sponsor of Rust Foundation",
    title: "Platinum",
  },
  {
    key: "gold",
    icon: Heart,
    color: "text-yellow-500 fill-yellow-500",
    description: "Gold Sponsor of Rust Foundation",
    title: "Gold",
  },
  {
    key: "silver",
    icon: Heart,
    color: "text-gray-400 fill-gray-400",
    description: "Silver Sponsor of Rust Foundation",
    title: "Silver",
  },
  {
    key: "link",
    icon: Link,
    color: "",
    description: "Link to source of entry",
    title: "Link",
  },
  {
    key: "menu",
    icon: SquareMenu,
    color: "",
    description: "Modal with a short description",
    title: "Menu",
  },
];
