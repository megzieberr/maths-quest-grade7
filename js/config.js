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
      { id: "u1", n: 1, title: "Veranderlike & koëffisiënt", blurb: "Wys die letter en die getal vóór dit.", built: true },
      { id: "u2", n: 2, title: "Konstante & eksponent", blurb: "Die los getal en die mag (²/³).", built: true },
      { id: "u3", n: 3, title: "Gelyksoortige terme", blurb: "Watter terme is gelyksoortig?", built: true },
      { id: "u4", n: 4, title: "Tel terme op en trek af", blurb: "Vereenvoudig gelyksoortige terme.", built: true },
      { id: "u5", n: 5, title: "Vervang en bereken", blurb: "Sit getalle in en werk die waarde uit.", built: true },
    ],
  },
  {
    id: "vergelykings", n: 2, name: "Algebraïese Vergelykings", icon: "⚖️",
    signature: "#2563eb", open: true,
    blurb: "Los op vir x — hou die skaal in balans.",
    quests: [
      { id: "v1", n: 1, title: "Plus & minus (1)", blurb: "x + 7 = 21. Maak x alleen.", built: true },
      { id: "v2", n: 2, title: "Plus & minus (2)", blurb: "Nog plus- en minus-oefening.", built: true },
      { id: "v3", n: 3, title: "Maal", blurb: "3x = 12. Deel om x te kry.", built: true },
      { id: "v4", n: 4, title: "Deel", blurb: "x ÷ 4 = 5. Maal om x te kry.", built: true },
      { id: "v5", n: 5, title: "Maal & deel", blurb: "Maal en deel deurmekaar.", built: true },
      { id: "v6", n: 6, title: "Alles gemeng (1)", blurb: "+, −, × en ÷ saam.", built: true },
      { id: "v7", n: 7, title: "Alles gemeng (2)", blurb: "Nog gemengde oefening.", built: true },
      { id: "v8", n: 8, title: "Alles gemeng (3)", blurb: "Hou aan oefen!", built: true },
      { id: "v9", n: 9, title: "Inset & uitset", blurb: "Volg 'n reël van inset na uitset.", built: true },
      { id: "v10", n: 10, title: "Getalpatrone", blurb: "Vind 'n term, 'n posisie en die reël.", built: true },
    ],
  },
  {
    id: "meetkunde", n: 3, name: "Reguitlyn Meetkunde", icon: "📐",
    signature: "#0d9488", open: true,
    blurb: "Lees die gradeboog, hoeke en sirkeldele.",
    quests: [
      { id: "m1", n: 1, title: "Lees die gradeboog", blurb: "Meet die hoek op die gradeboog.", built: true },
      { id: "m2", n: 2, title: "Soorte hoeke", blurb: "Skerp, reg, stomp of gestrek?", built: true },
      { id: "m3", n: 3, title: "Lyne & notasie", blurb: "Parallel, loodreg en die simbole.", built: true },
      { id: "m4", n: 4, title: "Soorte lyne", blurb: "Lyn, straal, lynsegment of snylyn?", built: true },
      { id: "m5", n: 5, title: "Komplementêre hoeke", blurb: "Twee hoeke maak saam 90°.", built: true },
      { id: "m6", n: 6, title: "Supplementêre hoeke", blurb: "Twee hoeke maak saam 180°.", built: true },
      { id: "m7", n: 7, title: "Hoeke op 'n reguitlyn", blurb: "Die hoeke tel saam tot 180°.", built: true },
      { id: "m8", n: 8, title: "Hoeke rondom 'n punt", blurb: "Al die hoeke tel saam tot 360°.", built: true },
      { id: "m9", n: 9, title: "Regoorstaande hoeke", blurb: "Waar twee lyne sny — gelyke hoeke.", built: true },
      { id: "m10", n: 10, title: "Inspringende (refleks) hoeke", blurb: "Trek die kleiner hoek van 360° af.", built: true },
    ],
  },
  {
    id: "vorms", n: 4, name: "2D Vorms", icon: "🔷",
    signature: "#ea580c", open: true,
    blurb: "Driehoeke, vierhoeke, poligone & kongruensie.",
    quests: [
      { id: "s1", n: 1, title: "Driehoeke volgens sye", blurb: "Gelyksydig, gelykbenig of ongelyksydig?", built: true },
      { id: "s2", n: 2, title: "Driehoeke volgens hoeke", blurb: "Skerp-, reg- of stomphoekig?", built: true },
      { id: "s3", n: 3, title: "Binnehoeke van 'n driehoek", blurb: "Die hoeke maak altyd 180°.", built: true },
      { id: "s4", n: 4, title: "Vierhoeke", blurb: "Vierkant, ruit, parallelogram, trapesium…", built: true },
      { id: "s5", n: 5, title: "Poligone", blurb: "Name en sye van veelhoeke.", built: true },
      { id: "s6", n: 6, title: "Dele van 'n sirkel", blurb: "Radius, middellyn, koord, sektor.", built: true },
      { id: "s7", n: 7, title: "Tik die sirkeldeel", blurb: "Tik die koord, middelpunt of boog.", built: true },
      { id: "s8", n: 8, title: "Radius & middellyn", blurb: "Middellyn = 2 × radius.", built: true },
      { id: "s9", n: 9, title: "Kongruent of gelykvormig?", blurb: "Selfde grootte, of net selfde vorm?", built: true },
      { id: "s10", n: 10, title: "Nog kongruent of gelykvormig?", blurb: "Meer oefening met die verskil.", built: true },
    ],
  },
  {
    id: "transformasies", n: 5, name: "Transformasies", icon: "🔄",
    signature: "#db2777", open: true,
    blurb: "Skuif, flip, draai, vergroot & simmetrie.",
    quests: [
      { id: "t1", n: 1, title: "Benoem die transformasie", blurb: "Translasie, refleksie of rotasie?", built: true },
      { id: "t2", n: 2, title: "Translasie & koördinate", blurb: "Skuif 'n punt en kry die nuwe plek.", built: true },
      { id: "t3", n: 3, title: "Refleksie-as", blurb: "Om watter as is dit geflip?", built: true },
      { id: "t4", n: 4, title: "Refleksie van 'n punt", blurb: "Kry die beeld se koördinate.", built: true },
      { id: "t5", n: 5, title: "Rotasie-hoek", blurb: "Deur watter hoek is dit gedraai?", built: true },
      { id: "t6", n: 6, title: "Rotasie van 'n punt", blurb: "Draai 'n punt 180° om O.", built: true },
      { id: "t7", n: 7, title: "Simmetrielyne", blurb: "Tel die simmetrielyne van 'n vorm.", built: true },
      { id: "t8", n: 8, title: "Rotasie-orde", blurb: "Hoeveel keer pas dit in een draai?", built: true },
      { id: "t9", n: 9, title: "Vergroting & skaalfaktor", blurb: "Maak groter of kleiner.", built: true },
      { id: "t10", n: 10, title: "Transformasies gemeng", blurb: "Alles deurmekaar — wys wat jy weet!", built: true },
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
