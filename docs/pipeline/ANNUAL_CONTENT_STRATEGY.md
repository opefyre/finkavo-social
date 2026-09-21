# Finkavo annual social content strategy

## Outcome

This is a rolling 365-day editorial system for 13 August 2026 through 12 August 2027. It contains five intentional publishing slots per day (1,825 total). The plan decides the topic first. Corpus documents and chunks are retrieved only later to support that topic with evidence.

The generated plan is in `plans/finkavo-rolling-year-2026-08-13.csv`. The machine-readable source is `plans/finkavo-rolling-year-2026-08-13.json`; the reusable catalog is `plans/finkavo-editorial-catalog.json`.

## Daily rhythm

| Lisbon time | Editorial job | Typical format |
|---|---|---|
| 08:30 | Foundation | Definition, system map, plain-English explainer |
| 11:30 | Action | Steps, documents, portal path, checklist |
| 14:30 | Edge case | Mistake, exception, rejected request, unusual situation |
| 18:00 | Current relevance | Verified news or date-locked campaign; predetermined evergreen fallback |
| 21:00 | Saveable utility | Golden tip, record-keeping habit, quick comparison |

The 18:00 position is not permission to manufacture news. If no material official development is verified by the cutoff, its named fallback runs instead.

## Editorial pillars

The catalog contains 14 pillars and more than 230 named subject families:

1. Identity and access: NIF, NISS, Finanças access, Chave Móvel Digital and document hygiene.
2. Immigration and residency: AIMA, renewals, permits, visas, CPLP, family reunification and fraud warnings.
3. Citizenship and civil registration: IRN, nationality, certificates, birth, marriage, apostilles and translations.
4. Freelancing and business: opening activity, CAE/CIRS, recibos verdes, corrections, closure and record keeping.
5. IVA: exemptions, thresholds, declarations, payment, VIES, reverse charge and international clients.
6. IRS: preparation, e-Fatura, Modelo 3, annexes, foreign income, assessments, refunds and corrections.
7. Social Security: registration, quarterly declarations, contributions, benefits, exemptions and A1.
8. Housing and property: renting, receipts, IMI, AIMI, IMT, stamp duty, purchase, sale and municipal variation.
9. Banking and money: accounts, IBAN, SEPA, direct debit, Multibanco, MB WAY, fees, credit records and scams.
10. Employment: contracts, payslips, allowances, leave, sickness, termination, IEFP and remote work.
11. Health and family: SNS registration, family doctor, SNS 24, prescriptions, EHIC/S1, birth and parental administration.
12. Driving and transport: licence exchange, vehicles, ISV, IUC, tolls, insurance and inspection.
13. Education and children: enrolment, catchment, records, MEGA, exams, higher education and degree recognition.
14. Daily life and consumer admin: ePortugal, municipalities, complaints, utilities, telecoms, moving and scams.

Each subject can appear again only with a different editorial purpose or real occurrence. For example, NIF can support a definition, first application, address change, representative question, document-reading tip and recovery scenario. These are not duplicate captions.

## Audience journeys

The plan deliberately serves users at different stages:

- before moving to Portugal;
- the first seven days;
- the first 30 and 90 days;
- first employment or freelance activity;
- first tax year;
- renting, buying or moving home;
- bringing a partner or family;
- renewing status and documents;
- long-term residence and citizenship;
- resolving an error, rejection, missed date or lost document.

## Time-sensitive content classes

### Officially locked

The exact date is supported by a current official publication. It can enter research and drafting, but must be checked again within seven days of publication and again on the morning of a last-call post.

### Rule locked

The underlying recurring rule is official (for example the quarterly Social Security declaration months or the normal IRS filing window). The occurrence is generated automatically, but weekends, holidays, extensions and emergency orders are checked before publication.

### Must reverify

The annual authority has not published the final calendar yet. The slot remains blocked; it cannot be approved from a prior-year date. Once the new official calendar is ingested, the date and evidence bundle are replaced and hashed.

### Occasion or seasonal

The date is stable, but the practical claim still needs a source. Examples include national holidays, Portugal Day, International Migrants Day, school-year preparation and Christmas service closures.

### Breaking news

News discovery never becomes evidence. A news signal opens a research task. The post is eligible only when an official page, law, notice or regulator publication confirms the material claim. Otherwise the slot uses its predetermined fallback.

## Campaign logic

Recurring obligations are campaigns rather than one post:

- awareness or opening-soon explainer;
- preparation checklist;
- common mistake or audience-specific edge case;
- reminder;
- last call when justified;
- after-deadline correction or next-step guide.

The occurrence key includes the rule, due date, audience and campaign stage. A previous IRS, IVA, IMI or Social Security post never blocks the next occurrence. Within one occurrence, identical angles are suppressed.

## Topic-led evidence workflow

1. Select today’s predefined plan slot.
2. Read its topic, audience, angle, risk, search terms, source rules and timing class.
3. Search document metadata first, not random chunks.
4. Rank current documents by authority tier, semantic title match, freshness and jurisdiction.
5. Build a candidate bundle from two to five relevant documents when available.
6. Retrieve only the passages needed for the planned questions.
7. Extract atomic claims and attach each to an exact passage and document version.
8. Check dates, thresholds, amounts, exceptions and conflicts deterministically.
9. Block unsupported, conflicting or stale claims.
10. Give the model the approved topic brief and verified claim bundle—not a raw chunk dump.
11. Generate structured copy.
12. Run copy, caption, render and source QA.
13. Human review sees the final caption, every slide, all alt text and the source bundle.
14. Approval remains revision- and evidence-hash-bound.

## Source policy

- Tier 1: Portuguese official authorities, legislation and regulators. Required for law, tax, immigration, eligibility, money, deadlines and fees.
- Tier 2: professional sources may explain or identify ambiguity, but cannot override Tier 1.
- Editorial sources may provide audience questions and practical framing.
- Community and Golden Tips records are idea leads only until verified against current official evidence.
- Discovery news is a lead only.
- Annual event listings use the responsible authority or official tourism/municipal organizer; an event is not treated as recurring until the current edition is confirmed.

## Accuracy and freshness

- High risk: official evidence checked within 7 days; deadline last calls checked the same day.
- Medium risk: checked within 30 days.
- Low-risk evergreen: checked within 90 days.
- Any changed upstream hash invalidates approval.
- A year-specific number or date cannot be copied into another year.
- Municipal and regional differences must be labelled; mainland rules are not silently applied to Madeira or the Azores.
- “Usually,” “normally” and “may” are not substitutes for checking applicability.

## Editorial quality gate

Every post must pass:

- one clear audience and one concrete promise;
- a hook that names the Portugal context;
- one main idea per slide;
- enough context to act, without pretending to give individual legal or tax advice;
- caption assembled as hook, useful body, text CTA, `finkavo.com`, and four to eight focused hashtags;
- no repeated claim across slides;
- no unsupported number, date, fee, threshold or eligibility statement;
- real Finkavo logo, approved fonts/colors and readable 1080 × 1350 output;
- exact source and retrieval date retained internally;
- manual approval for all posts during launch.

## Cadence safeguards

Five slots are capacity, not a quota that permits filler. A slot is skipped when evidence or review is incomplete. Normally no more than two high-risk posts run in one day; a date-locked campaign may temporarily displace another slot. Consecutive posts cannot use the same pillar, source, hook pattern or visual family. A subject cooldown applies to the same audience-and-angle pair, not to the underlying broad topic.

## Monthly editorial emphasis

- January: annual admin reset, Social Security quarter, new tax rules, passwords and records.
- February: e-Fatura, household details, IVA quarter, relationships and family administration.
- March: IRS preparation, consumer rights, housing records and spring moves.
- April: IRS opening, Social Security quarter, Freedom Day and first-quarter corrections.
- May: IMI, IVA quarter, housing and moving, school preparation.
- June: IRS final month, Portugal Day, summer travel documents and family admin.
- July: Social Security quarter, school enrolment, higher education and travel readiness.
- August: IMI, IRS notices, public-service availability, moving and school return.
- September: school start, AIMI, quarterly IVA, residence-document review.
- October: Social Security quarter, Republic Day, savings, consumer money habits.
- November: IMI, IVA quarter, winter utilities, year-end business preparation.
- December: public holidays, document downloads, annual records and next-year readiness.

## Authoritative calendar inputs

- Autoridade Tributária annual declarative and payment calendars.
- Autoridade Tributária IRS principal deadlines.
- Segurança Social worker and self-employed guides.
- DGAEP mandatory and optional holiday reference.
- Portal da Educação and published school-calendar orders.
- Government of Portugal communications for national occasions.
- VisitPortugal and municipal/organizer pages for current event editions.

The plan generator is versioned and deterministic. Changes to topic families, campaigns, dates or source policy require regeneration, validation and a documented release.
