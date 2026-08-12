import { readFile } from "node:fs/promises";
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
if (!endpoint || !accessKeyId || !secretAccessKey || !channelId || !inputDir) throw new Error("R2, Buffer channel, and BUFFER_TEST_IMAGE_DIR are required");

const client = new S3Client({ region: "auto", endpoint, credentials: { accessKeyId, secretAccessKey }, requestChecksumCalculation: "WHEN_REQUIRED" });
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const mediaUrls: string[] = [];
for (let index = 1; index <= 5; index++) {
  const filename = `${String(index).padStart(2, "0")}.png`;
  const body = await readFile(join(inputDir, filename));
  const key = `social/contract-tests/${runId}/${filename}`;
  await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: "image/png" }));
  mediaUrls.push(await createBufferMediaUrl(key));
}

const post = await createScheduledPost({
  channelId,
  mode: "shareNow",
  mediaUrls,
  text: composeInstagramCaption({
    hook: "Pipeline test: validating Finkavo’s five-slide Instagram delivery.",
    body: "This controlled post checks image order, public media delivery, and the final Buffer handoff. It contains no financial or legal advice.",
    callToAction: "Review all five slides, then delete this test.",
    hashtags: ["#Finkavo", "#PortugalAdmin", "#InstagramCarousel", "#PipelineTest"],
  }),
});
const verified = await getPost(post.id);
process.stdout.write(`${JSON.stringify({ id: post.id, status: verified?.status || post.status, dueAt: verified?.dueAt || post.dueAt || null, assets: 5 })}\n`);
