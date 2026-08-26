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
export type ReelAudio = {
  /** A bed under the whole reel, trimmed and faded. Supplied, licence-free. */
  musicPath?: string;
  /** A prepared sound placed on each frame change. Generated, so no licence applies. */
  effectPath?: string;
};

export async function composeReel(
  manifest: ReelManifest,
  frameFiles: string[],
  outputPath: string,
  audio: ReelAudio = {},
): Promise<{ path: string; seconds: number }> {
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

  // Audio is built rather than borrowed. Instagram's own library is the thing that
  // actually moves reach, and it cannot be attached through any API — Buffer's only
  // audio field is a string described as placeholder text, a note to whoever posts by
  // hand. So what goes in the file is a bed and some movement: better than silence,
  // honest about not being trending audio.
  const audioInputs: string[] = [];
  const audioFilters: string[] = [];
  const audioLabels: string[] = [];
  // ffmpeg numbers inputs, not argv entries: a file is two arguments and a generated
  // source is four, so the stream index has to be counted rather than derived from how
  // long the argument list happens to be.
  let audioInputCount = 0;

  // Output is pinned to stereo at 44.1kHz. The generated sweep is mono and amix followed
  // it down, so a whoosh-only reel arrived mono while every other variant was stereo.
  const wantsAudio = Boolean(audio.musicPath) || Boolean(audio.effectPath);
  if (wantsAudio) {
    // Silence the exact length of the video, mixed under everything else. Without it the
    // mix is only as long as its first source, so a whoosh-only reel ended after the
    // first sweep — two seconds of a seven second video — because -shortest then trimmed
    // the picture to match the sound.
    const index = frameFiles.length + audioInputCount++;
    audioInputs.push("-f", "lavfi", "-t", seconds.toFixed(3), "-i", "anullsrc=channel_layout=stereo:sample_rate=44100");
    audioFilters.push(`[${index}:a]anull[base]`);
    audioLabels.push("[base]");
  }

  if (audio.musicPath) {
    const index = frameFiles.length + audioInputCount++;
    audioInputs.push("-i", audio.musicPath);
    // Trimmed to the video and faded at both ends. A bed that stops dead on the last
    // frame sounds like the file broke; a fade sounds like the end.
    const fadeOut = Math.max(0, seconds - 0.9);
    audioFilters.push(`[${index}:a]atrim=0:${seconds.toFixed(3)},asetpts=N/SR/TB,afade=t=in:st=0:d=0.35,afade=t=out:st=${fadeOut.toFixed(3)}:d=0.9,volume=0.16[bed]`);
    audioLabels.push("[bed]");
  }

  if (audio.effectPath) {
    // The same prepared file at each cut rather than a fresh synthesis, so every reel
    // using this effect sounds identical and a new one can be added by dropping a file in
    // beside the others. None at the very start: the first sound should be the reel
    // beginning, not a transition into nothing.
    let elapsed = 0;
    for (let index = 0; index < durations.length - 1; index++) {
      elapsed += durations[index]!;
      const at = Math.max(0, Math.round((elapsed - 0.08) * 1000));
      const input = frameFiles.length + audioInputCount++;
      audioInputs.push("-i", audio.effectPath);
      audioFilters.push(`[${input}:a]volume=0.5,adelay=${at}|${at}[w${index}]`);
      audioLabels.push(`[w${index}]`);
    }
  }

  const hasAudio = audioLabels.length > 0;
  if (hasAudio) {
    // normalize=0 keeps the bed at the level it was set to instead of ducking it every
    // time a whoosh joins the mix.
    audioFilters.push(`${audioLabels.join("")}amix=inputs=${audioLabels.length}:normalize=0:duration=longest,atrim=0:${seconds.toFixed(3)},aformat=channel_layouts=stereo:sample_rates=44100,alimiter=limit=0.95[a]`);
  } else {
    audioInputs.push("-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100");
  }

  await run(ffmpegPath, [
    "-y", "-hide_banner", "-loglevel", "error",
    ...inputs,
    ...audioInputs,
    "-filter_complex", [...filters, concat, ...audioFilters].join(";"),
    "-map", "[v]", "-map", hasAudio ? "[a]" : `${frameFiles.length}:a`,
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


/**
 * Encodes a captured motion sequence.
 *
 * Nothing needs a zoom or a crossfade here: the movement is already in the pixels, one
 * image per thirtieth of a second. That makes this the simple case — point ffmpeg at the
 * numbered sequence, lay the sound underneath, and stop. The still-per-frame composer
 * above stays for the fallback path, where a slow crop is the only motion available.
 */
export async function composeReelMotion(
  sequenceDirectory: string,
  frameCount: number,
  fps: number,
  outputPath: string,
  audio: ReelAudio = {},
): Promise<{ path: string; seconds: number }> {
  if (!ffmpegPath) throw new Error("ffmpeg-static did not provide a binary for this platform");
  if (frameCount < 1) throw new Error("A motion reel needs at least one captured frame");
  await mkdir(path.dirname(outputPath), { recursive: true });

  const seconds = frameCount / fps;
  const audioInputs: string[] = [];
  const audioLabels: string[] = [];
  const audioFilters: string[] = [];

  // A silent bed the full length of the video, so a shorter sound cannot decide where the
  // audio track ends and leave the tail of the reel silent — or worse, truncated.
  audioInputs.push("-f", "lavfi", "-t", seconds.toFixed(3), "-i", "anullsrc=channel_layout=stereo:sample_rate=44100");
  audioFilters.push(`[1:a]anull[base]`);
  audioLabels.push("[base]");

  const track = audio.musicPath || audio.effectPath;
  if (track) {
    audioInputs.push("-i", track);
    const gain = audio.musicPath ? 0.32 : 0.5;
    audioFilters.push(`[2:a]volume=${gain},atrim=0:${seconds.toFixed(3)},afade=t=out:st=${Math.max(0, seconds - 0.6).toFixed(3)}:d=0.6[bed]`);
    audioLabels.push("[bed]");
  }
  audioFilters.push(`${audioLabels.join("")}amix=inputs=${audioLabels.length}:normalize=0:duration=first,aformat=channel_layouts=stereo,alimiter[a]`);

  await run(ffmpegPath, [
    "-y", "-hide_banner", "-loglevel", "error",
    "-framerate", String(fps),
    "-i", path.join(sequenceDirectory, "t-%05d.png"),
    ...audioInputs,
    "-filter_complex", audioFilters.join(";"),
    "-map", "0:v", "-map", "[a]",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
    // yuv420p is what phones and Instagram's transcoder expect; without it the video
    // plays as a green rectangle on a good share of devices.
    "-pix_fmt", "yuv420p",
    "-profile:v", "high", "-level", "4.1",
    "-r", String(fps),
    "-c:a", "aac", "-b:a", "128k", "-shortest",
    "-movflags", "+faststart",
    outputPath,
  ], { maxBuffer: 1024 * 1024 * 16 });

  return { path: outputPath, seconds: Math.round(seconds * 100) / 100 };
}
