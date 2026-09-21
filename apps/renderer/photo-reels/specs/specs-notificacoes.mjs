/**
 * Reel — 17 Sep 2026 — electronic notifications count as delivered on day five.
 *
 * New topic: no post on the account covers how Finanças notices are delivered.
 *
 * Verified 14 Sep 2026 on the Portal das Finanças page "Notificações e citações
 * eletrónicas":
 *   the notice is a PDF with legal value, replacing the paper letter
 *   in the Portal channel it is "considered made on the fifth day after it is made
 *     available in the reserved area" (CPPT art. 38.º-A / 39.º, Portaria 233/2019)
 *   the Portal channel is optional for individuals; ViaCTT is mandatory for companies and
 *     for individuals in the normal IVA regime unless they use the Portal channel
 *   notices: Notificações e Citações → Notificações e Citações do Próprio
 *   channel setting: Notificações e Citações → Gerir canais
 */
import { holdsFor } from "../reading.mjs";

const scenes = [
  {
    type: "hook",
    kicker: "Letters from Finanças",
    text: "Unread still counts as delivered.",
    sub: "If your notices arrive online, day five is the legal date.",
  },
  {
    type: "hook",
    kicker: "How it works",
    text: "Switch to e-notices and paper stops.",
    sub: "Each notice lands in the Portal das Finanças as a PDF with legal value.",
  },
  {
    type: "figure",
    kicker: "The rule",
    figure: "Day 5",
    text: "After it is posted, the notice counts as delivered — opened or not.",
  },
  {
    type: "hook",
    kicker: "Why it matters",
    text: "Deadlines to pay or reply run from then.",
    sub: "Not from the day you finally log in.",
  },
  {
    type: "payoff",
    card: true,
    kicker: "Check it today",
    text: "Look at what is waiting, and which channel is on.",
    action: "Portal das Finanças → Notificações e Citações",
  },
];

export function buildSpec() {
  return {
    id: "notificacoes-portal",
    photo: "disconnect",
    source: "CPPT · art. 38.º-A e 39.º",
    music: "midnight-momentum.mp3",
    holds: holdsFor(scenes),
    scenes,
    caption: {
      hook: "Letters from Finanças in Portugal: if your notices arrive online, they count as delivered on the fifth day — whether you open them or not.",
      body: `How electronic notifications work:

· Once you activate them, notices from the Autoridade Tributária arrive in your Portal das Finanças area as a PDF with the same legal value as a letter, instead of by post
· A notice counts as delivered on the fifth day after it is made available — opened or not
· Deadlines to pay or to respond run from that date, not from the day you log in

For individuals the Portal channel is optional. Companies, and people in the normal IVA regime, must have an electronic channel (ViaCTT or the Portal).

Where to look: Portal das Finanças → Notificações e Citações → Notificações e Citações do Próprio.
Which channel you are on: Notificações e Citações → Gerir canais.

If you turned it on and forgot, check today.

Source: Portal das Finanças, "Notificações e citações eletrónicas"; CPPT, art. 38.º-A and 39.º.`,
      cta: "Got a notice you do not understand? Ask Finkavo — every answer cites the law.",
      tags: ["#portaldasfinancas", "#financas", "#impostos", "#viveremportugal", "#Finkavo"],
    },
  };
}
