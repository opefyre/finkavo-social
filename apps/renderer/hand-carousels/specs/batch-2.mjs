/**
 * Five carousels, one a day, 18–22 September 2026, posted at 18:00 Lisbon. Reels go out
 * at 09:00, so the two formats never land together.
 *
 * All tax and admin — no employment law. Every figure was checked on 14 September 2026:
 *
 * - IMT Jovem: Decreto-Lei 48-A/2024 (conditions, 6-month / 6-year rules, spouses), Portal
 *   das Finanças IMT Jovem page (how to claim), 2026 limits €330.539 / €660.982 after the
 *   2% bracket update in the OE 2026, 8% on the excess.
 * - IRS Jovem: CIRS art. 12.º-B as published on the Portal (35, non-dependant, A and B,
 *   100/75/50/25, 55 × IAS, gap years pause, not with NHR / IFICI / art. 12.º-A);
 *   IAS 2026 €537,13 (Portaria 480-A/2025/1) → €29.542,15.
 * - Withholding: CIRS art. 101.º-B (threshold = CIVA art. 53.º, €15.000 from 2025;
 *   optional; not if last year reached it; ends the month after), 23% rate for art. 151.º
 *   professions from 2025 (OCC).
 * - Rent: CIRS art. 78.º-E, 15%; €700 for 2025 rent, €900 for 2026, €1.000 for 2027.
 * - Address: LGT art. 19.º n.º 4 (ineffective until communicated) and n.º 5 (60 days on a
 *   residence-status change); Portal das Finanças "Morada" page (15 days otherwise, CC
 *   holders change it via gov.pt / CC desk, others via Dados Cadastrais).
 *
 * The serif headline cannot carry a 3 (Fraunces draws it as a 5), so every "35" and
 * every euro figure lives in a chip, a row, a figure or body copy — all Noto Sans.
 */

const tags = (...extra) => [...extra.slice(0, 3), "#viveremportugal", "#Finkavo"];

export const SPECS = [
  // ---------------------------------------------------------------- 18 Sep — IMT Jovem
  {
    id: "imt-jovem",
    day: "2026-09-18",
    photo: "aima",
    // Anchored to the bottom: the top of this photo holds a ticket display with garbled text.
    photoPos: "center 100%",
    source: "Decreto-Lei 48-A/2024 · Portal das Finanças",
    title: "IMT Jovem: first home, no purchase tax",
    slides: [
      { type: "cover", kicker: "Buying your first home in Portugal", title: "Your first home may cost you no IMT.",
        body: "If you are 35 or under and it will be your permanent home, both purchase taxes can drop to zero." },
      { type: "content", kicker: "What IMT is", title: "The tax you pay before you sign.",
        body: "IMT is charged when you buy property and is paid before the escritura, the deed. Imposto do Selo adds another 0,8% of the price." },
      { type: "rows", kicker: "Who qualifies", title: "Every condition has to hold.",
        rows: [
          { key: "Age on the day you buy", value: "35 or under" },
          { key: "Claimed as a dependant on someone's IRS", value: "No" },
          { key: "Owned a home in the past three years", value: "No" },
          { key: "What the home will be", value: "Permanent home" },
        ] },
      { type: "rows", kicker: "The 2026 price limits", title: "How much is exempt depends on the price.",
        rows: [
          { key: "Up to €330.539", value: "No IMT, no Selo" },
          { key: "€330.539 to €660.982", value: "Part above only" },
          { key: "Above €660.982", value: "No exemption" },
        ] },
      { type: "figure", kicker: "In the middle band", figure: "8%", figureLabel: "IMT on the part above €330.539",
        title: "Only the excess is taxed.",
        body: "Plus 0,8% Selo on that part. A €370.000 home: €39.461 is taxed, about €3.157 IMT and €316 Selo." },
      { type: "content", kicker: "The catch", title: "It has to stay your home.",
        body: "Move in within six months and keep it as your permanent home for six years. Selling it, a change in the family, or a job move over 100 km do not cancel the exemption." },
      { type: "cta", kicker: "How to claim it", title: "On the IMT declaration, before the deed.",
        body: "Portal das Finanças → IMT → Modelo 1, choosing the IMT Jovem exemption. Buying as a married couple? Each spouse files and is checked separately.",
        action: "Save this before you sign." },
    ],
    caption: {
      hook: "Buying your first home in Portugal and 35 or under? In 2026 you may pay no IMT and no Imposto do Selo at all.",
      body: `IMT is the tax on buying property, paid before the deed. Imposto do Selo adds 0,8% of the price. IMT Jovem can remove both.

Who qualifies — all of these at once:
· 35 or under on the day you buy
· Not claimed as a dependant on anyone's IRS
· No home owned in the previous three years
· The property will be your permanent home (habitação própria e permanente)

The 2026 limits:
· Up to €330.539 — no IMT and no Selo
· €330.539 to €660.982 — only the part above €330.539 is taxed: IMT at 8% and Selo at 0,8%
· Above €660.982 — no exemption

Example: a €370.000 home. €39.461 is taxed — about €3.157 of IMT and €316 of Selo.

The catch: move in within six months and keep it as your permanent home for six years. Selling, a change in the household, or a job move of more than 100 km do not cancel it.

How: Portal das Finanças → IMT → Modelo 1, choosing the IMT Jovem exemption. Married couples each file separately.

Source: Decreto-Lei 48-A/2024 and the Portal das Finanças IMT Jovem page.`,
      cta: "Not sure you qualify? Ask Finkavo — every answer cites the law.",
      tags: tags("#imtjovem", "#comprarcasa", "#impostos"),
    },
  },

  // ---------------------------------------------------------------- 19 Sep — IRS Jovem
  {
    id: "irs-jovem",
    day: "2026-09-19",
    photo: "job",
    source: "Código do IRS · art. 12.º-B",
    title: "IRS Jovem: the ten-year exemption",
    slides: [
      { type: "cover", kicker: "Income tax · 35 or under", title: "Part of your income can be tax-free.",
        body: "IRS Jovem exempts a share of what young people earn, for up to ten years of income." },
      { type: "rows", kicker: "How much is exempt", title: "The share falls over ten years.",
        rows: [
          { key: "Year 1", value: "100%" },
          { key: "Years 2 to 4", value: "75%" },
          { key: "Years 5 to 7", value: "50%" },
          { key: "Years 8 to 10", value: "25%" },
        ] },
      { type: "figure", kicker: "The 2026 ceiling", figure: "€29.542,15", figureLabel: "55 × IAS of €537,13",
        title: "The most that can be exempt in a year.",
        body: "Anything above it is taxed as usual, even in year one." },
      { type: "rows", kicker: "Who qualifies", title: "Check these first.",
        rows: [
          { key: "Age", value: "35 or under" },
          { key: "Claimed as a dependant on someone's IRS", value: "No" },
          { key: "Income", value: "Salary or recibos verdes" },
          { key: "Tax affairs", value: "In order" },
        ] },
      { type: "content", kicker: "A year without income", title: "A gap does not use up a year.",
        body: "Only years in which you earned income, and were not someone's dependant, are counted. A year studying or out of work pauses the count." },
      { type: "content", kicker: "It does not stack", title: "Not with other special regimes.",
        body: "People taxed under NHR (residente não habitual), IFICI or the Programa Regressar cannot use IRS Jovem at the same time." },
      { type: "cta", kicker: "How to claim it", title: "Choose it on your annual IRS return.",
        body: "It is an option on the Modelo 3, filed April to June for the year before. It is not applied unless you choose it.",
        action: "Save this for next spring." },
    ],
    caption: {
      hook: "Aged 35 or under and earning in Portugal? IRS Jovem can make part of your income tax-free for up to ten years.",
      body: `How much of your salary or recibos verdes income is exempt:
· Year 1 — 100%
· Years 2 to 4 — 75%
· Years 5 to 7 — 50%
· Years 8 to 10 — 25%

The exempt amount is capped at 55 × IAS a year. With the 2026 IAS of €537,13, that is €29.542,15. Income above it is taxed normally.

Who qualifies:
· 35 or under
· Not claimed as a dependant on anyone's IRS
· Income from employment (category A) or self-employment (category B)
· Tax affairs in order

A year with no income, or as someone's dependant, does not count — the ten years pause rather than run out.

It does not combine with NHR, IFICI or the Programa Regressar.

It is not automatic: choose it on your Modelo 3 IRS return, filed April to June for the year before.

Source: Código do IRS, art. 12.º-B.`,
      cta: "Not sure which year you are in? Ask Finkavo — every answer cites the law.",
      tags: tags("#irsjovem", "#irs", "#impostos"),
    },
  },

  // ---------------------------------------------------------------- 20 Sep — withholding
  {
    id: "retencao-dispensa",
    day: "2026-09-20",
    photo: "iva",
    source: "Código do IRS · art. 101.º e 101.º-B",
    title: "Recibos verdes: skipping withholding is not skipping tax",
    slides: [
      { type: "cover", kicker: "Recibos verdes", title: "No withholding does not mean no tax.",
        body: "Under €15.000 a year you can issue receipts with no IRS withheld. The tax still arrives, the following year." },
      { type: "content", kicker: "What withholding is", title: "Your client pays part of your tax upfront.",
        body: "When a business with organised accounts (contabilidade organizada) pays your recibo verde, it keeps a slice and sends it to Finanças for you." },
      { type: "figure", kicker: "The usual rate", figure: "23%", figureLabel: "Professions in the art. 151.º table",
        title: "Kept from each payment by a business.",
        body: "A private person paying you withholds nothing." },
      { type: "rows", kicker: "When you can skip it", title: "Two limits, one rule for leaving.",
        rows: [
          { key: "What you earned last year", value: "Under €15.000" },
          { key: "What you expect this year", value: "Under €15.000" },
          { key: "Once you pass it", value: "Withhold next month" },
        ] },
      { type: "content", kicker: "The catch", title: "The tax is only postponed.",
        body: "With no withholding, nothing is paid during the year. The IRS on that income is settled in full when your return is assessed, often as one large bill." },
      { type: "cta", kicker: "Before your next receipt", title: "Choose it on purpose, not by default.",
        body: "The art. 101.º-B option is on the receipt form in the Portal das Finanças. Using it is optional even when you qualify.",
        action: "Save this before invoicing." },
    ],
    caption: {
      hook: "Recibos verdes: issuing receipts without IRS withholding does not mean you owe less tax. It means you pay it later, all at once.",
      body: `What withholding is: when a business with organised accounts (contabilidade organizada) pays your recibo verde, it keeps part of the payment and sends it to Finanças as an advance on your IRS. For the professions in the art. 151.º table the rate is 23%. A private person paying you withholds nothing.

When you can skip it (dispensa de retenção):
· You earned under €15.000 last year, and
· You expect to earn under €15.000 this year
· Once you pass €15.000, withholding applies from the following month

The catch: without withholding, nothing is paid during the year. The IRS on that income is settled when your return is assessed — often as one large bill the next summer.

The option is optional even when you qualify. Choose it knowingly.

Source: Código do IRS, art. 101.º and 101.º-B; Código do IVA, art. 53.º for the €15.000 limit.`,
      cta: "Questions about your own receipts? Ask Finkavo — every answer cites the law.",
      tags: tags("#recibosverdes", "#irs", "#trabalhadorindependente"),
    },
  },

  // ---------------------------------------------------------------- 21 Sep — rent deduction
  {
    id: "rendas-deducao",
    day: "2026-09-21",
    photo: "rent",
    source: "Código do IRS · art. 78.º-E",
    title: "Tenants: the rent deduction rises to €900",
    slides: [
      { type: "cover", kicker: "Renting your home in Portugal", title: "Your rent lowers your income tax.",
        body: "Tenants can deduct 15% of the rent they pay. For rent paid in 2026, the cap rises to €900." },
      { type: "rows", kicker: "The most you can deduct", title: "The cap is going up.",
        rows: [
          { key: "Rent paid in 2025", value: "€700" },
          { key: "Rent paid in 2026", value: "€900" },
          { key: "Rent paid in 2027", value: "€1.000" },
        ] },
      { type: "figure", kicker: "To use the full €900", figure: "€500 a month", figureLabel: "€6.000 a year × 15%",
        title: "Pay less, deduct less.",
        body: "Below that you deduct 15% of what you paid. Above it, the deduction stops at €900." },
      { type: "content", kicker: "It only counts if", title: "Finanças has to know about the lease.",
        body: "The lease must be registered with Finanças, the home must be your permanent residence, and the rent must be declared — normally through your landlord's electronic rent receipts." },
      { type: "content", kicker: "Check it now", title: "No receipts, no deduction.",
        body: "If your landlord does not issue electronic receipts, ask how the rent is being declared. Without that, your deduction may simply be missing." },
      { type: "cta", kicker: "At IRS time", title: "It goes on Anexo H of your return.",
        body: "Filed April to June, for the rent of the year before.", action: "Save this until April." },
    ],
    caption: {
      hook: "Renting your home in Portugal? 15% of your rent comes off your income tax — and the cap rises to €900 for rent paid in 2026.",
      body: `The most a tenant can deduct:
· Rent paid in 2025 (IRS filed in 2026) — €700
· Rent paid in 2026 (IRS filed in 2027) — €900
· Rent paid in 2027 (IRS filed in 2028) — €1.000

To use the full €900 you need €6.000 of rent in the year — €500 a month. Pay less and you deduct 15% of what you paid.

It only counts if:
· The lease is registered with Finanças
· The home is your permanent residence
· The rent is declared, normally through your landlord's electronic rent receipts (recibos de renda eletrónicos)

If your landlord does not issue them, raise it now rather than at IRS time.

The deduction goes on Anexo H of your IRS return, filed April to June for the year before.

Source: Código do IRS, art. 78.º-E, as amended for 2026 and 2027.`,
      cta: "Questions about your lease? Ask Finkavo — every answer cites the law.",
      tags: tags("#arrendamento", "#irs", "#deducoes"),
    },
  },

  // ---------------------------------------------------------------- 22 Sep — tax address
  {
    id: "morada-fiscal",
    day: "2026-09-22",
    photo: "car",
    source: "Lei Geral Tributária · art. 19.º · Portal das Finanças",
    title: "Moved house? Finanças still has your old address",
    slides: [
      { type: "cover", kicker: "Moved house in Portugal?", title: "Finanças still has your old address.",
        body: "Until you tell them, your tax address has not changed, whatever your lease says." },
      { type: "content", kicker: "Why it matters", title: "The old address is still the legal one.",
        body: "A change of tax address has no effect until it is communicated (Lei Geral Tributária, art. 19.º). Official letters keep going to where you used to live." },
      { type: "rows", kicker: "The deadlines", title: "Shorter than most people think.",
        rows: [
          { key: "You move and stay tax resident here", value: "15 days" },
          { key: "You become, or stop being, tax resident", value: "60 days" },
        ] },
      { type: "content", kicker: "With a Cartão de Cidadão", title: "Change it once, on the card.",
        body: "Update the address on gov.pt or at any Cartão de Cidadão desk. Finanças picks it up from there automatically." },
      { type: "content", kicker: "With a residence permit", title: "Change it on the Portal das Finanças.",
        body: "Dados Cadastrais → Morada → Entregar Pedido de Alteração. Or book an appointment at a tax office." },
      { type: "cta", kicker: "Do this now", title: "Check the address Finanças has for you.",
        body: "If it is not where you live today, the clock is already running.", action: "Save this for moving day." },
    ],
    caption: {
      hook: "Moved house in Portugal? Until you tell them, Finanças still treats your old address as your tax address.",
      body: `A change of tax address (domicílio fiscal) has no effect until it is communicated — Lei Geral Tributária, art. 19.º. Official letters keep going to the old one.

The deadlines:
· You move within Portugal and stay tax resident — 15 days
· You become, or stop being, a Portuguese tax resident — 60 days

Where to change it:
· Cartão de Cidadão holders — on gov.pt or at any Cartão de Cidadão desk. Finanças updates automatically.
· Foreign residents — Portal das Finanças → Dados Cadastrais → Morada → Entregar Pedido de Alteração, or at a tax office by appointment.

Worth checking today: log in and see which address Finanças has for you.

Source: Lei Geral Tributária, art. 19.º; Portal das Finanças, "Morada".`,
      cta: "Moving soon? Ask Finkavo what else needs updating — every answer cites the law.",
      tags: tags("#moradafiscal", "#financas", "#mudardecasa"),
    },
  },
];
