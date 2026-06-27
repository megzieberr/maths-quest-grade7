/* ============================================================
   CONFIG — hoofstukke (chapters), kleurfamilies, XP-reëls.
   ------------------------------------------------------------
   Elke HOOFSTUK besit een kleur; sy quests is skakerings van
   daardie kleur (lig → diep). Game UI is Engels; alle leerder-
   inhoud is in Afrikaans.
   ============================================================ */

export const CHAPTERS = [
  {
    id: "uitdrukkings", n: 1, name: "Algebraïese Uitdrukkings", icon: "🔠",
    signature: "#7c3aed", open: true,
    blurb: "Veranderlikes, koëffisiënte, terme en patrone.",
    quests: [
      { id: "u1", n: 1, title: "Dele van 'n uitdrukking", blurb: "Veranderlike, koëffisiënt, konstante & terme.", built: true },
      { id: "u2", n: 2, title: "Gelyksoortige terme", blurb: "Watter terme is gelyksoortig?", built: true },
      { id: "u3", n: 3, title: "Vervang en bereken", blurb: "Sit getalle in en werk die waarde uit.", built: true },
      { id: "u4", n: 4, title: "Inset & uitset", blurb: "Volg 'n reël van inset na uitset.", built: true },
      { id: "u5", n: 5, title: "Skryf uit woorde", blurb: "Maak 'n uitdrukking uit 'n sin.", built: true },
      { id: "u6", n: 6, title: "Getalpatrone", blurb: "Vind 'n term, 'n posisie en die reël.", built: true },
    ],
  },
  {
    id: "vergelykings", n: 2, name: "Algebraïese Vergelykings", icon: "⚖️",
    signature: "#2563eb", open: true,
    blurb: "Los op vir x — hou die skaal in balans.",
    quests: [
      { id: "v1", n: 1, title: "Een-stap vergelykings", blurb: "x + 7 = 21 en sy maats.", built: true },
      { id: "v2", n: 2, title: "Twee-stap vergelykings", blurb: "5x − 2 = 18, stap vir stap.", built: true },
      { id: "v3", n: 3, title: "Lastige gevalle", blurb: "Negatiewe en veranderlikes albei kante.", built: true },
      { id: "v4", n: 4, title: "Toets & woordprobleme", blurb: "Is dit waar? En sinne na vergelykings.", built: true },
    ],
  },
  {
    id: "meetkunde", n: 3, name: "Reguitlyn Meetkunde", icon: "📐",
    signature: "#0d9488", open: true,
    blurb: "Lees die gradeboog, hoeke en sirkeldele.",
    quests: [
      { id: "m1", n: 1, title: "Lees die gradeboog", blurb: "Meet die hoek op die gradeboog.", built: true },
      { id: "m2", n: 2, title: "Soorte hoeke", blurb: "Skerp, reg, stomp, gestrek, refleks.", built: true },
      { id: "m3", n: 3, title: "Lyne & notasie", blurb: "Parallel, loodreg en die simbole.", built: true },
      { id: "m4", n: 4, title: "Hoekverwantskappe", blurb: "Komplement, supplement & bereken hoeke.", built: true },
      { id: "m5", n: 5, title: "Dele van 'n sirkel", blurb: "Radius, middellyn, koord, sektor.", built: true },
    ],
  },
  {
    id: "vorms", n: 4, name: "2D Vorms", icon: "🔷",
    signature: "#ea580c", open: true,
    blurb: "Driehoeke, vierhoeke, poligone & kongruensie.",
    quests: [
      { id: "s1", n: 1, title: "Klassifiseer driehoeke", blurb: "Volgens sye en volgens hoeke.", built: true },
      { id: "s2", n: 2, title: "Driehoek-hoeksom", blurb: "Die hoeke maak altyd 180°.", built: true },
      { id: "s3", n: 3, title: "Poligone", blurb: "Name, sye en wat 'n poligoon is.", built: true },
      { id: "s4", n: 4, title: "Vierhoeke", blurb: "Eienskappe en die hiërargie.", built: true },
      { id: "s5", n: 5, title: "Kongruent of gelykvormig?", blurb: "Simbole en die voorwaardes.", built: true },
    ],
  },
  {
    id: "transformasies", n: 5, name: "Transformasies", icon: "🔄",
    signature: "#db2777", open: true,
    blurb: "Skuif, flip, draai, vergroot & simmetrie.",
    quests: [
      { id: "t1", n: 1, title: "Benoem die transformasie", blurb: "Translasie, refleksie of rotasie?", built: true },
      { id: "t2", n: 2, title: "Translasie & koördinate", blurb: "Skuif 'n punt en kry die nuwe plek.", built: true },
      { id: "t3", n: 3, title: "Rotasie & refleksie", blurb: "Wat gebeur met die vorm?", built: true },
      { id: "t4", n: 4, title: "Simmetrie", blurb: "Simmetrielyne en rotasie-orde.", built: true },
      { id: "t5", n: 5, title: "Vergroting & skaalfaktor", blurb: "Maak groter of kleiner.", built: true },
    ],
  },
];

export function chapterById(id) { return CHAPTERS.find(c => c.id === id) || null; }

/* a per-quest shade of the chapter colour: quest 1 = lightest, last = deepest.
   We return a CSS color-mix so each quest reads as a shade of the family. */
export function questAccent(chapter, questN, total) {
  const t = total > 1 ? (questN - 1) / (total - 1) : 0;     // 0 → light, 1 → deep
  const whitePct = Math.round((1 - t) * 32);                // up to 32% lighter
  return `color-mix(in srgb, ${chapter.signature} ${100 - whitePct}%, white)`;
}

/* XP-ekonomie — klein, begrip-eerste. Geen ranglys. */
export const XP = { perCorrect: 10, firstTryBonus: 5, streakCap: 3 };

/* antwoord-toleransies */
export const TOL = { calcEps: 0.001, graphRead: 1 };

export const PASS = 0.8;   // 80% (eerste-keer reg) om 'n quest te slaag en die kenteken te kry
