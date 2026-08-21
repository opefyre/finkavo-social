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

// The dimensions stay literal rather than becoming plain numbers. Pinning them is what
// stops a slide of the wrong size reaching Instagram, and widening them to `number` to
// make room for video would have thrown that away for every carousel too. A union keeps
// each kind exact: a carousel slide is 1080x1350 and a PNG, a reel is 1080x1920 and an
// MP4, and a reel's cover is the same frame as a still.
type CarouselSlide = { width: 1080; height: 1350; mimeType: "image/png" };
type ReelVideo = { width: 1080; height: 1920; mimeType: "video/mp4" };
type ReelCover = { width: 1080; height: 1920; mimeType: "image/png" };

export type RenderFileInput = { key: string; sha256: string; bytes: number } & (CarouselSlide | ReelVideo | ReelCover);

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
  const intact = bytes.length === file.bytes
    && result.ContentType === file.mimeType
    && createHash("sha256").update(bytes).digest("hex") === file.sha256;
  if (!intact) return false;

  // A PNG carries its dimensions in the header, and checking them here is what stops a
  // slide of the wrong size reaching Instagram. An MP4 does not, and reading them would
  // mean walking the box tree for a number the encoder was already told to produce. What
  // is worth confirming is that the bytes are a video container at all rather than an
  // error page or a truncated upload, which the ftyp box at offset four settles.
  if (file.mimeType === "video/mp4") {
    return bytes.length >= 12 && bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70;
  }
  const png = bytes.length >= 24 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (!png) return false;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return view.getUint32(16) === file.width && view.getUint32(20) === file.height;
}

export async function uploadRenderedObject(file: RenderFileInput & { key: string }, bytes: Uint8Array) {
  await r2().send(new PutObjectCommand({
    Bucket: bucket,
    Key: file.key,
    Body: bytes,
    ContentType: file.mimeType,
  }));
  return verifyUploadedObject(file);
}

export async function createBufferMediaUrl(key: string) {
  if (!publicBaseUrl) throw new Error("R2_PUBLIC_BASE_URL is required for Buffer media");
  return `${publicBaseUrl}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

/**
 * Puts a finished reel and its cover frame where Buffer can fetch them. Buffer does not
 * take an upload; it is given a URL and collects the file itself, so both have to be
 * publicly readable before the post is created rather than after.
 *
 * The cover matters more than it looks: without one Instagram picks a frame on its own,
 * and the frame it picks is often mid-zoom with the text half-scaled. Handing it the
 * opening frame means the grid shows the hook.
 */
export async function uploadReelAssets(input: {
  postId: string;
  revisionId: string;
  video: Uint8Array;
  cover: Uint8Array;
}): Promise<{ videoUrl: string; coverUrl: string }> {
  const base = `social/reels/${new Date().toISOString().slice(0, 10).replaceAll("-", "/")}/${input.postId}/${input.revisionId}`;
  const video: RenderFileInput = {
    key: `${base}/reel.mp4`, sha256: createHash("sha256").update(input.video).digest("hex"),
    bytes: input.video.length, width: 1080, height: 1920, mimeType: "video/mp4",
  };
  const cover: RenderFileInput = {
    key: `${base}/cover.png`, sha256: createHash("sha256").update(input.cover).digest("hex"),
    bytes: input.cover.length, width: 1080, height: 1920, mimeType: "image/png",
  };
  if (!(await uploadRenderedObject(video, input.video))) throw new Error("Reel video failed R2 verification");
  if (!(await uploadRenderedObject(cover, input.cover))) throw new Error("Reel cover failed R2 verification");
  return { videoUrl: await createBufferMediaUrl(video.key), coverUrl: await createBufferMediaUrl(cover.key) };
}
