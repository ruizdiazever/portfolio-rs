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
  description: z.object({
    en: z.string(),
    zh: z.string(),
  }),
  country: z.string(),
  market: z.boolean(),
  sponsor: z.string(),
  source: z.string(),
  title: z.object({
    en: z.string(),
    zh: z.string(),
  }),
});

export type Organization = z.infer<typeof orgSchema>;

export const iconData = [
  {
    key: "founder",
    icon: Heart,
    color: "text-red-500 fill-red-500",
    description: {
      en: "Founder and Sponsor of Rust Foundation",
      zh: "Rust基金会的创始人和赞助商",
    },
    title: {
      en: "Founder",
      zh: "创始人",
    },
  },
  {
    key: "platinum",
    icon: Heart,
    color: "text-blue-500 fill-blue-500",
    description: {
      en: "Platinum Sponsor of Rust Foundation",
      zh: "Rust基金会白金赞助商",
    },
    title: {
      en: "Platinum",
      zh: "白金",
    },
  },
  {
    key: "gold",
    icon: Heart,
    color: "text-yellow-500 fill-yellow-500",
    description: {
      en: "Gold Sponsor of Rust Foundation",
      zh: "Rust基金会黄金赞助商",
    },
    title: {
      en: "Gold",
      zh: "黄金",
    },
  },
  {
    key: "silver",
    icon: Heart,
    color: "text-gray-400 fill-gray-400",
    description: {
      en: "Silver Sponsor of Rust Foundation",
      zh: "Rust基金会白银赞助商",
    },
    title: {
      en: "Silver",
      zh: "白银",
    },
  },
  {
    key: "link",
    icon: Link,
    color: "",
    description: {
      en: "Link to source of entry",
      zh: "条目来源链接",
    },
    title: {
      en: "Link",
      zh: "链接",
    },
  },
  {
    key: "menu",
    icon: SquareMenu,
    color: "",
    description: {
      en: "Modal with a short description",
      zh: "带有简短描述的模态框",
    },
    title: {
      en: "Menu",
      zh: "菜单",
    },
  },
];
