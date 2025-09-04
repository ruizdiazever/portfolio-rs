import { buildMinioUrl } from "./common";

interface AboutAssets {
  me: string;
}

export const aboutMain: AboutAssets = {
  me: buildMinioUrl("portfolio/ever.avif"),
};
