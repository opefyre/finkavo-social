/**
 * Reel 10 — the duty not to contact you, Código do Trabalho art. 199.º-A.
 *
 * Introduced by Lei 83/2021 and applying to every employment relationship, on site or
 * remote. The employer must abstain from contacting the worker during rest periods,
 * except in cases of force majeure. Treating someone less favourably — in working
 * conditions or progression — because they exercised that right is discriminatory.
 * Breach is a contraordenação grave.
 *
 * "Rest period" is the whole of it: the daily rest after normal hours, days off, public
 * holidays, breaks, and annual leave. The reel says which ones rather than leaving the
 * viewer to guess what counts.
 */

import { holdsFor } from "../reading.mjs";

const scenes = [
  {
    type: "hook",
    kicker: "Working in Portugal",
    text: "Your employer cannot message you after hours.",
    sub: "It is written into the labour code.",
  },
  {
    type: "hook",
    kicker: "Which time is protected",
    text: "Every rest period.",
    sub: "Evenings, days off, public holidays and your annual leave.",
  },
  {
    type: "hook",
    kicker: "The one exception",
    text: "A genuine emergency.",
    sub: "Something unforeseeable that could seriously harm the company.",
  },
  {
    type: "payoff",
    card: true,
    kicker: "If it keeps happening",
    text: "Breaking this rule is a serious offence.",
    action: "And you cannot be punished for resting.",
  },
];

export function buildSpec() {
  return {
    id: "abstencao-contacto",
    photo: "disconnect",
    source: "Código do Trabalho · art. 199.º-A",
    music: "midnight-momentum.mp3",
    holds: holdsFor(scenes),
    scenes,
    caption: {
      hook: "Working in Portugal: your employer has a legal duty not to contact you during your rest time. It is not workplace etiquette, it is article 199.º-A.",
      body: `What the law says — Código do Trabalho, art. 199.º-A, introduced by Lei 83/2021:

· The employer must abstain from contacting you during your rest periods
· It applies to every employment relationship, whether you work on site or remotely
· Rest periods means the daily rest after your normal hours, weekly days off, public holidays, breaks, and your annual leave

The exception is force majeure — something unforeseeable and unavoidable that could destroy or seriously damage the company. A busy week is not force majeure.

There is a second protection that matters as much: treating you less favourably because you exercised this right — in your conditions or your progression — is legally discriminatory.

Breaching it is a contraordenação grave.`,
      cta: "Finkavo points you to the article behind your rights.",
      tags: [
        "#direitoadesconexao", "#direitodotrabalho", "#teletrabalho",
        "#trabalharemportugal", "#viveremportugal", "#expatsinportugal", "#Finkavo",
      ],
    },
  };
}
