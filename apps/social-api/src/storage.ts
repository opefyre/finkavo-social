import { createHash } from "node:crypto";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
export const bucket = process.env.R2_BUCKET || "finkavo-social";
const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "");

let client: S3Client | undefined;
function r2() {
  if (!endpoint || !accessKeyId || !secretAccessKey) throw new Error("R2 storage is not configured");
  return client ??= new S3Client({
    region: "auto", endpoint,
    credentials: { accessKeyId, secretAccessKey },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
}

export type RenderFileInput = {
  key: string;
  sha256: string;
  bytes: number;
  width: 1080;
  height: 1350;
  mimeType: "image/png";
};

export async function createUploadUrl(file: RenderFileInput) {
  const command = new PutObjectCommand({
    Bucket: bucket, Key: file.key, ContentType: file.mimeType,
  });
  return getSignedUrl(r2(), command, { expiresIn: 15 * 60 });
}

export async function verifyUploadedObject(file: RenderFileInput) {
  const result = await r2().send(new GetObjectCommand({ Bucket: bucket, Key: file.key }));
  if (!result.Body) return false;
  const bytes = await result.Body.transformToByteArray();
  const png = bytes.length >= 24 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const width = png ? view.getUint32(16) : 0;
  const height = png ? view.getUint32(20) : 0;
  return bytes.length === file.bytes && result.ContentType === file.mimeType && createHash("sha256").update(bytes).digest("hex") === file.sha256 && width === file.width && height === file.height;
}

export async function createBufferMediaUrl(key: string) {
  if (!publicBaseUrl) throw new Error("R2_PUBLIC_BASE_URL is required for Buffer media");
  return `${publicBaseUrl}/${key.split("/").map(encodeURIComponent).join("/")}`;
}
