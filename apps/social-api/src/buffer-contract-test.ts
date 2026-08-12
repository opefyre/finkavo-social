import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createScheduledPost, getPost } from "./buffer.js";
import { composeInstagramCaption } from "./caption.js";
import { bucket, createBufferMediaUrl } from "./storage.js";

if (process.env.ALLOW_BUFFER_CONTRACT_TEST !== "yes") throw new Error("Set ALLOW_BUFFER_CONTRACT_TEST=yes after explicit approval");
const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const channelId = process.env.BUFFER_CHANNEL_ID;
const inputDir = process.env.BUFFER_TEST_IMAGE_DIR;
const testName = process.env.BUFFER_TEST_NAME || "Finkavo template";
if (!endpoint || !accessKeyId || !secretAccessKey || !channelId || !inputDir) throw new Error("R2, Buffer channel, and BUFFER_TEST_IMAGE_DIR are required");

const client = new S3Client({ region: "auto", endpoint, credentials: { accessKeyId, secretAccessKey }, requestChecksumCalculation: "WHEN_REQUIRED" });
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const mediaUrls: string[] = [];
const files = (await readdir(inputDir)).filter((name) => /^\d{2}\.png$/.test(name)).sort();
if (files.length < 2 || files.length > 10) throw new Error("Buffer carousel test requires 2–10 numbered PNG files");
for (const filename of files) {
  const body = await readFile(join(inputDir, filename));
  const key = `social/contract-tests/${runId}-${testName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/${filename}`;
  await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: "image/png" }));
  const publicUrl = await createBufferMediaUrl(key);
  const publicCheck = await fetch(publicUrl, { method: "GET", headers: { Range: "bytes=0-31" }, signal: AbortSignal.timeout(15_000) });
  if (!publicCheck.ok || !String(publicCheck.headers.get("content-type")).includes("image/png")) throw new Error(`Public media check failed for ${filename} (${publicCheck.status})`);
  mediaUrls.push(publicUrl);
}

const post = await createScheduledPost({
  channelId,
  mode: "shareNow",
  mediaUrls,
  text: composeInstagramCaption({
    hook: `${testName}: Finkavo’s Portugal carousel design test.`,
    body: "This controlled post previews one approved visual family and checks image order, readability, public media delivery, and the final Buffer handoff. It contains no financial or legal advice.",
    callToAction: "Review the design, then delete this test.",
    hashtags: ["#Finkavo", "#PortugalAdmin", "#InstagramDesign", "#TemplateTest"],
  }),
});
const verified = await getPost(post.id);
process.stdout.write(`${JSON.stringify({ id: post.id, status: verified?.status || post.status, dueAt: verified?.dueAt || post.dueAt || null, assets: files.length, testName })}\n`);
