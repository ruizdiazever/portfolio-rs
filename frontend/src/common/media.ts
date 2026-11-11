export const S3_BASE = "https://s3.berli.app/portfolio";
export const MEDIA_VERSION = "v1";

export const media = (path: string): string =>
	`${S3_BASE}/${MEDIA_VERSION}/${path}`;

export const mediaSrcSet = (
	path: string,
	widths: number[],
	format: "avif" | "webp",
): string =>
	widths
		.map((width) => `${media(`${path}-${width}.${format}`)} ${width}w`)
		.join(", ");
