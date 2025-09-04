interface MinioConfig {
  baseUrl: string;
  bucket: string;
  apiVersion: string;
}

const MINIO_CONFIG: MinioConfig = {
  baseUrl: "https://console.minio.berli.app",
  bucket: "berli-public", 
  apiVersion: "v1"
};

export const buildMinioUrl = (objectPath: string, preview: boolean = true): string => {
  const encodedPath = encodeURIComponent(objectPath);
  const previewParam = preview ? "&preview=true" : "";
  return `${MINIO_CONFIG.baseUrl}/api/${MINIO_CONFIG.apiVersion}/buckets/${MINIO_CONFIG.bucket}/objects/download?prefix=${encodedPath}${previewParam}`;
};

export const prefix = buildMinioUrl("");
