import { execFile } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import ffmpegStatic from "ffmpeg-static";

// The package ships a CommonJS default export whose types resolve to the module itself
// under this compiler setting, so the path is read back out rather than trusted as one.
const ffmpegPath = ffmpegStatic as unknown as string | null;
import type { ReelFrame, ReelManifest } from "./reel-schema.js";

const run = promisify(execFile);

export const REEL_FPS = 30;
// Seven to fifteen seconds is where a Reel gets rewatched instead of scrolled past, and a
// rewatch counts again. Outside that band the arithmetic below compresses or stretches
// the holds rather than letting a five-frame video run to half a minute.
const MIN_TOTAL_SECONDS = 7;
const MAX_TOTAL_SECONDS = 15;
const MIN_HOLD = 1.8;
const MAX_HOLD = 4.2;

const wordsIn = (frame: ReelFrame): number => {
  const text = frame.type === "hook" ? `${frame.kicker ?? ""} ${frame.headline}`
    : frame.type === "beat" ? `${frame.figure ?? ""} ${frame.label ?? ""} ${frame.body}`
    : `${frame.headline} ${frame.action}`;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

/**
 * How long each frame stays on screen. Reading speed sets the shape — a frame carrying
 * twenty words cannot be shown for as long as one carrying four — and the whole is then
 * scaled into the band where Reels get rewatched.
 */
export function frameDurations(frames: ReelFrame[], holdSeconds?: number): number[] {
  // An explicit hold is honoured exactly, including past the fifteen-second band: the
  // band exists to stop a video being too long, and a fixed short hold cannot be.
  if (holdSeconds) {
    const exact = Math.round(holdSeconds * REEL_FPS) / REEL_FPS;
    return frames.map(() => exact);
  }

  const raw = frames.map(frame => {
    // A second of recognition before the words, then roughly four words a second, which
    // is a slow-ish silent read on a phone.
    const seconds = 1.0 + wordsIn(frame) / 4;
    return Math.min(MAX_HOLD, Math.max(MIN_HOLD, seconds));
  });
  const total = raw.reduce((sum, value) => sum + value, 0);
  const target = Math.min(MAX_TOTAL_SECONDS, Math.max(MIN_TOTAL_SECONDS, total));
  const scaled = raw.map(value => (value / total) * target);
  // Rounding each hold to a whole frame can push the sum past the ceiling — 15.07s for a
  // fifteen second cap — so the rounding error is taken off the last frame rather than
  // left to accumulate. The payoff frame is the one that can afford it.
  const rounded = scaled.map(value => Math.round(value * REEL_FPS) / REEL_FPS);
  const drift = rounded.reduce((sum, value) => sum + value, 0) - target;
  if (drift > 0 && rounded.length) {
    const last = rounded.length - 1;
    rounded[last] = Math.max(MIN_HOLD, Math.round((rounded[last]! - drift) * REEL_FPS) / REEL_FPS);
  }
  return rounded;
}

/**
 * Stills concatenated into an MP4. Each frame gets a slow push-in: Instagram treats a
 * completely static video as a lesser thing than a moving one, and the movement is small
 * enough that it reads as intent rather than as an effect.
 *
 * A silent stereo track is muxed in because a Reel with no audio stream at all is
 * rejected or silently converted by some upload paths, and an empty track costs nothing.
 */
export async function composeReel(manifest: ReelManifest, frameFiles: string[], outputPath: string): Promise<{ path: string; seconds: number }> {
  if (!ffmpegPath) throw new Error("ffmpeg-static did not provide a binary for this platform");
  if (frameFiles.length !== manifest.frames.length) {
    throw new Error(`Have ${frameFiles.length} rendered frames for ${manifest.frames.length} written ones`);
  }
  await mkdir(path.dirname(outputPath), { recursive: true });

  const durations = frameDurations(manifest.frames, manifest.holdSeconds);
  // Each still is turned into a fixed number of frames by the input itself: -loop on its
  // own is an endless source, and pairing that with a zoompan hold asks for every one of
  // those frames to be held again. The first attempt at this wrote a quarter of a
  // gigabyte before it was stopped, and would not have finished. Bounded by -t, with the
  // zoom advancing one frame at a time, the length is decided here and ffmpeg only ever
  // produces what was asked for.
  const inputs = frameFiles.flatMap((file, index) => [
    "-loop", "1", "-framerate", String(REEL_FPS), "-t", durations[index]!.toFixed(3), "-i", file,
  ]);
  const filters = frameFiles.map((_, index) =>
    `[${index}:v]scale=1080:1920,zoompan=z='min(zoom+0.0004,1.05)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=${REEL_FPS},setsar=1[v${index}]`);
  const concat = `${frameFiles.map((_, index) => `[v${index}]`).join("")}concat=n=${frameFiles.length}:v=1:a=0[v]`;
  const seconds = durations.reduce((sum, value) => sum + value, 0);

  await run(ffmpegPath, [
    "-y", "-hide_banner", "-loglevel", "error",
    ...inputs,
    "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
    "-filter_complex", [...filters, concat].join(";"),
    "-map", "[v]", "-map", `${frameFiles.length}:a`,
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
    // yuv420p is what phones and Instagram's transcoder expect; without it the video
    // plays as a green rectangle on a good share of devices.
    "-pix_fmt", "yuv420p",
    "-profile:v", "high", "-level", "4.1",
    "-r", String(REEL_FPS),
    "-c:a", "aac", "-b:a", "128k", "-shortest",
    "-movflags", "+faststart",
    outputPath,
  ], { maxBuffer: 1024 * 1024 * 16 });

  return { path: outputPath, seconds: Math.round(seconds * 100) / 100 };
}
