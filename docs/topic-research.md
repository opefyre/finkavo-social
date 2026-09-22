# Choosing and verifying topics (`topics`)

The account had 160+ posts by September 2026 and the owner's loudest complaint was repeated topics. This is how to pick
topics that are new, useful and correct.

## 1 · Know what has been posted

```bash
# on the spare Mac, env loaded (see TOOLS.md → queue)
node tools/buffer/list-posts.mjs | cut -c1-150
```

Read every line. A topic is a repeat if a post already gives the same rule, even from a different angle (two IUC posts and
a third IUC angle would still feel repeated). If unsure, look at the Instagram grid too.

## 2 · Pick candidates

A good topic has:

- **One idea and one exact move**: "tax residence is decided by nights → count them, then tell Finanças within 60 days".
  Two moves means two reels.
- **A number people can act on** (a threshold, a deadline, a fine).
- **Audience fit**: people living or moving to Portugal, employees and freelancers dealing with Finanças, Segurança Social,
  AIMA, IMT/IMI. **Tax and admin only, never employment law.**
- **A clear common mistake** to name (the "habit" in scene 2 of a reel).

Start from the backlog below; add to it as ideas come up.

## 3 · Research each candidate against primary sources

Run one subagent per topic, in parallel, with the template below. Primary sources: Portal das Finanças code pages
(`info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/…`), Ofícios-circulados, FAQs and leaflets on the
same site, Segurança Social guides (`seg-social.pt`), gov.pt / ePortugal, AIMA, dre.pt. Blogs are pointers, not sources.

**Prompt template**

> Research task for an Instagram post about Portuguese tax/admin. Topic: `<ONE-LINE TOPIC and the claim you believe is true>`.
> Use WebSearch/WebFetch. PRIMARY sources only for numbers (list the site families above). Return, concisely:
> 1. The exact rule (quote at most two short sentences of the law in Portuguese) and a plain-English restatement — is a
>    threshold "more than" or "or more"? which period? counted how?
> 2. Deadline(s) and what starts each clock.
> 3. Penalty or consequence, with the article it comes from.
> 4. The ONE concrete move a person should make, with the exact Portal/office path if you can confirm it.
> 5. Exceptions and caveats that would make a short post inaccurate (who the rule does not apply to; recent changes).
> 6. Source URLs you actually opened, each with the one fact it confirmed. Mark anything you could not confirm from a
>    primary source as UNVERIFIED. Do not invent numbers. Do not write files. Under 450 words.

## 4 · Decide

Keep a topic only if the rule, the number and the move are confirmed by a primary source you (or the subagent) opened.

- **Two official sources disagree → drop the topic** (or wait). Example: the "no-debt certificate" idea was dropped because
  Finanças' page says 3 months' validity and the law (DL 49/2025) says 4.
- **Unverified details** never appear in the video. They may appear in the caption, hedged ("can bring a fine of…").
- Say thresholds exactly as the law does ("€3.000 **or more**", "**more than** 183 days") and state who a rule does not
  apply to (e.g. the higher cash limit for non-residents).
- Never present a rule as advice for someone's personal situation. No invented Finkavo features; the only CTA is
  "Ask Finkavo — every answer cites the law."

## 5 · Hand over

Per topic: the claim in one sentence, the rule with exact wording, the move, the deadline, the penalty, exceptions, sources
opened, and what is hedged. Then update the backlog.

---

## Backlog

**Done — kinetic reels (23–27 Sep 2026):** tax residency (183 nights) · cash payment ban (€3.000) · IVA exemption limits
(€15.000 / €18.750) · closing a freelance activity (30 days) · renovation → Modelo 1 IMI (60 days).

**Done — earlier reels (16–20 Sep):** lottery prize tax · e-notifications count on day 5 · inheritance declaration · fine
reduction · IMI 3-year exemption. **Done — carousels (18–22 Sep):** IMT Jovem · IRS Jovem · withholding exemption ·
rent deduction · change of address. (Earlier months: NIF, IBAN, IUC, IMI instalments, crypto, capital gains on a home,
instalments, foreign-income credit, NHR/IFICI, recibos verdes IVA and Social Security, and many more: always check Buffer.)

**Done — kinetic reels (28 Sep – 2 Oct 2026):** fake Finanças messages · IRS refund offset against debts · banks report balances above €50.000 · IMI Familiar (€30/70/140, council choice) · marketplace seller reporting (DAC7).
**Done — carousels (23 Sep – 2 Oct 2026):** IRS deductions cheat sheet · first month checklist · what Finanças can seize · buying-a-home costs · baby checklist · foreign accounts (Anexo J quadro 11) · heirs' first steps (Balcão das Heranças) · tax residence tests · the cash ban · IVA exemption limits.
Facts kept out because unconfirmed: refund offset for Segurança Social debts; bank freezing rules after a death; the IRS overall-cap values for 2026; a euro threshold for selling a seized home.

**Done — carousels, v2 design (3–6 Oct 2026):** the six taxes a newcomer meets (IVA, IRS, IMT, Selo, IMI, IUC) · a family gift toward a home (Imposto do Selo, exempt for close family, 0,8% on a gifted property) · reporting your lease to Finanças (landlord's duty; tenant can report since Aug 2025) · does an old tax debt expire (8 years, not automatic).
Lessons from writing them for a reader with no background: define every term on the slide where it first appears (Finanças, NIF, IRS, IMI, Portal); lead with the situation the reader recognises; say where sources disagree instead of picking a side; give one action.

**Done — kinetic reels (3–7 Oct 2026):** bank interest/dividends taxed at 28% at source, final, with englobamento as an opt-in (CIRS art. 71.º) · AIMI, the extra property tax above €600.000 individual VPT (CIMI art. 135.º-B/C/F) · a tax deadline only shifts off a weekend if it's a counted term, not a fixed date (CPPT art. 20.º vs CPA art. 87.º) · recibos verdes must be invoiced within 5 business days (CIVA art. 36.º, RGIT art. 123.º fine €150–€3.750) · PPR retirement-savings deduction, 20% capped by age, 5-year rule or 10%/year clawback (EBF art. 21.º).
Facts kept off-screen because not cleanly confirmed at primary source: the €1.200.000 AIMI threshold for couples electing joint taxation (found only via a secondary CIMI mirror); the exact IRS-return box for choosing englobamento on bank interest; periodic/intra-EU invoicing deadline variants for recibos verdes; any 2025/2026 change to the PPR caps (none found).
"Paying Finanças: references, expiry, MB WAY" was researched and dropped — official sources gave inconsistent channel lists per tax (MB WAY listed for IMI, not for IUC) and no confirmed universal expiry rule, so it didn't clear the two-source bar.

**Done — kinetic reel (22 Sep 2026, filling a missed slot found on a queue audit):** selling a car — the buyer has 60 days to register the change of ownership (gov.pt vehicle-registration guides), and IUC keeps landing on whoever the registry still names as owner (IUC art. 3.º) until then; the seller can register the sale themselves with proof if the buyer doesn't. No specific article was found for the 60-day figure itself (only gov.pt's own guidance pages, opened directly) — noted in the caption.

**Candidates (not yet researched unless stated):**

| Topic | Note |
|---|---|
| Online marketplaces reporting sellers to Finanças (DAC7) | done as a reel 28 Sep–2 Oct; revisit only with a new angle |

**Dropped:** no-debt certificate (validity conflict, see above). Revisit if Finanças' page is updated.
