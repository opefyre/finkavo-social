/**
 * Four carousels, 3–6 October 2026, posted at 18:00 Lisbon. Design v2. Written for a reader with no background: every term is
 * explained where it first appears, and each carousel follows one story (a situation → the rule → what it means for you → what to do).
 * Every figure was checked against primary sources on 21 September 2026:
 *
 * - The tax alphabet: Portal das Finanças guide to access (senhas_PF_EN.pdf, Senha_de_acesso), Modelo 3 page (1 April – 30 June),
 *   CIVA art. 18.º (mainland rates 6% / 13% / 23%, last update 24 Mar 2025), CIMT art. 22.º (IMT settled before the deed), Tabela
 *   Geral do Selo verba 1.1 (0,8%), gov.pt "Pagar o IMI" (bill by 30 April; instalments May / August / November by amount) and
 *   "Pagar o IUC" (due by the end of the month of registration; no bill by post).
 * - The family gift: CIS arts. 1.º n.º 3 c), 3.º, 6.º e), 26.º, 28.º; Tabela Geral verbas 1.1 and 1.2; CIRS art. 9.º; Portal page
 *   "Doação". The sources disagree on whether a cash gift to an exempt relative must be declared; the carousel says so.
 * - The lease: CIS art. 60.º n.º 1–4 (landlord reports by the end of the month after the lease starts; tenant may report, Lei 56/2023),
 *   Portaria 106/2025/1 (tenant form, from 1 Aug 2025), CIRS art. 78.º-E n.º 2 and art. 115.º, Tabela Geral verba 2, Portal pages on
 *   rent receipts.
 * - Debt expiry: LGT arts. 48.º and 49.º, CPPT arts. 175.º, 191.º, 196.º, 203.º, 204.º, Portal page on debts in enforcement.
 */
export const DESIGN = "v2";
const tags = (...extra) => [...extra.slice(0, 3), "#viveremportugal", "#Finkavo"];

export const SPECS = [
  // ---------------------------------------------------------------- 3 Oct — the tax alphabet
  {
    id: "impostos-abc",
    day: "2026-10-03",
    source: "Portal das Finanças · gov.pt",
    title: "The six taxes you will meet in Portugal",
    slides: [
      { type: "cover", kicker: "Portugal tax, from zero", icon: "coin", title: "Six Portuguese taxes, and the moment each one *arrives*.",
        body: "A plain-English map for anyone new to Portugal." },
      { type: "content", kicker: "Start here", icon: "shield", title: "First, who collects them?",
        body: "Finanças is the tax authority (officially the Autoridade Tributária e Aduaneira). You use its website, the Portal das Finanças, with your NIF (tax number) and a password posted to you, or with the Chave Móvel Digital (a phone-based digital ID)." },
      { type: "rows", kicker: "Every day, every spring", title: "Two taxes follow you everywhere.",
        rows: [
          { key: "IVA · tax on what you buy", value: "Already in the price" },
          { key: "IVA rates on the mainland", value: "6%, 13% or 23%" },
          { key: "IRS · tax on what you earn", value: "Return: April–June" },
          { key: "Tax taken from your pay", value: "Settled in the return" },
        ] },
      { type: "steps", kicker: "When you buy a home", title: "A home brings three taxes.",
        steps: [
          { title: "IMT, once", text: "The tax on buying property. You pay it before you sign the deed." },
          { title: "Imposto do Selo, once", text: "Stamp duty: 0,8% of the price, on top of IMT." },
          { title: "IMI, every year", text: "The tax on owning it. The bill comes by April; larger bills split into May, August and November." },
        ] },
      { type: "content", kicker: "When you own a car", icon: "car", title: "A car brings one: the IUC.",
        body: "IUC (Imposto Único de Circulação) is a yearly tax on vehicles registered in Portugal, due by the end of the month of the car's registration. No bill arrives by post: get the payment reference on the Portal." },
      { type: "content", kicker: "Two name traps", icon: "tag", title: "Same letters, different things.",
        body: "IMT is the tax you pay when you buy property. It is also the name of a transport institute that handles driving licences and vehicles. And Imposto do Selo is separate from IMT: on a home you pay both." },
      { type: "cta", kicker: "Your first step", title: "Get your Portal access before you need it.",
        body: "With it you can see your notices and your payment references. Then check which of the six apply to you.",
        action: "Save this for your first year." },
    ],
    caption: {
      hook: "New to Portugal? Six taxes will meet you, each at a different moment. A plain-English map.",
      body: `First, who collects them: Finanças is the tax authority (officially the Autoridade Tributária e Aduaneira, AT). Its website is the Portal das Finanças. You log in with your NIF (Número de Identificação Fiscal, your tax number) and an access password posted to your address, or with the Chave Móvel Digital or Cartão de Cidadão. The NIF comes first.

The six taxes:

· IVA (VAT) — added to prices, so it is already in what you pay. Mainland rates: 6%, 13% or 23% depending on the goods and services (the Azores and Madeira have lower rates)
· IRS (Imposto sobre o Rendimento das Pessoas Singulares) — tax on what you earn. The annual return is filed from 1 April to 30 June of the following year. Tax withheld from your pay during the year is settled in that return: you either owe more or get a refund
· IMT (Imposto Municipal sobre as Transmissões Onerosas de Imóveis) — paid when you buy property, before the deed
· Imposto do Selo (stamp duty) — small taxes on specific acts. On buying a property it is 0,8% of the price, on top of IMT
· IMI (Imposto Municipal sobre Imóveis) — the yearly tax on owning property. The bill arrives by 30 April. Up to €100 is paid in May; above that it splits in two (May, November) or three (May, August, November) as the amount grows
· IUC (Imposto Único de Circulação) — the yearly tax on vehicles registered in Portugal, paid by the end of the month of the registration. No bill arrives by post: get the payment reference on the Portal

A trap: "IMT" is also the name of a public institute for mobility and transport (driving licences, vehicles). It has nothing to do with the property tax.

Rates for IRS, IMT, IMI and IUC depend on your case and change, so check the current figures for yours.

Source: Portal das Finanças (access guide, Modelo 3, CIVA art. 18.º, CIMT art. 22.º, Tabela Geral do Imposto do Selo); gov.pt (Pagar o IMI, Pagar o IUC).`,
      cta: "Not sure which of these applies to you? Ask Finkavo — every answer cites the law.",
      tags: tags("#impostosportugal", "#expatsportugal", "#financas"),
    },
  },

  // ---------------------------------------------------------------- 4 Oct — family gift for a home
  {
    id: "doacao-familia-casa",
    day: "2026-10-04",
    source: "Código do Imposto do Selo · Portal das Finanças",
    title: "Family money for a home: is the gift taxed?",
    slides: [
      { type: "cover", kicker: "Helping with a home", icon: "house", title: "Family money for a home: is the gift *taxed*?",
        body: "A €30.000 gift from a parent, explained from zero." },
      { type: "content", kicker: "The short answer", icon: "coin", title: "Between close family, no.",
        body: "A gift of money from a parent to a child is exempt from Imposto do Selo, the tax on gifts. It is also not taxable income. The same goes for spouses or partners." },
      { type: "content", kicker: "The tax on gifts", icon: "tag", title: "Gifts are taxed at ten percent.",
        body: "Imposto do Selo (stamp duty) charges 10% of the value of a gift, and the person who receives it pays. Money counts, even when it sits in a bank account." },
      { type: "rows", kicker: "Who pays what", title: "Only close family is exempt.",
        rows: [
          { key: "A parent gives to a child", value: "Exempt" },
          { key: "A child gives to a parent", value: "Exempt" },
          { key: "A spouse or partner", value: "Exempt" },
          { key: "Sibling, friend or anyone else", value: "10%" },
        ] },
      { type: "versus", kicker: "The trap", title: "Money is exempt. A gifted home is not.",
        versus: [
          { label: "Myth", text: "“A gift from my parents is tax-free, whatever it is.”" },
          { label: "Fact", text: "A gifted property still pays 0,8% stamp duty. Only the 10% is waived." },
        ] },
      { type: "steps", kicker: "What to do", title: "Leave a clear paper trail.",
        steps: [
          { title: "Pay by bank transfer", text: "Add a clear reference, such as “doação”." },
          { title: "Keep the proof", text: "The transfer record and the family link. A big unexplained deposit can raise questions." },
          { title: "If unsure, ask Finanças", text: "Finanças is the tax authority. Sources differ on declaring a cash gift to family. Ask within 3 months." },
        ] },
      { type: "cta", kicker: "Before you transfer", title: "Family gifts are simple. Property is not.",
        body: "Money between parents and children is exempt. A gifted property pays 0,8% stamp duty and has to be declared. Not sure? Ask before the money moves.",
        action: "Send this to someone buying a home." },
    ],
    caption: {
      hook: "Your parents want to help you buy a home in Portugal. Is a gift of money taxed? Between close family, no — but a gifted property is a different story.",
      body: `The tax on gifts is Imposto do Selo (stamp duty), verba 1.2: 10% of the value, paid by the person who receives the gift. Money counts, including money in a bank account.

Who is exempt: a spouse or partner (união de facto), descendants (children, grandchildren) and ascendants (parents, grandparents). Everyone else — siblings, cousins, friends — pays the 10%. Gifts of money are not taxable income (IRS) either.

The trap: the exemption covers the 10% only. A gifted property still pays 0,8% stamp duty (verba 1.1) and its transfer has to be declared.

The paperwork for a cash gift to an exempt relative is not clear-cut. The stamp-duty code says beneficiaries of exempt gifts are dispensed from declaring them; the Portal's page on gifts says the beneficiary files a declaration (Modelo 1 do Imposto do Selo, on e-balcão) by the end of the third month after the gift. If you want certainty, ask Finanças within that period.

What to do: pay by bank transfer with a clear reference, and keep the transfer record and proof of the family link. A large unexplained deposit can raise questions from Finanças.

Not covered here: non-residents, other countries' taxes, and the IMT and stamp duty on the home purchase itself. This is general information, not advice for your case.

Source: Código do Imposto do Selo (arts. 1.º, 3.º, 6.º, 26.º, 28.º; Tabela Geral, verbas 1.1 and 1.2); CIRS art. 9.º; Portal das Finanças, "Doação".`,
      cta: "Planning a family gift? Ask Finkavo — every answer cites the law.",
      tags: tags("#doacao", "#comprarcasa", "#impostodoselo"),
    },
  },

  // ---------------------------------------------------------------- 5 Oct — the lease
  {
    id: "contrato-arrendamento-financas",
    day: "2026-10-05",
    source: "Código do Imposto do Selo · CIRS",
    title: "Did your landlord tell Finanças about your lease?",
    slides: [
      { type: "cover", kicker: "Renting in Portugal", icon: "house", title: "Your landlord must report your lease. *Did they?*",
        body: "What it means for a tenant, and what you can do about it." },
      { type: "content", kicker: "The rule", icon: "doc", title: "A lease is invisible until it is reported.",
        body: "Your landlord has to tell Finanças, the tax authority, about the lease, on the Portal das Finanças website. The deadline is the end of the month after the lease starts: a lease starting on 5 March is due by 30 April." },
      { type: "rows", kicker: "What the landlord owes", title: "Three duties for every lease.",
        rows: [
          { key: "Report the lease", value: "By end of next month" },
          { key: "Pay the stamp duty", value: "10% of a month's rent" },
          { key: "Issue a rent receipt", value: "Each rent payment" },
        ] },
      { type: "content", kicker: "Why tenants care", icon: "receipt", title: "Unreported rent can cost you the deduction.",
        body: "In your income-tax return (IRS) you can deduct 15% of your rent, up to a cap. Only rent that Finanças has on record counts, through the landlord's electronic rent receipts." },
      { type: "steps", kicker: "Check it yourself", title: "A three-minute check.",
        steps: [
          { title: "Log in to the Portal das Finanças", text: "Use your NIF (tax number) and password." },
          { title: "Look for your rent receipts", text: "They appear in your name once the landlord issues them." },
          { title: "Nothing there? Ask your landlord", text: "Ask them to report the lease and issue the receipts." },
        ] },
      { type: "versus", kicker: "Myth or fact", title: "You are not stuck if they do not.",
        versus: [
          { label: "Myth", text: "“If my landlord will not report it, I can do nothing.”" },
          { label: "Fact", text: "Since August 2025 a tenant can report the lease too, on the Portal, once the landlord's deadline has passed." },
        ] },
      { type: "cta", kicker: "Before IRS season", title: "Check your rent receipts before you file.",
        body: "The income-tax return (IRS) is filed from April to June. Have your receipts sorted before then.",
        action: "Save this for spring." },
    ],
    caption: {
      hook: "In Portugal your landlord has to report your rental contract to Finanças. If they do not, you can lose your rent deduction — and you can do something about it.",
      body: `The rule (Código do Imposto do Selo, art. 60.º): the landlord communicates the lease to the tax authority on the Portal das Finanças (Modelo 2 do Imposto do Selo). The deadline is the end of the month after the lease starts — a lease starting on 5 March is due by 30 April.

What the landlord owes for each lease:
· Reporting the lease
· Stamp duty of 10% of one month's rent, due by the same deadline
· An electronic rent receipt each time rent is paid (with exceptions: for example, landlords aged 65 or over and rural leases file an annual declaration instead)

Why tenants care: the rent deduction in your income-tax return, the IRS (15% of the rent, up to a cap) for your permanent home counts only rent that Finanças has on record through the landlord's electronic rent receipts or annual declaration. In practice, an unreported lease means no receipts, and the deduction is at risk. The cap is changing, so check the current figure before you file.

Check yourself: log in to the Portal das Finanças with your NIF and password and look for your rent receipts. Nothing there? Ask your landlord.

If your landlord will not report the lease, the law (Lei 56/2023, and Portaria 106/2025/1 in force since 1 August 2025) lets the tenant communicate it too, using a form on the Portal, once the landlord's deadline has passed. Older Finanças FAQs still say tenants cannot.

Not covered: leases signed before 1 April 2015 (old rules), and short-term holiday lets. General information, not advice for your case.

Source: CIS art. 60.º and Tabela Geral (verba 2); CIRS arts. 78.º-E and 115.º; Portal das Finanças, rent receipts; Portaria 106/2025/1.`,
      cta: "Not sure your lease is in order? Ask Finkavo — every answer cites the law.",
      tags: tags("#arrendamento", "#inquilinos", "#irs"),
    },
  },

  // ---------------------------------------------------------------- 6 Oct — old tax debt
  {
    id: "divida-antiga-prescricao",
    day: "2026-10-06",
    source: "LGT arts. 48.º–49.º · CPPT",
    title: "An old tax debt: does it expire?",
    slides: [
      { type: "cover", kicker: "Old tax debts", icon: "clock", title: "An old tax debt arrives. Has it *expired*?",
        body: "Yes, tax debts can expire. But not on their own." },
      { type: "content", kicker: "The idea", icon: "clock", title: "Debts can expire after eight years.",
        body: "The word is prescription: after enough time, Finanças (the tax authority) loses the right to collect a tax debt. In general the period is 8 years." },
      { type: "rows", kicker: "When the clock starts", title: "It depends on the kind of tax.",
        rows: [
          { key: "Yearly taxes, like income tax", value: "End of that year" },
          { key: "One-off taxes", value: "Date of the event" },
          { key: "VAT and tax withheld at source", value: "Start of the next year" },
          { key: "Some special cases", value: "15 years" },
        ] },
      { type: "content", kicker: "What stops the clock", icon: "shield", title: "Some actions stop the clock.",
        body: "A formal notice (citação), a complaint or an appeal against the assessment interrupts it. An instalment plan or a pending challenge suspends it. So the real time can be longer than eight years." },
      { type: "figure", kicker: "The clock, in one example", figure: "2024", figureLabel: "when an income-tax debt from 2016 would expire",
        title: "Yearly taxes count from the end of the year.",
        body: "2016 plus 8 years, if nothing interrupted or paused the clock." },
      { type: "versus", kicker: "The catch", title: "Expired does not mean erased.",
        versus: [
          { label: "Myth", text: "“The debt disappears by itself after eight years.”" },
          { label: "Fact", text: "Raise it: object within 30 days of the notice (oposição). A judge can also recognise it." },
        ] },
      { type: "cta", kicker: "If a letter arrives", title: "Do not ignore it. Do not assume.",
        body: "Check the tax and the year. Find the process on the Portal: Consulta Dívidas Fiscais, Dívidas em Execução Fiscal. Mind the 30 days.",
        action: "Save this. Share it with someone who got a letter." },
    ],
    caption: {
      hook: "A letter arrives about a tax debt from years ago. Can a debt to Finanças expire? Yes — but not by itself.",
      body: `The idea is called prescription: after enough time, the tax authority loses the right to collect. In general the period is 8 years (Lei Geral Tributária, art. 48.º), with exceptions.

When the clock starts:
· Taxes for a period, such as IRS (income tax) and IMI (property tax) — at the end of the year the tax relates to
· One-off taxes — on the date of the event
· IVA (VAT) and income tax collected by definitive withholding at source — from the start of the year after it became due
· Some special cases have a 15-year period

What stops the clock (art. 49.º): a citação (formal notice), a complaint, an appeal or an impugnação interrupts it — once. An instalment plan, or a challenge that suspends collection, suspends it. So the real time can be longer than 8 years.

Example: an income-tax (IRS) debt for 2016 would expire around the end of 2024 — if nothing interrupted or suspended the clock.

The catch: expired does not mean erased. Prescription has to be raised: you can object (oposição à execução fiscal) within 30 days of the citação, and a judge can also recognise it (CPPT arts. 175.º, 203.º, 204.º).

If a letter arrives: check the tax and the year, find the process on the Portal das Finanças (Consulta Dívidas Fiscais, Dívidas em Execução Fiscal), and do not let the 30 days pass.

Social Security debts follow their own rules. General information, not advice for your case.

Source: LGT arts. 48.º and 49.º; CPPT arts. 175.º, 191.º, 196.º, 203.º, 204.º; Portal das Finanças.`,
      cta: "Received a notice? Ask Finkavo — every answer cites the law.",
      tags: tags("#dividas", "#prescricao", "#financas"),
    },
  },
];
