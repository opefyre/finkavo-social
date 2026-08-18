import { createHash } from "node:crypto";
import postgres from "../apps/social-api/node_modules/postgres/src/index.js";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL required");

const repairs = new Map([
  ["e5ad71b8-a094-4b95-86f4-b21bb2d9b842", {
    cover: "Use these official IMT section names to find vehicle registration, ownership and inspection services.",
    summary: "On IMT’s driver and vehicle page, look for Certificado de Matrícula, Certidões de Veículos, Registo de Propriedade, Identificação de Veículos and Inspeção de Veículos.",
  }],
  ["eb328a6c-46b1-4e5f-a6b1-2345110c7675", {
    cover: "An IBAN adds a country code and check digits to Portugal’s domestic bank-account number, known as the NIB.",
    summary: "An IBAN contains the country code, two check digits and your domestic BBAN or NIB. The domestic number includes a code identifying the payment provider.",
  }],
]);

const hash = value => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const sql = postgres(process.env.DATABASE_URL, { max: 1 });
const repaired = [];

try {
  for (const [postId, copy] of repairs) {
    await sql.begin(async tx => {
      const [post] = await tx`SELECT * FROM social_post WHERE id=${postId} AND status='draft' FOR UPDATE`;
      if (!post) return;
      const [revision] = await tx`SELECT * FROM social_post_revision WHERE id=${post.current_revision_id} AND post_id=${post.id}`;
      if (!revision) throw new Error(`Current revision missing for ${postId}`);
      const slides = revision.slides.map((slide, index, all) => ({
        ...slide,
        body: index === 0 ? copy.cover : index === all.length - 1 ? copy.summary : slide.body,
      }));
      const [number] = await tx`SELECT COALESCE(max(revision_number),0)+1 AS value FROM social_post_revision WHERE post_id=${post.id}`;
      const contentHash = hash({ hook: revision.hook, caption: revision.caption, callToAction: revision.call_to_action, hashtags: revision.hashtags, slides });
      const [created] = await tx`
        INSERT INTO social_post_revision(post_id,revision_number,locale,template_version,hook,caption,call_to_action,hashtags,slides,alt_texts,source_bundle,evidence_hash,content_hash,model,prompt_version,post_intent,search_keywords)
        VALUES(${post.id},${number.value},${revision.locale},${revision.template_version},${revision.hook},${revision.caption},${revision.call_to_action},${revision.hashtags},${tx.json(slides)},${revision.alt_texts},${revision.source_bundle},${revision.evidence_hash},${contentHash},'bounded_owner_repair',${revision.prompt_version},${revision.post_intent},${revision.search_keywords}) RETURNING id`;
      await tx`UPDATE social_post SET current_revision_id=${created.id},slides=${tx.json(slides)},updated_at=now() WHERE id=${post.id}`;
      await tx`INSERT INTO social_event(post_id,event_type,payload) VALUES(${post.id},'revision.bounded_repair',${tx.json({previousRevisionId:revision.id,revisionId:created.id,reason:'render text contract'})})`;
      repaired.push({ postId, revisionId: created.id });
    });
  }
} finally {
  await sql.end({ timeout: 5 });
}

console.log(JSON.stringify({ repaired }));
