/**
 * Ten carousels, one a day, 23 September – 2 October 2026, posted at 18:00 Lisbon (reels go out at 09:00).
 * All tax and admin. Every figure was checked against primary sources on 21 September 2026:
 *
 * - Deductions: CIRS arts. 78.º-A to 78.º-F and 84.º as published on the Portal das Finanças; rent cap €900 for 2026
 *   (Decreto-Lei 97/2026 transitional note); AT e-Fatura page (pending invoices, end of February; deductions from 15 March).
 * - First month: AIMA pages (address proof, guidance of 29.11.2025), Lei 37/2006 arts. 14 and 30 (EU registration, via the
 *   pgdlisboa.pt consolidation), AT leaflet on address change for foreign nationals (60 days), Banco de Portugal basic-account brochure.
 * - Seizure: CPPT arts. 189, 196, 203, 223, 244; CPC art. 738.º (read on pgdlisboa.pt); minimum wage €920 (DGERT).
 * - Buying: Portal das Finanças IMT table for 2026 (Lei 73-A/2025), Selo verba 1.1 (0,8%), IRN fee schedule. The worked example is
 *   computed with the official marginal rates; the "parcela a abater" figures were cross-checked, not read on a primary page.
 * - Baby: gov.pt and Portal da Justiça guides; CIRS art. 78.º-A (€600 + €126 for a child of three or under = €726).
 * - Foreign accounts: Modelo 3 Anexo J instructions (quadro 11) and AT FAQ 653.
 * - Heirs: Balcão das Heranças page (fees), justica.gov.pt (order of the cabeça-de-casal), Código Civil arts. 2071, 2079.
 * - Residency: CIRS arts. 15.º, 16.º; LGT art. 19.º n.º 5; AT leaflet on address change.
 * - Cash: LGT art. 63.º-E (n.º 1, 2, 3, 4, 5), RGIT art. 129.º n.º 3.
 * - IVA: CIVA art. 53.º and Ofício-Circulado 25062/2025.
 *
 * The serif headline cannot carry a 3 (Fraunces draws it as a 5), so headlines carry no digits at all: numbers live in
 * chips, rows, figures and body copy, all Noto Sans.
 */

const tags = (...extra) => [...extra.slice(0, 3), "#viveremportugal", "#Finkavo"];

export const SPECS = [
  // ---------------------------------------------------------------- 23 Sep — deductions
  {
    id: "deducoes-guia",
    day: "2026-09-23",
    photo: "calendar",
    source: "Código do IRS · arts. 78.º-A a 78.º-F, 84.º",
    title: "IRS deductions: the limits to know",
    slides: [
      { type: "cover", kicker: "Income tax · 2026 expenses", title: "Your expenses can cut your IRS. Know the caps.",
        body: "The main deductions, and the most each one can give back." },
      { type: "rows", kicker: "The big four", title: "What you get back, and the cap.",
        rows: [
          { key: "General family expenses", value: "35%, up to €250 each" },
          { key: "Health", value: "15%, up to €1.000" },
          { key: "Education and training", value: "30%, up to €800" },
          { key: "Rent", value: "15%, up to €900" },
        ] },
      { type: "content", kicker: "General family expenses", title: "Everyday spending counts too.",
        body: "35% of what you spend at restaurants, hairdressers, gyms, vets and on public transport, up to €250 per person (€500 on a joint return). Single-parent households get 45%, up to €335." },
      { type: "content", kicker: "Health", title: "Prescriptions can decide it.",
        body: "15% up to €1.000 per household. Health invoices at the normal VAT rate only count when the expense has a prescription flagged in e-Fatura." },
      { type: "rows", kicker: "Dependants", title: "A fixed amount for each one.",
        rows: [
          { key: "Each dependant", value: "€600" },
          { key: "Each ascendant at home", value: "€525" },
          { key: "Extra, child aged 3 or under", value: "+ €126" },
          { key: "Extra, 2nd and later child, 6 or under", value: "+ €300" },
        ] },
      { type: "content", kicker: "The catch", title: "No NIF on the invoice, no deduction.",
        body: "Ask for your NIF every time. If you forget, you can still add the invoice in the e-Fatura app with its QR code or ATCUD." },
      { type: "cta", kicker: "Before the deadline", title: "Check e-Fatura, then file.",
        body: "Validate pending invoices by the end of February. The deductions appear from 15 March and you can dispute them until 31 March.",
        action: "Save this for February." },
    ],
    caption: {
      hook: "Your everyday expenses can lower your IRS — but each deduction has a cap. Here are the main ones for expenses paid in 2026.",
      body: `The main deductions (Código do IRS):

· General family expenses — 35%, up to €250 per person (€500 on a joint return). Single-parent household: 45%, up to €335
· Health — 15%, up to €1.000 per household. Normal-rate VAT invoices need a prescription flagged in e-Fatura
· Education and training — 30%, up to €800
· Rent — 15%, up to €900 for rent paid in 2026 (€1.000 from 2027). The lease must be reported and the rent shown on receipts
· Care homes — 25%, up to €403,75

Dependants: €600 each, €525 for each ascendant living with you, plus €126 for a child aged 3 or under, or €300 for a second and later child aged 6 or under. The two extras do not stack.

How the expenses reach the deduction: ask for your NIF on every invoice. Validate pending invoices in e-Fatura by the end of February. Finanças publishes the deductions from 15 March.

There is also an overall cap on some of these deductions that depends on your income; check the Portal's simulator for your case.

Source: CIRS arts. 78.º-A to 78.º-F and 84.º; Portal das Finanças e-Fatura page.`,
      cta: "Not sure what you can deduct? Ask Finkavo — every answer cites the law.",
      tags: tags("#irs", "#deducoes", "#efatura"),
    },
  },

  // ---------------------------------------------------------------- 24 Sep — first month
  {
    id: "primeiro-mes",
    day: "2026-09-24",
    photo: "aima",
    photoPos: "center 100%",
    source: "AIMA · Lei 37/2006 · Portal das Finanças",
    title: "Your first month in Portugal: the checklist",
    slides: [
      { type: "cover", kicker: "Moving to Portugal", title: "Your first month: what to sort, and in what order.",
        body: "The steps, and the deadlines people miss." },
      { type: "rows", kicker: "The order", title: "Start with the tax number.",
        rows: [
          { key: "1 · NIF", value: "Your tax number" },
          { key: "2 · Bank account", value: "The bank asks for the NIF" },
          { key: "3 · NISS", value: "When work starts" },
          { key: "4 · Residence", value: "EU registration, or AIMA" },
        ] },
      { type: "content", kicker: "NIF", title: "Anyone can get one.",
        body: "You can request a NIF whether or not you live in Portugal, and there is no deadline. Banks ask for it, so it comes first." },
      { type: "content", kicker: "Bank account", title: "Ask about the basic account.",
        body: "For people with no other current account: no minimum deposit, yearly cost capped at 1% of the IAS, and the bank must answer within 10 working days. Open another current account first and you lose it." },
      { type: "content", kicker: "EU citizens", title: "Register after three months.",
        body: "Staying more than three months? Register at your municipality within 30 days after those three months. Missing it can mean a fine of €400 to €1.500." },
      { type: "content", kicker: "Non-EU citizens", title: "Address proof is the sticking point.",
        body: "AIMA accepts a sworn declaration plus a property certificate, a lease with last month's rent receipt, or a loan-for-use contract. A Junta de Freguesia attestation is not accepted." },
      { type: "cta", kicker: "The step people miss", title: "Tell Finanças where you live.",
        body: "Once you count as a tax resident, update your address within 60 days. The Portal's own address form does not cover non-resident to resident: use e-balcão or an appointment.",
        action: "Save this for your first month." },
    ],
    caption: {
      hook: "Just moved to Portugal? Here is the order to sort your admin — and the deadlines people miss.",
      body: `A first-month checklist:

1. NIF (tax number) — anyone can request one, resident or not. No deadline. Banks ask for it
2. Bank account — Banco de Portugal's basic account has no minimum deposit and a yearly cost capped at 1% of the IAS, for people with no other current account
3. NISS (Social Security number) — needed when work starts
4. Residence — EU/EEA citizens staying over three months register at the municipality within 30 days after those three months (a fine of €400 to €1.500 applies to missing it). Non-EU citizens go through AIMA; the address proof it accepts is a sworn declaration plus a property certificate, a lease with last month's rent receipt, or a loan-for-use contract
5. Finanças — once you are a tax resident (more than 183 days, or a home you mean to keep), update your address within 60 days. Foreign nationals with an address abroad cannot do this on the Portal's self-service form: use e-balcão, an appointment, or a Loja do Cidadão

Check current requirements on AIMA and gov.pt before you go: procedures change.

Source: AIMA guidance; Lei 37/2006; Portal das Finanças leaflet on address change for foreign nationals; Banco de Portugal.`,
      cta: "Stuck on a step? Ask Finkavo — every answer cites the law.",
      tags: tags("#mudarparaportugal", "#nif", "#aima"),
    },
  },

  // ---------------------------------------------------------------- 25 Sep — seizure
  {
    id: "penhora-limites",
    day: "2026-09-25",
    photo: "rent",
    source: "CPPT · Código de Processo Civil art. 738.º",
    title: "What Finanças can and cannot seize",
    slides: [
      { type: "cover", kicker: "Tax debts", title: "Owing Finanças does not mean losing everything.",
        body: "What can be seized, what is protected, and the step that stops it." },
      { type: "rows", kicker: "Your salary", title: "Two-thirds is protected.",
        rows: [
          { key: "Protected", value: "2/3 of net pay" },
          { key: "Seizable", value: "About 1/3" },
          { key: "Protection is capped at", value: "3 minimum wages" },
          { key: "Minimum wage in 2026", value: "€920" },
        ] },
      { type: "content", kicker: "Your bank account", title: "One minimum wage is protected.",
        body: "One minimum wage of the balance (€920 in 2026) cannot be seized. It is not added on top of the salary protection." },
      { type: "content", kicker: "Your home", title: "It can be seized, but not sold.",
        body: "If it is your own permanent home, Finanças cannot sell it, except for a high-value home in the top IMT bracket, and only a year after the oldest debt fell due. You can waive the protection." },
      { type: "content", kicker: "The clock", title: "You have thirty days.",
        body: "The notice (citação) gives you 30 days to pay, to oppose, or to ask to pay with an asset. You can ask for instalments any time until the sale is scheduled." },
      { type: "content", kicker: "What can stop it", title: "A payment plan can stop it.",
        body: "Ask for instalments, usually up to 36. Individuals owing under €5.000 need no guarantee. It does not cover tax that was withheld and not paid over." },
      { type: "cta", kicker: "The move", title: "Do not wait for the seizure.",
        body: "Check your debts on the Portal das Finanças (Dívidas em execução fiscal) and ask for an instalment plan at e-balcão or your Serviço de Finanças.",
        action: "Save this. Share it with someone who owes." },
    ],
    caption: {
      hook: "Owing Finanças does not mean losing everything: the law protects part of your pay, your account and your home.",
      body: `What can and cannot be seized in tax enforcement:

· Salary or pension — two-thirds of the net amount is protected, so about one-third can be seized. The protection is capped at 3 minimum wages (€920 each in 2026). One minimum wage is protected only if you have no other income
· Bank account — one minimum wage of the balance is protected. It is not added to the salary protection
· Permanent home — it can be seized, but not sold if it is your own permanent residence, except for a high-value home (top IMT bracket) and only one year after the oldest debt fell due. You can waive it
· Also protected: essential household items, tools you need for your work, and things the law lists as unseizable

The process: the notice gives you 30 days to pay, oppose, or offer an asset. You can ask for instalments (usually up to 36) any time until the sale is scheduled. Individuals owing under €5.000 need no guarantee. Instalments are not available for tax withheld and not paid over.

What to do: check your debts on the Portal das Finanças (Dívidas em execução fiscal) and ask for a plan at e-balcão or your Serviço de Finanças.

Source: CPPT arts. 189, 196, 203, 223, 244; Código de Processo Civil art. 738.º; DGERT (minimum wage).`,
      cta: "Received a notice? Ask Finkavo — every answer cites the law.",
      tags: tags("#penhora", "#dividas", "#financas"),
    },
  },

  // ---------------------------------------------------------------- 26 Sep — buying costs
  {
    id: "comprar-casa-custos",
    day: "2026-09-26",
    photo: "ss",
    source: "Portal das Finanças · CIMT art. 17.º · IRN",
    title: "Buying a home: what you pay on top",
    slides: [
      { type: "cover", kicker: "Buying property", title: "The price is not the whole price.",
        body: "IMT, stamp duty and fees add about 4,5% to a €300.000 home." },
      { type: "rows", kicker: "A €300.000 permanent home", title: "What it costs on top.",
        rows: [
          { key: "IMT", value: "€10.542" },
          { key: "Imposto do Selo (0,8%)", value: "€2.400" },
          { key: "Deed (notary emolument)", value: "€175" },
          { key: "Property registration", value: "€250" },
        ] },
      { type: "figure", kicker: "Total in this example", figure: "€13.367", figureLabel: "about 4,5% of the price",
        title: "Before any agent or lawyer fees.",
        body: "IMT and Selo are charged on the higher of the price and the property's tax value." },
      { type: "rows", kicker: "IMT on a permanent home", title: "The rate rises with the price.",
        rows: [
          { key: "Up to €106.346", value: "0%" },
          { key: "€106.346 to €145.470", value: "2%" },
          { key: "€145.470 to €198.347", value: "5%" },
          { key: "€198.347 to €330.539", value: "7%" },
        ] },
      { type: "content", kicker: "Second homes", title: "Other homes pay more.",
        body: "The same €300.000 as a second home costs about €11.606 in IMT, because the rates start at 1% below €106.346. The Selo is the same." },
      { type: "content", kicker: "When you pay", title: "Before the deed, not after.",
        body: "IMT and Selo are paid before the purchase is completed, using the Modelo 1 do IMT on the Portal das Finanças. File it even if you are exempt." },
      { type: "cta", kicker: "Under 35?", title: "You may pay none of it.",
        body: "IMT Jovem can remove IMT and Selo on a first home. Check it before you sign the deed.",
        action: "Save this before you sign." },
    ],
    caption: {
      hook: "Buying a home in Portugal? The price is only the start: IMT, stamp duty and fees add about 4,5% on a €300.000 permanent home.",
      body: `A worked example for a €300.000 permanent home on the mainland, 2026:

· IMT — €10.542 (7% bracket, less the deduction for that bracket)
· Imposto do Selo — €2.400 (0,8% of the price)
· Deed — €175 (the notary's official emolument; notaries and lawyers may charge other fees)
· Registration — €250 (about €225 if requested online)
Total: about €13.367, before any agent or lawyer fees.

IMT for a permanent home rises by bracket: 0% up to €106.346, 2% to €145.470, 5% to €198.347, 7% to €330.539, 8% to €660.982, then 6% flat up to €1.150.853 and 7,5% above. A second home pays more: the same €300.000 costs about €11.606 in IMT.

IMT and Selo are charged on the higher of the price and the property's tax value. Both are paid before the purchase is completed, using the Modelo 1 do IMT on the Portal das Finanças — even if you are exempt.

Under 35 and buying a first home? IMT Jovem can remove IMT and Selo.

Source: Portal das Finanças IMT table (CIMT art. 17.º, Lei 73-A/2025); Imposto do Selo, verba 1.1; IRN fee schedule.`,
      cta: "Buying? Ask Finkavo what applies to your purchase — every answer cites the law.",
      tags: tags("#comprarcasa", "#imt", "#impostos"),
    },
  },

  // ---------------------------------------------------------------- 27 Sep — baby
  {
    id: "bebe-checklist",
    day: "2026-09-27",
    photo: "sick",
    source: "gov.pt · Portal da Justiça · Segurança Social · CIRS art. 78.º-A",
    title: "A baby is born: the admin checklist",
    slides: [
      { type: "cover", kicker: "New parents in Portugal", title: "The paperwork after a birth, in order.",
        body: "Register first: it unlocks the numbers you need next." },
      { type: "content", kicker: "Step one", title: "Register the birth.",
        body: "Within 20 days, free, even if the parents are foreign. Do it at the hospital's Nascer Cidadão desk, at a Conservatória, or online on the Portal da Justiça." },
      { type: "content", kicker: "Step two", title: "Request the baby's citizen card.",
        body: "Requesting the Cartão de Cidadão is what brings the NIF, the Segurança Social number and the health number. It is free until the first birthday." },
      { type: "content", kicker: "Health", title: "Get the health number.",
        body: "Portuguese citizens receive it with the card. Foreign residents get it the first time they go to a public health unit. The number alone does not guarantee free care." },
      { type: "content", kicker: "Family support", title: "Ask about the child benefit.",
        body: "Segurança Social may send an abono de família proposal after the card is created. If not, apply on Segurança Social Direta. It depends on household income and assets." },
      { type: "content", kicker: "Parental allowance", title: "You have six months to ask.",
        body: "The parental allowance must be requested within six months of the birth, or you lose the days of delay. It needs six months of contributions." },
      { type: "cta", kicker: "Taxes", title: "Add the baby to your IRS household.",
        body: "Tell Finanças about the change by 15 February, showing the household as it stood on 31 December. A child aged 3 or under gives a €726 dependant deduction.",
        action: "Save this for the first weeks." },
    ],
    caption: {
      hook: "A baby is born in Portugal: the paperwork, in the order that works — and the deadlines that matter.",
      body: `A checklist for new parents, including foreign parents:

1. Register the birth — within 20 days, free, mandatory even if the parents are foreign. At the hospital's Nascer Cidadão desk, a Conservatória, or online on the Portal da Justiça
2. Request the Cartão de Cidadão — it brings the NIF, the Segurança Social number and the health (utente) number. Free until the first birthday
3. Health number — automatic with the card for citizens; foreign residents get it at their first visit to a public health unit. The number does not by itself guarantee free care
4. Child benefit (abono de família) — Segurança Social may send a proposal; otherwise apply on Segurança Social Direta. Income and asset limits apply. Pre-natal abono exists from week 13 of pregnancy
5. Parental allowance — request within 6 months of the birth or lose the days of delay. Needs 6 months of contributions
6. IRS — communicate the household change by 15 February, showing the household on 31 December. A dependant is €600, plus €126 for a child aged 3 or under (€726)

Nationality rules for children born in Portugal have changed recently: check justica.gov.pt for your case.

Source: gov.pt guides; Portal da Justiça; Segurança Social; CIRS art. 78.º-A.`,
      cta: "Questions about a dependant or a benefit? Ask Finkavo — every answer cites the law.",
      tags: tags("#bebe", "#novospais", "#segurancasocial"),
    },
  },

  // ---------------------------------------------------------------- 28 Sep — foreign accounts
  {
    id: "contas-estrangeiro",
    day: "2026-09-28",
    photo: "iva",
    source: "Modelo 3 Anexo J · LGT art. 63.º-A",
    title: "Foreign accounts and your Portuguese IRS",
    slides: [
      { type: "cover", kicker: "Living in Portugal", title: "Your account abroad belongs in your Portuguese IRS.",
        body: "Even if it earned nothing, and even if it is dormant." },
      { type: "rows", kicker: "Where it goes", title: "Anexo J has a place for each.",
        rows: [
          { key: "Foreign bank account", value: "Quadro 11" },
          { key: "Foreign salary", value: "Quadro 4A" },
          { key: "Foreign rent", value: "Quadro 7A" },
          { key: "Foreign dividends and interest", value: "Quadro 8A" },
        ] },
      { type: "content", kicker: "Which accounts", title: "Signing rights count too.",
        body: "Declare accounts where you are the holder, a beneficiary, or authorised to move the money. Joint accounts and zero-balance accounts included." },
      { type: "content", kicker: "What you write", title: "Just who and where.",
        body: "Quadro 11 asks you to identify each account by IBAN and BIC, or by account number. It does not ask for the balance." },
      { type: "content", kicker: "Property and crypto", title: "Income and sales, not ownership.",
        body: "The form has fields for income from foreign property and for selling it, but none for simply owning it. The instructions do not say clearly whether an exchange or wallet counts as an account." },
      { type: "content", kicker: "The risk", title: "Leaving it out is expensive.",
        body: "The RGIT sets heavy fines for missing or late declarations of this kind, and Finanças can use information exchanged internationally. Correcting it yourself reduces the fine." },
      { type: "cta", kicker: "The move", title: "List your accounts before you file.",
        body: "IRS is filed from April to June. Note every foreign account, with its IBAN and BIC, before you start the form.",
        action: "Save this for April." },
    ],
    caption: {
      hook: "Live in Portugal and have a bank account abroad? It has to be declared in your Portuguese IRS — even if it earned nothing.",
      body: `Tax residents in Portugal declare foreign accounts in the IRS return, Anexo J, quadro 11:

· Accounts abroad, or at a foreign branch of a Portuguese bank, where you are the holder, a beneficiary, or authorised to move the money
· Identify each one by IBAN and BIC (or the account number). The instructions do not ask for the balance and set no minimum
· Accounts with no income still count

Foreign income goes in the same annex: salary (quadro 4A), pensions (5A), self-employment (6A), rent (7A), capital income (8A), and capital gains (9).

For foreign property, the form has fields for its income and its sale, not for owning it. The instructions do not say clearly whether crypto exchange or wallet accounts are covered.

Missing or late declarations of this kind can carry heavy fines under the RGIT, and Finanças can assess additional tax using information exchanged internationally. Correcting it voluntarily reduces the fine.

Deadline: IRS is filed from 1 April to 30 June. Check the dates each year.

Source: Modelo 3 Anexo J instructions; Portal das Finanças FAQ on foreign accounts; LGT art. 63.º-A.`,
      cta: "Not sure what to declare? Ask Finkavo — every answer cites the law.",
      tags: tags("#irs", "#anexoj", "#expatsportugal"),
    },
  },

  // ---------------------------------------------------------------- 29 Sep — heirs
  {
    id: "heranca-primeiros-passos",
    day: "2026-09-29",
    photo: "jobless",
    source: "gov.pt · Portal da Justiça · Código Civil",
    title: "Someone died: what heirs do first",
    slides: [
      { type: "cover", kicker: "After a death", title: "A checklist for the family, in plain English.",
        body: "Who acts, where to go, and what it costs." },
      { type: "content", kicker: "Step one", title: "Get the death certificate.",
        body: "Any family member can request the certidão de óbito. You will need it for the steps that follow." },
      { type: "content", kicker: "Step two", title: "Someone must run the estate.",
        body: "The cabeça-de-casal manages the estate until it is shared out. The order set by law: the spouse, then the person named in the will, then the closest heirs." },
      { type: "rows", kicker: "Step three: habilitação de herdeiros", title: "The fee depends on the service.",
        rows: [
          { key: "Habilitação only", value: "€150" },
          { key: "With property registration", value: "€375" },
          { key: "With division and registration", value: "€425" },
          { key: "Heirs married to each other", value: "+ €50" },
        ] },
      { type: "content", kicker: "Where", title: "The Balcão das Heranças.",
        body: "A one-stop service in conservatórias and Lojas do Cidadão. Book online; appointments are usually within seven working days and documents are due five working days before." },
      { type: "content", kicker: "Debts", title: "Accepting does not mean paying it all.",
        body: "Accepting \"a benefício de inventário\" limits liability to the assets listed. Even a plain acceptance is limited to the value of the inheritance, but you must prove the assets are not enough." },
      { type: "cta", kicker: "Taxes", title: "Do not forget Finanças.",
        body: "The estate still has to be declared to Finanças by the end of the third month after the death, even if every heir is exempt.",
        action: "Share it with someone who needs it." },
    ],
    caption: {
      hook: "When a relative dies in Portugal, these are the first steps for the family — and what they cost.",
      body: `A first-steps checklist for heirs:

1. Death certificate (certidão de óbito) — any family member can request it. You will need it for what follows
2. The cabeça-de-casal — the person who manages the estate until it is shared out. By law the order is the spouse, then the person named in the will, then the closest heirs
3. Habilitação de herdeiros — proof of who the heirs are. At the Balcão das Heranças: €150 for the habilitação only, €375 with property registration, €425 with division and registration, €50 more if the heirs are married to each other
4. Where — Balcão das Heranças, in conservatórias and Lojas do Cidadão. Book online; appointments usually within seven working days, with documents due five working days before
5. Debts — accepting "a benefício de inventário" limits liability to the assets in the inventory; even a plain acceptance is limited to the value of the inheritance, but you must prove the assets are not enough
6. Finanças — the estate must be declared by the end of the third month after the death, even if every heir is exempt from Imposto do Selo

How banks treat the deceased's accounts varies; ask the bank what it needs.

Source: gov.pt (Balcão das Heranças); Portal da Justiça; Código Civil arts. 2071 and 2079.`,
      cta: "Dealing with an estate? Ask Finkavo — every answer cites the law.",
      tags: tags("#heranca", "#habilitacaodeherdeiros", "#financas"),
    },
  },

  // ---------------------------------------------------------------- 30 Sep — residency
  {
    id: "residencia-fiscal-testes",
    day: "2026-09-30",
    photo: "disconnect",
    source: "Código do IRS · arts. 15.º e 16.º · LGT art. 19.º",
    title: "Tax residence in Portugal: the two tests",
    slides: [
      { type: "cover", kicker: "Are you a tax resident?", title: "The law counts nights and a home.",
        body: "Two tests, one deadline, and what changes once you are resident." },
      { type: "content", kicker: "Test one", title: "More than half a year of nights.",
        body: "More than 183 days in any 12-month period that starts or ends in the tax year. The days do not need to be in a row." },
      { type: "rows", kicker: "What counts as a day", title: "Sleep here, and it counts.",
        rows: [
          { key: "A night slept in Portugal", value: "Counts" },
          { key: "Part of a day", value: "Counts if you sleep here" },
          { key: "Days in a row", value: "Not required" },
          { key: "Exactly 183 days", value: "Does not qualify" },
        ] },
      { type: "content", kicker: "Test two", title: "Or a home you mean to keep.",
        body: "With fewer days, you are still resident if on any day of that period you have a home in conditions that suggest you mean to keep it and live in it as your usual residence." },
      { type: "content", kicker: "What changes", title: "Portugal taxes your worldwide income.",
        body: "Residents are taxed on income from anywhere; non-residents only on Portuguese-source income. Residence starts on your first day here, or on 1 January if you were resident the year before." },
      { type: "cta", kicker: "The duty", title: "Tell Finanças within sixty days.",
        body: "Once you meet either test, communicate your residence and update your details within 60 days. With an address abroad, use e-balcão, an appointment or a Loja do Cidadão.",
        action: "Save this if you split your year." },
    ],
    caption: {
      hook: "In Portugal, tax residence is decided by nights and a home. Here are the two tests, and the 60-day duty that follows.",
      body: `How Portugal decides tax residence (Código do IRS, art. 16.º):

· Test one — more than 183 days, in a row or not, in any 12-month period that starts or ends in the tax year. A day counts if it includes a night slept in Portugal, even part of a day. Exactly 183 does not qualify
· Test two — with fewer days, you are still resident if on any day of that period you have a home in conditions that suggest you mean to keep it and live in it as your usual residence

Once resident, you are taxed in Portugal on your worldwide income (art. 15.º); non-residents only on Portuguese-source income. Residence starts on your first day here, unless you were resident the year before — then from 1 January.

The duty: communicate your residence and update your details within 60 days (LGT art. 19.º n.º 5). If your registered address is abroad, the Portal's self-service address form does not cover the change: use e-balcão, an appointment, or a Loja do Cidadão.

A tax treaty or a part-year stay can change the answer.

Source: CIRS arts. 15.º and 16.º; LGT art. 19.º n.º 5; Portal das Finanças leaflet on address change for foreign nationals.`,
      cta: "Not sure where you stand? Ask Finkavo — every answer cites the law.",
      tags: tags("#irs", "#residenciafiscal", "#expatsportugal"),
    },
  },

  // ---------------------------------------------------------------- 1 Oct — cash
  {
    id: "numerario-limites",
    day: "2026-10-01",
    photo: "car",
    source: "LGT art. 63.º-E · RGIT art. 129.º",
    title: "The cash ban: what counts and what does not",
    slides: [
      { type: "cover", kicker: "Paying in cash", title: "The cash limit is lower than most people think.",
        body: "The rule, two examples, and how to stay on the right side." },
      { type: "rows", kicker: "The rule", title: "It starts at three thousand euros.",
        rows: [
          { key: "Limit", value: "€3.000 or more" },
          { key: "Applies to", value: "Paying and receiving" },
          { key: "Covers", value: "Any kind of transaction" },
          { key: "Non-resident individuals", value: "€10.000" },
        ] },
      { type: "content", kicker: "Example one", title: "The used car.",
        body: "A €4.000 car from a private seller cannot be paid entirely in cash. Two payments of €2.000 do not help: payments linked to one sale are added together." },
      { type: "content", kicker: "Example two", title: "The builder's cash.",
        body: "The rule covers services too. A single transaction of €3.000 or more, such as works on your home, cannot be paid or received in cash." },
      { type: "rows", kicker: "Other cash limits", title: "Do not mix them up.",
        rows: [
          { key: "Any transaction, €3.000 or more", value: "Not in cash" },
          { key: "Businesses, invoices of €1.000 or more", value: "Traceable payment" },
          { key: "Paying taxes above €500", value: "Not in cash" },
        ] },
      { type: "figure", kicker: "The fine", figure: "€180 to €4.500", figureLabel: "for cash above the limit",
        title: "It is a range, not a fixed price.",
        body: "The exact amount depends on the case (RGIT, art. 129.º)." },
      { type: "cta", kicker: "The move", title: "Move big money by bank transfer.",
        body: "For anything near the limit, pay by bank transfer and keep the confirmation.",
        action: "Save this before a big purchase." },
    ],
    caption: {
      hook: "In Portugal you cannot pay or receive €3.000 or more in cash — for a used car, a builder, anything. And splitting the payment does not help.",
      body: `The rule (Lei Geral Tributária, art. 63.º-E):

· Cash is banned for transactions of €3.000 or more — exactly €3.000 is already too much
· It covers any kind of transaction, including a sale between two private people, and both paying and receiving
· Payments linked to one sale are added together: two payments of €2.000 for a €4.000 car still break the rule
· Non-resident individuals who are not acting as businesses have a higher limit: €10.000

Other cash rules people mix up with it: businesses must pay invoices of €1.000 or more by a traceable method, and taxes above €500 cannot be paid in cash.

The fine for a cash transaction above the limit is €180 to €4.500 (RGIT, art. 129.º n.º 3).

What to do: for anything near the limit, pay by bank transfer and keep the confirmation.

Source: LGT arts. 63.º-C and 63.º-E; RGIT art. 129.º; Portal das Finanças.`,
      cta: "Buying or selling something big? Ask Finkavo — every answer cites the law.",
      tags: tags("#numerario", "#pagamentos", "#financas"),
    },
  },

  // ---------------------------------------------------------------- 2 Oct — IVA
  {
    id: "iva-isencao-limites",
    day: "2026-10-02",
    photo: "job",
    source: "CIVA art. 53.º · Ofício-Circulado 25062/2025",
    title: "The IVA exemption: two limits, not one",
    slides: [
      { type: "cover", kicker: "Freelancers", title: "One limit ends the exemption next year. Another ends it now.",
        body: "The two numbers every recibos verdes worker should know." },
      { type: "rows", kicker: "The limits", title: "Two numbers, two effects.",
        rows: [
          { key: "Last year up to €15.000", value: "No IVA this year" },
          { key: "Last year above €15.000", value: "IVA from 1 January" },
          { key: "This year above €18.750", value: "IVA from that invoice" },
          { key: "Turnover counts", value: "Without IVA" },
        ] },
      { type: "content", kicker: "The first limit", title: "Judged on last year.",
        body: "If your turnover last calendar year was €15.000 or less, you charge no IVA this year (CIVA art. 53.º). Sales of business assets do not count." },
      { type: "figure", kicker: "The second limit", figure: "€18.750", figureLabel: "the €15.000 limit plus 25%",
        title: "Cross it mid-year and IVA starts at once.",
        body: "On the invoice that takes you over, not next year." },
      { type: "content", kicker: "What you must do", title: "Tell Finanças within fifteen working days.",
        body: "File a change declaration (declaração de alterações) on the Portal das Finanças. The 15 working days run from the end of the year, or from the invoice that crossed €18.750." },
      { type: "content", kicker: "While exempt", title: "No IVA charged, none to deduct.",
        body: "Your invoices carry the mention of the IVA exemption regime, and you cannot deduct the IVA on your own purchases." },
      { type: "cta", kicker: "The move", title: "Keep a running total.",
        body: "Add up every invoice as you go. Waiting for December is too late for the second limit.",
        action: "Save this if you invoice." },
    ],
    caption: {
      hook: "Freelancers on Portugal's IVA exemption: there are two limits, and the second one bites in the middle of the year.",
      body: `The small-business exemption (CIVA, art. 53.º) currently works like this:

· €15.000 — if your turnover last calendar year was €15.000 or less, you charge no IVA this year. If it was above, normal IVA applies from 1 January
· €18.750 (the limit plus 25%) — if your turnover this year passes it, IVA applies at once, from the invoice that takes you over. It does not wait for next year

Turnover here is net of IVA and leaves out sales of business assets.

What to do: keep a running total as you invoice. If you pass a limit, file a change declaration (declaração de alterações) on the Portal das Finanças within 15 working days — counted from the end of the year in the first case, and from the date of the invoice that crossed €18.750 in the second.

While you are exempt, your invoices carry the mention of the exemption regime and you cannot deduct the IVA on your own purchases.

The limit has been €15.000 since the 2025 change (Decreto-Lei 35/2025); check the Portal for updates.

Source: CIVA art. 53.º; Ofício-Circulado 25062/2025; Portal das Finanças.`,
      cta: "Invoicing from Portugal? Ask Finkavo — every answer cites the law.",
      tags: tags("#iva", "#recibosverdes", "#freelancers"),
    },
  },
];
