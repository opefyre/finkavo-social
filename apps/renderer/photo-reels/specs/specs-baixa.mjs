/**
 * Reel 5 — subsídio de doença, the days that pay nothing.
 *
 * Everything here is from the ISS Guia Prático – Subsídio de Doença (2026 edition, the
 * one that states the RMMG as €920), read directly rather than from summaries:
 *
 *   employees are paid from the 4th day of incapacity — a 3-day período de espera
 *   trabalhadores independentes from the 11th day — a 10-day período de espera
 *   no waiting at all for hospital admission, day surgery, or tuberculosis
 *   55% of the remuneração de referência up to 30 days; 60% from 31 to 90;
 *     70% from 91 to 365; 75% beyond that
 *   the daily amount can never fall below €9,20 (30% of the RMMG, €920 in 2026)
 *
 * WHY THIS TOPIC: everyone gets ill, almost nobody knows the first days pay nothing, and
 * the gap between employed and self-employed is three days against ten — which is the
 * kind of asymmetry a person remembers and sends to someone else. It also completes the
 * Segurança Social reel: that one was about the contribution you choose, this is the
 * cover you are choosing.
 *
 * TIMING is derived, not typed. Each hold comes from holdFor(), which gives the scene
 * enough time both to finish animating in and to be read at 3 words a second. The build
 * re-checks it, so a scene whose copy grows past its hold fails rather than quietly
 * flashing past.
 *
 * CONTEXT: every scene names its own subject. A viewer who arrives at scene 3 with no
 * idea what came before still sees "sick pay" and a percentage of something named.
 */

import { holdsFor } from "../reading.mjs";

const scenes = [
  {
    type: "hook",
    kicker: "Sick leave in Portugal",
    text: "Your first three sick days pay nothing.",
    sub: "Segurança Social starts paying on day 4.",
  },
  {
    // The asymmetry, side by side. It is the fact people send to someone else.
    type: "dates",
    kicker: "Unless you are self-employed",
    text: "Then you wait ten days.",
    items: [
      { day: "4th", month: "day", label: "On a contract" },
      { day: "11th", month: "day", label: "Recibos verdes" },
    ],
  },
  {
    type: "figure",
    kicker: "And it is not full pay",
    figure: "55%",
    text: "That is the sick pay rate for your first 30 days.",
  },
  {
    // The exception is the reason to save the reel rather than only watch it.
    type: "payoff",
    card: true,
    kicker: "One exception",
    text: "A hospital stay or surgery pays from day one.",
    action: "No waiting days at all.",
  },
];

export function buildSpec() {
  return {
    id: "baixa-medica",
    photo: "sick",
    source: "ISS · Guia Prático Subsídio de Doença",
    music: "limestone-afternoon.mp3",
    holds: holdsFor(scenes),
    scenes,
    caption: {
      hook: "Sick leave in Portugal: your first three days pay nothing — and if you are on recibos verdes, your first ten.",
      body: `Segurança Social calls it the período de espera, and it is not the same for everyone:

· On a contract (trabalhador por conta de outrem): paid from the 4th day — 3 waiting days
· On recibos verdes (trabalhador independente): paid from the 11th day — 10 waiting days
· Voluntary social insurance: from the 31st day

There is no waiting period at all if the illness involves a hospital stay, day surgery, or tuberculosis — payment starts on day one.

What you get, as a percentage of your remuneração de referência:
· Up to 30 days — 55%
· 31 to 90 days — 60%
· 91 to 365 days — 70%
· More than 365 days — 75%

The reference pay is the six oldest of your last eight months of registered earnings, divided by 180 — holiday and Christmas subsidies excluded. Whatever that works out to, the daily amount is never below €9,20, which is 30% of the minimum wage (€920 in 2026).

The 55% and 60% bands rise by 5 percentage points if your reference pay is €500 or less, or if you have three or more dependent children.

Source: ISS, Guia Prático – Subsídio de Doença.`,
      cta: "Finkavo tells you which rule is yours, with the source.",
      tags: [
        "#baixamedica", "#subsidiodedoenca", "#segurancasocial",
        "#recibosverdes", "#trabalharemportugal", "#expatsinportugal", "#Finkavo",
      ],
    },
  };
}
