#!/usr/bin/env node
// Enforces plans/BRIEF_STANDARD.md against plans/brief-bank.json.
// Exits non-zero on any violation so the bank cannot regress into templated filler.

import { readFile } from "node:fs/promises";
import { deriveEvidenceTerms } from "./lib/evidence-terms.mjs";

const PILLARS = new Set([
  "identity_access", "immigration_residency", "citizenship_civil", "freelance_business",
  "iva", "irs", "social_security", "housing_property", "banking_money", "employment",
  "health_family", "driving_transport", "education_children", "daily_life_consumer",
]);

const VALUE_CLASSES = new Set([
  "threshold", "scenario", "costly_mistake", "edge_case", "decision", "deadline_action", "insider",
]);

const VOLATILITY = new Set(["stable", "annual", "volatile"]);
const RISK = new Set(["low", "medium", "high"]);

// The five templates that produced 74% of the previous plan, plus definitional openers.
const BANNED_TITLE_PATTERNS = [
  [/: a plain-English explanation$/i, "old 'foundation' template"],
  [/: a practical step-by-step checklist$/i, "old 'action' template"],
  [/: mistakes, exceptions and edge cases$/i, "old 'edge_case' template"],
  [/: one golden tip and what to verify$/i, "old 'golden_tip' template"],
  [/^What an? [\w\s-]+ is\b/i, "definitional opener"],
  [/\bbasics\b/i, "definitional 'basics' title"],
];

const REQUIRED = [
  "id", "pillar", "valueClass", "title", "userQuestion", "scenario", "audience",
  "promise", "anchorFact", "notObvious", "journeyStage", "source", "risk", "volatility",
];

// An anchor must be checkable. There is more than one way to be checkable, so the brief
// declares which kind of anchor it carries and the validator holds it to that kind.
// This is deliberately explicit: a loose "any of these signals" check let definitional
// claims pass as anchors.
const NUMERAL = /\d|\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty|forty|fifty|sixty|ninety|hundred|thousand)\b/i;
const MONTH = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/;

const ANCHOR_KINDS = {
  // a figure, rate, bracket or count
  figure: {
    // A numeral, spelled or written. The earlier version also accepted words like
    // "ceiling" and "limit" as signals, which let claims such as "exempt up to a
    // published price ceiling" pass as anchors while withholding the only thing a
    // reader needs. If the kind is figure, the figure has to be in the claim.
    test: claim => NUMERAL.test(claim),
    requirement: "an actual figure — a numeral or a spelled-out number, not the word for one",
  },
  // a date, window or period
  deadline: {
    // A numeral or a named month: "by the last day of January, April, July and
    // October" is a real deadline. Bare "within the specified period" is not.
    test: claim => NUMERAL.test(claim) || MONTH.test(claim),
    requirement: "a date, a numeral or a named month — not the word \"period\" standing in for one",
  },
  // a citable legal instrument
  instrument: {
    // (?:s|es)? so that "artigos", "leis" and "decretos" count as citations too.
    test: claim => /\b(artigo|article|modelo|anexo|lei|decreto|portaria|c[óo]digo|regulamento|tabela)(?:s|es)?\b/i.test(claim) || /\b(CIVA|RITI|CPPT|CIRS|CIRC|CIMI|CIMT|RGPD|LGT|EBF)\b/.test(claim),
    requirement: "a citable legal instrument (artigo, lei, decreto, código, modelo, anexo…)",
  },
  // a specific official document, form or account type the reader can ask for by name
  artefact: { needsNamedThing: true, requirement: "anchorFact.namedThing, quoted verbatim in the claim" },
  // a specific official channel or ordered step that can be followed
  procedure: { needsNamedThing: true, requirement: "anchorFact.namedThing, quoted verbatim in the claim" },
};

const errors = [];
const warnings = [];
const fail = (id, message) => errors.push(`${id}: ${message}`);
const warn = (id, message) => warnings.push(`${id}: ${message}`);

const raw = JSON.parse(await readFile(new URL("../plans/brief-bank.json", import.meta.url), "utf8"));
const briefs = raw.briefs ?? [];

if (!briefs.length) {
  console.error("brief bank is empty");
  process.exit(1);
}

const ids = new Set();
const identities = new Map();
const titles = new Map();
const questions = new Map();
const byPillar = new Map();
const classByPillar = new Map();

for (const brief of briefs) {
  const id = brief.id ?? "<missing id>";

  for (const field of REQUIRED) {
    if (brief[field] === undefined || brief[field] === null || brief[field] === "") {
      fail(id, `missing required field '${field}'`);
    }
  }

  if (ids.has(id)) fail(id, "duplicate id");
  ids.add(id);

  if (!PILLARS.has(brief.pillar)) fail(id, `unknown pillar '${brief.pillar}'`);
  if (!VALUE_CLASSES.has(brief.valueClass)) fail(id, `unknown valueClass '${brief.valueClass}'`);
  if (!RISK.has(brief.risk)) fail(id, `unknown risk '${brief.risk}'`);
  if (!VOLATILITY.has(brief.volatility)) fail(id, `unknown volatility '${brief.volatility}'`);

  // --- title quality -------------------------------------------------------
  const title = brief.title ?? "";
  for (const [pattern, label] of BANNED_TITLE_PATTERNS) {
    if (pattern.test(title)) fail(id, `banned title pattern (${label}): "${title}"`);
  }
  if (title && title.toLowerCase() === (brief.userQuestion ?? "").toLowerCase()) {
    fail(id, "title merely restates userQuestion");
  }

  // Hype is banned everywhere: being non-obvious is the differentiator, claiming to be is not.
  if (/\b(secret|hacks?|tricks?|shocking|insane|crazy|guaranteed|must-know)\b/i.test(title) ||
      /\bnobody tells you\b|\bthey don'?t want\b/i.test(title)) {
    fail(id, `hype vocabulary in title: "${title}"`);
  }
  if (title.includes("!")) fail(id, "exclamation mark in title");

  // High-risk subjects get a plain, declarative register — the reader is deciding whether to
  // trust us with a tax, immigration, legal or health decision.
  if (brief.risk === "high") {
    if (/^(you|your)\b/i.test(title)) {
      fail(id, `high-risk title uses a second-person hook: "${title}" — state what the reader will learn instead`);
    }
    if (/\.\s+\S/.test(title)) {
      fail(id, `high-risk title uses a two-sentence reveal: "${title}" — use one declarative title`);
    }
  }

  const titleKey = title.trim().toLowerCase();
  if (titles.has(titleKey)) fail(id, `duplicate title, also used by ${titles.get(titleKey)}`);
  else titles.set(titleKey, id);

  // --- the question must be a question -------------------------------------
  if (brief.userQuestion && !brief.userQuestion.trim().endsWith("?")) {
    fail(id, "userQuestion is not phrased as a question");
  }
  const questionKey = (brief.userQuestion ?? "").trim().toLowerCase();
  if (questions.has(questionKey)) fail(id, `duplicate userQuestion, also used by ${questions.get(questionKey)}`);
  else questions.set(questionKey, id);

  // --- anchor fact must be checkable ---------------------------------------
  const anchor = brief.anchorFact ?? {};
  if (!anchor.claim) fail(id, "anchorFact.claim is missing");
  if (!anchor.verifyAt) fail(id, "anchorFact.verifyAt is missing");
  if (anchor.verifyAt && !/^https:\/\//.test(anchor.verifyAt)) {
    fail(id, `anchorFact.verifyAt must be https: '${anchor.verifyAt}'`);
  }
  if (anchor.volatility && !VOLATILITY.has(anchor.volatility)) {
    fail(id, `unknown anchorFact.volatility '${anchor.volatility}'`);
  }
  const kind = ANCHOR_KINDS[anchor.kind];
  if (!anchor.kind) {
    fail(id, `anchorFact.kind is missing (one of: ${Object.keys(ANCHOR_KINDS).join(", ")})`);
  } else if (!kind) {
    fail(id, `unknown anchorFact.kind '${anchor.kind}'`);
  } else if (anchor.claim) {
    if (kind.needsNamedThing) {
      // An artefact/procedure anchor is only checkable if it names the exact thing to ask for,
      // and that name must actually appear in the claim rather than being asserted separately.
      if (!anchor.namedThing) {
        fail(id, `anchorFact.kind '${anchor.kind}' requires ${kind.requirement}`);
      } else if (!anchor.claim.toLowerCase().includes(anchor.namedThing.toLowerCase())) {
        fail(id, `anchorFact.namedThing '${anchor.namedThing}' does not appear in the claim`);
      }
    } else if (!kind.test(anchor.claim)) {
      fail(id, `anchorFact.kind '${anchor.kind}' requires ${kind.requirement} — this reads as a definition, not an anchor`);
    }
  }

  // --- scenario must be concrete -------------------------------------------
  if (brief.scenario && brief.scenario.split(/\s+/).length < 12) {
    warn(id, "scenario is very short — is it a real situation or a restatement of the topic?");
  }
  if (brief.audience && /^(everyone|anyone|all)\b/i.test(brief.audience)) {
    fail(id, `audience '${brief.audience}' is not specific`);
  }

  // --- source --------------------------------------------------------------
  const source = brief.source ?? {};
  if (!source.canonicalUrl) fail(id, "source.canonicalUrl is missing");
  if (source.canonicalUrl && !/^https:\/\//.test(source.canonicalUrl)) {
    fail(id, `source.canonicalUrl must be https: '${source.canonicalUrl}'`);
  }
  if (!source.authority) fail(id, "source.authority is missing");

  // high-risk content must be anchored to a primary authority, not a portal landing page
  if (brief.risk === "high" && source.canonicalUrl && /^https:\/\/[^/]+\/?$/.test(source.canonicalUrl)) {
    warn(id, `high-risk brief points at a bare domain '${source.canonicalUrl}' — needs a deep link to the page that answers it`);
  }

  // --- evidence terms must be derivable, not guessed ------------------------
  // Run the same derivation the plan builder uses, so an underivable brief fails here at
  // authoring time rather than blowing up the layout later.
  try {
    deriveEvidenceTerms(brief);
  } catch (error) {
    fail(id, String(error.message ?? error));
  }

  // --- identity uniqueness --------------------------------------------------
  const identity = [brief.pillar, questionKey, (brief.audience ?? "").toLowerCase(), brief.valueClass].join("|");
  if (identities.has(identity)) fail(id, `duplicate identity with ${identities.get(identity)}`);
  else identities.set(identity, id);

  byPillar.set(brief.pillar, (byPillar.get(brief.pillar) ?? 0) + 1);
  if (!classByPillar.has(brief.pillar)) classByPillar.set(brief.pillar, new Set());
  classByPillar.get(brief.pillar).add(brief.valueClass);
}

// --- bank-level shape -------------------------------------------------------
for (const [pillar, count] of byPillar) {
  const classes = classByPillar.get(pillar);
  if (count >= 4 && classes.size < 3) {
    fail(pillar, `${count} briefs but only ${classes.size} value class(es) (${[...classes].join(", ")}) — a pillar may not fill its quota from one kind of post`);
  }
}

// --- optional live source check ---------------------------------------------
// Run with --check-sources. Authoring invents plausible-looking official URLs that 404,
// so every canonicalUrl and verifyAt is fetched before the bank is trusted.
// Several Portuguese official sites (bportugal.pt) reject non-browser agents with 403;
// that is a "cannot verify here", not a dead link, and must not be reported as a failure.
if (process.argv.includes("--check-sources")) {
  const targets = new Map();
  for (const brief of briefs) {
    if (brief.source?.canonicalUrl) targets.set(brief.source.canonicalUrl, brief.id);
    if (brief.anchorFact?.verifyAt) targets.set(brief.anchorFact.verifyAt, brief.id);
  }

  console.log(`\nchecking ${targets.size} distinct source URLs...`);
  const BROWSER_UA =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";

  const probe = async url => fetch(url, {
    redirect: "follow",
    headers: { "user-agent": BROWSER_UA, "accept-language": "pt-PT,pt;q=0.9,en;q=0.8" },
    signal: AbortSignal.timeout(25_000),
  });

  const results = await Promise.all([...targets].map(async ([url, id]) => {
    // Some Portuguese government hosts intermittently reject Node's TLS handshake even
    // though the page is fine in a browser and under curl. One retry keeps a transient
    // failure from being reported as a dead source across dozens of briefs.
    for (const attempt of [1, 2]) {
      try {
        const response = await probe(url);
        return { url, id, status: response.status };
      } catch (error) {
        if (attempt === 2) return { url, id, status: 0, error: String(error.message ?? error) };
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
    return { url, id, status: 0, error: "unreachable" };
  }));

  const dead = results.filter(r => r.status === 404 || r.status === 410);
  const blocked = results.filter(r => r.status === 403 || r.status === 429);
  const unreachable = results.filter(r => r.status === 0);
  const ok = results.filter(r => r.status >= 200 && r.status < 400);

  console.log(`  reachable: ${ok.length}  bot-blocked: ${blocked.length}  unreachable: ${unreachable.length}  dead: ${dead.length}`);
  for (const r of blocked) console.log(`  ? ${r.status} ${r.id} — verify in a browser: ${r.url}`);
  for (const r of unreachable) warn(r.id, `source unreachable (${r.error}): ${r.url}`);
  for (const r of dead) fail(r.id, `source returns ${r.status}: ${r.url}`);
}

// --- report -----------------------------------------------------------------
const classCounts = {};
for (const brief of briefs) classCounts[brief.valueClass] = (classCounts[brief.valueClass] ?? 0) + 1;

console.log(`brief bank: ${briefs.length} briefs across ${byPillar.size}/${PILLARS.size} pillars`);
console.log("value classes:", Object.entries(classCounts).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${v}`).join("  "));
console.log("pillars      :", [...byPillar.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${v}`).join("  "));

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const warning of warnings) console.log(`  ! ${warning}`);
}

if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const error of errors) console.error(`  x ${error}`);
  process.exit(1);
}

console.log("\nAll briefs satisfy plans/BRIEF_STANDARD.md");
