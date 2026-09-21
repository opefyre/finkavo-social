/**
 * Reel 3 — the período experimental.
 *
 * A deliberate change of audience. The first two reels were for recibos verdes; this
 * one is for anyone on a contrato de trabalho, which is most of the people the account
 * needs to reach and none of the people it has been talking to.
 *
 * PACING: the holds are roughly 50% longer than reel 2. The complaint was that copy
 * left the screen before it could be finished, and the reveal is a fixed fraction of
 * the hold (pace = hold - 900ms, words revealed over 58% of it), so a longer hold buys
 * settled reading time at both ends rather than just a slower crawl.
 *
 * Everything on screen is from the statute, checked against the article text:
 *   90 / 180 / 240 days by role, contrato sem termo   — art. 112.º n.º 1
 *   reduced or excluded by earlier work for the same employer — art. 112.º n.º 4
 *   no cause, no compensation                          — art. 114.º n.º 1
 *   7 days' notice after 60, 30 days' after 120        — art. 114.º n.º 2 e 3
 *
 * Note the counterintuitive one, which is why it is on screen rather than implied:
 * first-job seekers and the long-term unemployed get the LONGER 180 days, not a
 * shorter period. And the notice after 120 days is 30, not 15 — worth stating because
 * the shorter figure is the one that circulates.
 */

export function buildSpec() {
  return {
    id: "periodo-experimental",
    photo: "job",
    source: "Código do Trabalho · art. 112.º e 114.º",
    music: "waiting-by-the-tagus.mp3",
    // ~50% longer than reel 2 throughout. The two beats carrying numbers get the most,
    // because they are the ones people will pause on.
    holds: [4.4, 5.8, 5.4, 5.4, 4.8],
    scenes: [
      {
        // The first frame has to answer three things for someone who arrived with no
        // context: who this is about, what can happen to them, and when. "They can end
        // it with no reason" answered none of them — there is no "they" and no "it" on
        // screen yet.
        type: "hook",
        kicker: "New job in Portugal",
        text: "You can be fired with no reason.",
        sub: "For your first 90 days, your employer can end the contract with no cause, no compensation and no warning. It is called the período experimental.",
      },
      {
        type: "dates",
        kicker: "How long it lasts",
        text: "Your role sets the length.",
        items: [
          { day: "90", month: "days", label: "Most jobs" },
          { day: "180", month: "days", label: "Skilled, trust, first job" },
          { day: "240", month: "days", label: "Directors" },
        ],
      },
      {
        // Says outright what is subtracted from what. "That time comes off" left the
        // viewer to guess what it came off.
        type: "figure",
        kicker: "Worked for them before?",
        figure: "0 days",
        text: "Time you already gave the same company — recibos verdes, a fixed-term contract, an internship — is subtracted from your período experimental. It can erase it completely.",
      },
      {
        type: "hook",
        kicker: "After 60 days on the job",
        text: "Your employer owes you notice.",
        sub: "Past 60 days on the job, 7 days' notice. Past 120 days, 30 days. If they skip it, they owe you that pay.",
      },
      {
        type: "payoff",
        card: true,
        kicker: "Do this today",
        text: "Count every day you already worked for that company.",
        action: "It comes off your período experimental.",
      },
    ],
    caption: {
      hook: "Starting a new job in Portugal: for your first 90 days your employer can end the contract with no reason and no compensation. That is the período experimental — and if you worked for them before, it may already be over.",
      body: `How long it runs on a contrato sem termo — art. 112.º n.º 1:
· 90 days — most workers
· 180 days — technical complexity, high responsibility, special qualification or positions of trust; also first-job seekers and the long-term unemployed
· 240 days — cargo de direção or quadro superior

On a contrato a termo it is 30 days (six months or longer) or 15 days (under six months) — art. 112.º n.º 2.

The part almost nobody claims — art. 112.º n.º 4: the period is reduced or excluded by earlier work for the same employer, under a previous fixed-term contract for the same activity, temporary work in the same post, a prestação de serviços for the same object, or a professional internship. If you invoiced them on recibos verdes before they hired you, that time counts.

Notice — art. 114.º: none in the first 60 days; 7 days after 60; 30 days after 120. If they skip it, they owe you the pay for the notice they did not give.`,
      cta: "Finkavo tells you which rule applies to you, with the article.",
      tags: [
        "#periodoexperimental", "#direitodotrabalho", "#contratodetrabalho",
        "#trabalharemportugal", "#recibosverdes", "#expatsinportugal", "#Finkavo",
      ],
    },
  };
}
