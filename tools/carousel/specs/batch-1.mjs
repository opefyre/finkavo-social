/**
 * Seven carousels, one a day, 11–17 September 2026.
 *
 * EVERY FIGURE HERE WAS VERIFIED AGAINST A PRIMARY SOURCE EARLIER TODAY — the article
 * text, the ISS practical guide, or the Portal das Finanças — not from memory and not
 * from summaries. Web search was unavailable while these were written, so nothing new
 * was researched: only material already checked and cited is used. That is deliberate.
 * Putting an unverified number on screen is the one failure this account cannot absorb.
 *
 * BALANCE. The complaint about the last batch was that every piece was employment law
 * when Finkavo is a tax and admin assistant. This set is three tax, two social security,
 * two employment.
 *
 * FORMAT. A carousel is the reference, not the hook. Where a reel had to choose one
 * number, these carry the whole table — the rate bands, the instalment thresholds, the
 * conditions — because that is what makes a carousel worth saving.
 */

// Instagram allows five hashtags. Three for the topic, two for the account.
const tags = (...extra) => [...extra.slice(0, 3), "#viveremportugal", "#Finkavo"];

export const SPECS = [
  // ---------------------------------------------------------------- 11 Sep — tax
  {
    id: "iva-q2-prazo",
    day: "2026-09-11",
    photo: "iva",
    source: "Código do IVA · art. 41.º e 27.º",
    title: "Recibos verdes: Q2 IVA is due this month",
    slides: [
      { type: "cover", kicker: "Recibos verdes", title: "Your Q2 IVA is due this month.",
        body: "And not on the date most calendars carry." },
      { type: "content", kicker: "Why the date moved", title: "August is férias fiscais.",
        body: "The normal rule would put the second quarter on 20 August. A second rule moves it to September, which is why so many calendars hold the wrong date." },
      { type: "rows", kicker: "Two dates, not one", title: "Filing and paying are different days.",
        rows: [
          { key: "File the declaração periódica", value: "20 Sept" },
          { key: "Pay what it shows", value: "25 Sept" },
        ] },
      { type: "figure", kicker: "If you miss it", figure: "€150–€3.750", figureLabel: "Coima",
        title: "The fine for a late or missing declaration.",
        body: "It applies to the declaration itself, separately from any tax and interest owed." },
      { type: "content", kicker: "One note for 2026", title: "20 September falls on a Sunday.",
        body: "The Portal das Finanças does not keep office hours, but leaving it to the day itself removes any room to fix a problem." },
      { type: "cta", kicker: "Where to do it", title: "Portal das Finanças → IVA → Declaração periódica.",
        body: "Both dates belong in your calendar, not just the first.", action: "Save this until the 25th." },
    ],
    caption: {
      hook: "Recibos verdes: your second-quarter IVA is due this month — and the date most people have written down is the one the law replaced.",
      body: `August is férias fiscais, so the second quarter does not follow the normal rule.

· File the declaração periódica by 20 September — Código do IVA, art. 41.º n.º 10
· Pay by 25 September — Código do IVA, art. 27.º n.º 10
· A declaration filed late or not at all: coima de €150 a €3.750 — RGIT, art. 116.º n.º 1

The normal rule, art. 41.º n.º 1 b), would put Q2 on 20 August. That is exactly why so many calendars carry the wrong date — a second rule displaces it.

Two different dates, and most people diarise only the first.

For 2026, note that 20 September is a Sunday. Nothing stops you filing, but it leaves no room to sort out a problem.`,
      cta: "Finkavo tracks both dates for you, cited to the article.",
      tags: tags("#recibosverdes", "#iva", "#impostos", "#trabalhadorindependente"),
    },
  },

  // ---------------------------------------------------------------- 12 Sep — tax
  {
    id: "imi-prestacoes",
    day: "2026-09-12",
    photo: "rent",
    source: "Portal das Finanças · IMI",
    title: "IMI: the November instalment is coming",
    slides: [
      { type: "cover", kicker: "If you own property in Portugal", title: "Your next IMI instalment lands in November.",
        body: "How many you get depends on the size of the bill." },
      { type: "rows", kicker: "How the bill is split", title: "The thresholds are automatic.",
        rows: [
          { key: "Up to €100", value: "May only" },
          { key: "€100 to €500", value: "May · Nov" },
          { key: "Over €500", value: "May · Aug · Nov" },
        ] },
      { type: "content", kicker: "You do not choose it", title: "The split is applied for you.",
        body: "The instalments come from the amount owed and are printed on the nota de cobrança. You can always pay the whole thing at once instead." },
      { type: "content", kicker: "If no letter arrived", title: "The bill is on the Portal anyway.",
        body: "Serviços → Imposto Municipal sobre Imóveis → Consultar Notas de Cobrança, then pick the year. A letter that never arrived is not a reason the tax is not due." },
      { type: "cta", kicker: "Do this now", title: "Check which instalment plan yours is on.",
        body: "If your bill was over €500 there was an August payment too.", action: "Then diarise November." },
    ],
    caption: {
      hook: "If you own property in Portugal, your next IMI instalment is in November — and how many instalments you get is decided by the size of the bill, not by you.",
      body: `How the Imposto Municipal sobre Imóveis is split:

· Up to €100 — a single payment in May
· More than €100 and up to €500 — two instalments, May and November
· More than €500 — three instalments, May, August and November

The split is automatic. It is calculated from the amount owed and printed on the nota de cobrança the Tax Authority sends. You are free to ignore it and pay the full amount in one go, but you cannot ask for more instalments than the threshold gives you.

If the letter never reached you, the bill is on the Portal das Finanças regardless: Serviços → Imposto Municipal sobre Imóveis → Consultar Notas de Cobrança, then choose the year. A letter that did not arrive has never been a defence for a missed deadline.

Worth checking now rather than in November: if your bill was over €500, there was an August instalment as well.`,
      cta: "Finkavo keeps the property dates in one place.",
      tags: tags("#imi", "#impostos", "#casa", "#proprietarios"),
    },
  },

  // ---------------------------------------------------------------- 13 Sep — social security
  {
    id: "declaracao-trimestral",
    day: "2026-09-13",
    photo: "ss",
    source: "Código Contributivo · art. 163.º, 164.º e 168.º",
    title: "Recibos verdes: the quarterly declaration closes 31 October",
    slides: [
      { type: "cover", kicker: "Recibos verdes", title: "Your quarterly declaration closes this October.",
        body: "The 31st, and the figure you put in it decides what you pay for the next three months." },
      { type: "content", kicker: "What it is", title: "Four filings a year, one for each quarter.",
        body: "It is due by the last day of January, April, July and October, and it reports what you invoiced in the three months before." },
      { type: "rows", kicker: "How the bill is built", title: "Three steps, all fixed by law.",
        rows: [
          { key: "Relevant income", value: "70% of invoices" },
          { key: "Monthly base", value: "⅓ of the quarter" },
          { key: "Contribution rate", value: "21,4%" },
        ] },
      { type: "figure", kicker: "The part almost nobody uses", figure: "±25%", figureLabel: "In steps of 5%",
        title: "You can move that base up or down.",
        body: "The option is exercised inside the declaration itself, and only while you are filing it." },
      { type: "content", kicker: "Before you reach for it", title: "It is a dial, not a discount.",
        body: "The same base sets your sick pay, your parental leave and your pension. Turning the bill down turns the cover down with it." },
      { type: "cta", kicker: "Where to do it", title: "Segurança Social Direta → Declaração Trimestral.",
        body: "Q3 covers July, August and September.", action: "Closes 31 October." },
    ],
    caption: {
      hook: "Recibos verdes: the declaração trimestral closes on 31 October, and the figure you put in it decides what you pay for the next three months.",
      body: `It is due by the last day of January, April, July and October, covering the three months before.

How the contribution is built:
· Rendimento relevante = 70% of the services you invoiced
· Monthly base = one third of the quarter's relevant income — art. 163.º n.º 1
· Rate = 21,4% for trabalhadores independentes — art. 168.º n.º 1

The lever almost nobody uses — art. 164.º: when you file, you may fix a relevant income up to 25% above or below what your invoices produce, in steps of 5%. It is exercised inside the declaration and only while you are filing it.

The catch, which is the part most posts leave out: that same base is what your subsídio de doença, your parental leave and your pension are calculated from. Lowering the bill lowers the cover. It is a dial, not a discount.

There is also a ceiling — the monthly base cannot exceed 12 times the IAS, under art. 163.º n.º 5.`,
      cta: "Finkavo tracks the quarters and the articles behind them.",
      tags: tags("#recibosverdes", "#segurancasocial", "#trabalhadorindependente"),
    },
  },

  // ---------------------------------------------------------------- 14 Sep — social security
  {
    id: "baixa-tabela",
    day: "2026-09-14",
    photo: "sick",
    source: "ISS · Guia Prático Subsídio de Doença",
    title: "Sick pay in Portugal: the full table",
    slides: [
      { type: "cover", kicker: "Sick leave in Portugal", title: "Sick pay is never your full pay.",
        body: "And it does not start on the first day." },
      { type: "rows", kicker: "When it starts paying", title: "The waiting days are not the same for everyone.",
        rows: [
          { key: "On a contract", value: "Day 4" },
          { key: "Recibos verdes", value: "Day 11" },
          { key: "Voluntary insurance", value: "Day 31" },
        ] },
      { type: "rows", kicker: "What you get", title: "The rate rises the longer it lasts.",
        rows: [
          { key: "Up to 30 days", value: "55%" },
          { key: "31 to 90 days", value: "60%" },
          { key: "91 to 365 days", value: "70%" },
          { key: "More than 365 days", value: "75%" },
        ] },
      { type: "content", kicker: "A percentage of what", title: "Your remuneração de referência.",
        body: "The six oldest of your last eight months of registered earnings, divided by 180. Holiday and Christmas subsidies are excluded from it." },
      { type: "figure", kicker: "There is a floor", figure: "€9,20", figureLabel: "Per day, minimum",
        title: "It never falls below this.",
        body: "That is 30% of the minimum monthly wage, which is €920 in 2026." },
      { type: "cta", kicker: "One exception worth knowing", title: "Some cases pay from day one.",
        body: "A hospital stay, day surgery or tuberculosis: no waiting days at all.", action: "Save this before you need it." },
    ],
    caption: {
      hook: "Sick leave in Portugal: the first days pay nothing, and what follows is never your full pay. The whole table, in one place.",
      body: `When it starts — the período de espera:
· On a contract (trabalhador por conta de outrem) — paid from the 4th day
· On recibos verdes (trabalhador independente) — from the 11th day
· Voluntary social insurance — from the 31st day
· No waiting at all for a hospital stay, day surgery, or tuberculosis

What you receive, as a percentage of your remuneração de referência:
· Up to 30 days — 55%
· 31 to 90 days — 60%
· 91 to 365 days — 70%
· More than 365 days — 75%

The 55% and 60% bands rise by 5 percentage points if your reference pay is €500 or less, or if you have three or more dependent children.

The reference pay is the six oldest of your last eight months of registered earnings divided by 180, with holiday and Christmas subsidies excluded. Whatever that produces, the daily amount is never below €9,20 — 30% of the minimum wage, €920 in 2026.

How long it can run: up to 1.095 days on a contract, 365 days on recibos verdes.

Source: ISS, Guia Prático – Subsídio de Doença.`,
      cta: "Finkavo tells you which rule is yours, with the source.",
      tags: tags("#baixamedica", "#segurancasocial", "#recibosverdes"),
    },
  },

  // ---------------------------------------------------------------- 15 Sep — employment
  {
    id: "ferias-regras",
    day: "2026-09-15",
    photo: "calendar",
    source: "Código do Trabalho · art. 238.º, 239.º, 240.º e 245.º",
    title: "Holiday days: the rules people get wrong",
    slides: [
      { type: "cover", kicker: "Working in Portugal", title: "Your holiday days do not roll over.",
        body: "\"You have until April\" is a concession, not a right." },
      { type: "figure", kicker: "What you are owed", figure: "22 days", figureLabel: "Dias úteis, minimum",
        title: "Every year, as a legal floor.",
        body: "Dias úteis are Monday to Friday. Public holidays do not count against them." },
      { type: "content", kicker: "When you have to take them", title: "In the year they accrue.",
        body: "That is the rule in art. 240.º n.º 1. Running them to 30 April of the next year needs your employer to agree, or that you are taking them with family living abroad." },
      { type: "content", kicker: "Your first year is different", title: "Two days for each month worked.",
        body: "Up to 20 days, and you can only take them after six complete months of the contract." },
      { type: "content", kicker: "If you leave with days left", title: "They are paid out.",
        body: "You receive the holiday pay and the holiday subsídio for days accrued and not taken, plus the proportional part for your final year." },
      { type: "cta", kicker: "Do this now", title: "Count what you have left, then book it.",
        body: "If you want the April extension, get the yes in writing.", action: "The default is 31 December." },
    ],
    caption: {
      hook: "Working in Portugal: your holiday days do not automatically roll into next year. \"You have until April\" gets repeated as though it were a right — it is a concession your employer has to agree to.",
      body: `How much — art. 238.º:
· 22 dias úteis a year, as a legal minimum
· Dias úteis are Monday to Friday; public holidays do not count against them

When — art. 240.º:
· The rule is the calendar year in which they accrue
· They can run to 30 April of the following year only if your employer agrees, or if you are taking them with a family member living abroad
· Up to half of last year's days can be added to this year's, again by agreement

Your first year — art. 239.º: two working days for each month of the contract, up to 20 days, and only after six complete months.

If you leave with days untaken — art. 245.º: you are paid the holiday pay and the holiday subsídio for the days you accrued and did not take, plus the proportional part for your final year.

If you want the April extension, ask for it in writing. A yes you cannot show is a yes you do not have.`,
      cta: "Finkavo tracks what you are owed, with the article behind it.",
      tags: tags("#ferias", "#direitodotrabalho", "#trabalharemportugal"),
    },
  },

  // ---------------------------------------------------------------- 16 Sep — social security
  {
    id: "desemprego-quem",
    day: "2026-09-16",
    photo: "jobless",
    source: "ISS · Guia Prático Subsídio de Desemprego",
    title: "Unemployment benefit: the two conditions",
    slides: [
      { type: "cover", kicker: "Losing your job in Portugal", title: "Quitting usually means no unemployment pay.",
        body: "There are two conditions, and this is the one people meet too late." },
      { type: "figure", kicker: "The work record", figure: "360 days", figureLabel: "In the last 24 months",
        title: "Of employed work with registered earnings.",
        body: "Counted in the 24 months before the date you become unemployed." },
      { type: "content", kicker: "The second condition", title: "It has to be involuntary.",
        body: "A dismissal counts. A fixed-term contract reaching its end counts. Handing in your notice normally does not, and your employer's declaration is what proves which it was." },
      { type: "rows", kicker: "What counts towards the 360", title: "More than days at a desk.",
        rows: [
          { key: "Days you worked", value: "Yes" },
          { key: "Sickness or parental benefit", value: "Yes" },
          { key: "Self-employed with unemployment cover", value: "Yes" },
        ] },
      { type: "cta", kicker: "Before you hand in notice", title: "Check both, in this order.",
        body: "The days first, then the reason for leaving.", action: "Afterwards is too late to change either." },
    ],
    caption: {
      hook: "Losing your job in Portugal: there are two conditions for subsídio de desemprego, and the one people discover too late is that resigning normally rules you out.",
      body: `1. The work record — the prazo de garantia. You need 360 days of employed work with registered earnings in the 24 months before the date you become unemployed.

2. The reason. The unemployment has to be involuntary, and your employer's declaration is what proves it. A dismissal counts. A fixed-term contract reaching its end counts. Handing in your notice normally does not.

What counts towards the 360 days:
· Days you actually worked
· Days as a trabalhador independente, where your contribution rate includes unemployment cover
· Days you were receiving sickness or parental benefit — the social parental benefits excepted

If you are weighing up leaving, this is worth checking before you write the letter rather than after. Neither condition can be fixed retrospectively.

Source: ISS, Guia Prático – Subsídio de Desemprego.`,
      cta: "Finkavo checks whether you would qualify, with the source.",
      tags: tags("#subsidiodedesemprego", "#segurancasocial", "#direitodotrabalho"),
    },
  },

  // ---------------------------------------------------------------- 17 Sep — employment
  {
    id: "abstencao-contacto",
    day: "2026-09-17",
    photo: "disconnect",
    source: "Código do Trabalho · art. 199.º-A",
    title: "Your employer cannot message you after hours",
    slides: [
      { type: "cover", kicker: "Working in Portugal", title: "Your employer cannot message you after hours.",
        body: "It is not office etiquette. It is article 199.º-A." },
      { type: "content", kicker: "Which time is protected", title: "Every rest period you have.",
        body: "The daily rest after your normal hours, weekly days off, public holidays, breaks, and your annual leave." },
      { type: "content", kicker: "Who it covers", title: "Every employment relationship.",
        body: "On site or remote, full time or part time. Teleworking does not remove it — the rule was written with remote work in mind." },
      { type: "content", kicker: "The one exception", title: "Force majeure, and nothing less.",
        body: "Something unforeseeable and unavoidable that could destroy or seriously damage the company. A busy week is not force majeure." },
      { type: "content", kicker: "The second protection", title: "You cannot be punished for resting.",
        body: "Treating you less favourably — in your conditions or your progression — because you exercised this right is legally discriminatory." },
      { type: "cta", kicker: "If it keeps happening", title: "Breaching it is a contraordenação grave.",
        body: "That is a formal category, not a figure of speech.", action: "Save this and keep the messages." },
    ],
    caption: {
      hook: "Working in Portugal: your employer has a legal duty not to contact you during your rest time. It is not workplace etiquette — it is article 199.º-A of the Código do Trabalho.",
      body: `What the law says, introduced by Lei 83/2021:

· The employer must abstain from contacting you during your rest periods
· It applies to every employment relationship, on site or remote
· Rest periods means the daily rest after your normal hours, weekly days off, public holidays, breaks, and your annual leave

The exception is force majeure — something unforeseeable and unavoidable that could destroy or seriously damage the company. A busy week, a client deadline and a manager's preference are not force majeure.

There is a second protection that matters as much: treating you less favourably because you exercised this right — in your working conditions or your progression — is legally discriminatory.

Breaching it is a contraordenação grave. That is a formal category in the labour code, not a turn of phrase.

If it is a pattern rather than an accident, keep the messages. Dates and times are what make it a pattern.`,
      cta: "Finkavo points you to the article behind your rights.",
      tags: tags("#direitoadesconexao", "#teletrabalho", "#direitodotrabalho"),
    },
  },
];
