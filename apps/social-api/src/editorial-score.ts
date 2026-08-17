import { assertEnglishUserCopy, validateStandaloneValue } from "./draft-quality.js";
import { validateCaptionParts } from "./caption.js";

type ReviewCandidate = {
  topic: string; hook: string; caption: string; callToAction: string; hashtags: string[];
  slides: Array<{ title?: string; body?: string; items?: string[]; sourceLabel?: string }>;
  sources: Array<{ url?: string; tier?: string }>;
  riskLevel: string; subjectFamily?: string; userQuestion?: string; contentIntent?: string;
};

export function editorialScore(candidate: ReviewCandidate) {
  const failures: string[] = [];
  try { assertEnglishUserCopy([candidate.topic,candidate.hook,candidate.caption,candidate.callToAction,candidate.slides.flatMap(s=>[s.title,s.body,s.items])]); }
  catch { failures.push("English-only copy"); }
  try { validateCaptionParts({hook:candidate.hook,body:candidate.caption,callToAction:candidate.callToAction,hashtags:candidate.hashtags}); }
  catch { failures.push("complete Instagram caption"); }
  if (!candidate.subjectFamily || !candidate.userQuestion || !candidate.contentIntent) failures.push("structured editorial identity");
  if (!candidate.sources.length || candidate.sources.some(source=>!source.url)) failures.push("traceable evidence sources");
  if (candidate.riskLevel === "high" && !candidate.sources.some(source=>source.tier === "official")) failures.push("official high-risk evidence");
  if (candidate.slides.length < 3 || candidate.slides.length > 7 || candidate.slides.some(slide=>!slide.title?.trim() || (!slide.body?.trim() && !(slide.items?.length)))) failures.push("complete slide content");
  if (candidate.slides.some(slide=>!slide.sourceLabel?.trim())) failures.push("slide source labels");
  if (/^(did you know|important update|here'?s what you need to know)[.!?]?$/i.test(candidate.hook.trim())) failures.push("specific hook");
  try { validateStandaloneValue(candidate); } catch { failures.push("standalone reader value"); }
  return { score: Math.max(0,100-failures.length*15), failures, passed: failures.length === 0 };
}
