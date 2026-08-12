import { z } from "zod";
const icon = z.enum(["calendar", "tax", "home", "passport", "document", "warning", "money", "people", "check"]);
export const visualStyleSchema = z.enum(["petrol_editorial", "cream_guide", "mint_checklist", "peach_deadline", "ink_alert"]);
const baseSlide = z.object({ icon, eyebrow: z.string().trim().max(42).optional(), title: z.string().trim().min(1).max(82), sourceLabel: z.string().trim().max(80).optional() });
export const slideSchema = z.discriminatedUnion("type", [
  baseSlide.extend({ type: z.literal("cover"), subtitle: z.string().trim().min(1).max(150), category: z.string().trim().min(1).max(32) }),
  baseSlide.extend({ type: z.literal("content"), body: z.string().trim().min(1).max(420), highlight: z.string().trim().max(80).optional() }),
  baseSlide.extend({ type: z.literal("bullets"), items: z.array(z.string().trim().min(1).max(130)).min(2).max(5) }),
  baseSlide.extend({ type: z.literal("steps"), items: z.array(z.string().trim().min(1).max(130)).min(2).max(5) }),
  baseSlide.extend({ type: z.literal("summary"), body: z.string().trim().min(1).max(300), cta: z.string().trim().min(1).max(80) })
]);
export const renderManifestSchema = z.object({ schemaVersion: z.literal(1), postId: z.string().trim().min(1).max(80), revisionId: z.string().trim().min(1).max(80), locale: z.literal("en"), templateVersion: z.enum(["finkavo-v1", "finkavo-v2", "finkavo-v3"]), visualStyle: visualStyleSchema.default("petrol_editorial"), slides: z.array(slideSchema).min(3).max(7) });
export type Slide = z.infer<typeof slideSchema>;
export type VisualStyle = z.infer<typeof visualStyleSchema>;
export type RenderManifest = z.infer<typeof renderManifestSchema>;
