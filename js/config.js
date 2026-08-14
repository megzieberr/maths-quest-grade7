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
    signature: "#7c3aed", open: true, archived: true,
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
    signature: "#2563eb", open: true, archived: true,
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
      { id: "m1b", n: 2, title: "Lees die gradeboog — Deel 2", blurb: "Watter lesing is reg — binneste of buitenste ry?", built: true },
      { id: "m1c", n: 3, title: "Lees die gradeboog — ander kant", blurb: "Arm A lê nou links — lees die ander ry.", built: true },
      { id: "m2", n: 4, title: "Soorte hoeke", blurb: "Skerp, reg, stomp of gestrek?", built: true },
      { id: "m2b", n: 5, title: "Soorte hoeke — Deel 2", blurb: "Waar of onwaar — is die bewering reg?", built: true },
      { id: "m3", n: 6, title: "Lyne & notasie", blurb: "Parallel, loodreg en die simbole.", built: true },
      { id: "m3b", n: 7, title: "Lyne & notasie — Deel 2", blurb: "Spoorlyne, mure en vloere — kies die voorbeelde.", built: true },
      { id: "m4", n: 8, title: "Punte & lyne", blurb: "Punt, lyn, straal, lynsegment of snylyn?", built: true },
      { id: "m4b", n: 9, title: "Punte & lyne — Deel 2", blurb: "Lees die beskrywing, kies die naam.", built: true },
      { id: "m5", n: 10, title: "Komplementêre hoeke", blurb: "Twee hoeke maak saam 90°.", built: true },
      { id: "m5b", n: 11, title: "Komplementêre hoeke — Deel 2", blurb: "Waar of onwaar — tel dit op tot 90°?", built: true },
      { id: "m6", n: 12, title: "Supplementêre hoeke", blurb: "Twee hoeke maak saam 180°.", built: true },
      { id: "m6b", n: 13, title: "Supplementêre hoeke — Deel 2", blurb: "Waar of onwaar — tel dit op tot 180°?", built: true },
      { id: "m7", n: 14, title: "Hoeke op 'n reguitlyn", blurb: "Die hoeke tel saam tot 180°.", built: true },
      { id: "m7b", n: 15, title: "Hoeke op 'n reguitlyn — Deel 2", blurb: "Gaan iemand anders se antwoord na.", built: true },
      { id: "m8", n: 16, title: "Hoeke rondom 'n punt", blurb: "Al die hoeke tel saam tot 360°.", built: true },
      { id: "m8b", n: 17, title: "Hoeke rondom 'n punt — Deel 2", blurb: "Gaan iemand anders se antwoord na.", built: true },
      { id: "m9", n: 18, title: "Regoorstaande hoeke", blurb: "Waar twee lyne sny — gelyke hoeke.", built: true },
      { id: "m9b", n: 19, title: "Regoorstaande hoeke — Deel 2", blurb: "Gaan iemand anders se antwoord na.", built: true },
      { id: "m10", n: 20, title: "Inspringende (refleks) hoeke", blurb: "Trek die kleiner hoek van 360° af.", built: true },
      { id: "m10b", n: 21, title: "Inspringende (refleks) hoeke — Deel 2", blurb: "Gaan iemand anders se antwoord na.", built: true },
      { id: "m11", n: 22, title: "Refleks-hoeke met die sakrekenaar", blurb: "Tik 360 − die kleiner hoek op die Casio.", built: true },
    ],
  },
  {
    id: "vorms", n: 4, name: "2D Vorms", icon: "🔷",
    signature: "#ea580c", open: true,
    blurb: "Driehoeke, vierhoeke, poligone & kongruensie.",
    quests: [
      { id: "s1", n: 1, title: "Driehoeke volgens sye", blurb: "Gelyksydig, gelykbenig of ongelyksydig?", built: true },
      { id: "s1b", n: 2, title: "Driehoeke volgens sye — Deel 2", blurb: "Waar of onwaar — het hulle die soort reg?", built: true },
      { id: "s2", n: 3, title: "Driehoeke volgens hoeke", blurb: "Skerp-, reg- of stomphoekig?", built: true },
      { id: "s2b", n: 4, title: "Driehoeke volgens hoeke — Deel 2", blurb: "Waar of onwaar — het hulle die soort reg?", built: true },
      { id: "s3", n: 5, title: "Binnehoeke van 'n driehoek", blurb: "Die hoeke maak altyd 180°.", built: true },
      { id: "s3b", n: 6, title: "Binnehoeke van 'n driehoek — Deel 2", blurb: "Gaan iemand anders se basishoek na.", built: true },
      { id: "s4", n: 7, title: "Vierhoeke", blurb: "Vierkant, ruit, parallelogram, trapesium…", built: true },
      { id: "s4b", n: 8, title: "Vierhoeke — Deel 2", blurb: "Lees die beskrywing, kies die vierhoek.", built: true },
      { id: "s5", n: 9, title: "Poligone", blurb: "Name en sye van veelhoeke.", built: true },
      { id: "s5b", n: 10, title: "Poligone — Deel 2", blurb: "Regte-lewe voorbeelde — watter poligoon?", built: true },
      { id: "s6", n: 11, title: "Dele van 'n sirkel", blurb: "Radius, middellyn, koord, sektor.", built: true },
      { id: "s6b", n: 12, title: "Dele van 'n sirkel — Deel 2", blurb: "Lees die beskrywing, kies die sirkeldeel.", built: true },
      { id: "s7", n: 13, title: "Tik die sirkeldeel", blurb: "Tik die koord, middelpunt of boog.", built: true },
      { id: "s7b", n: 14, title: "Tik die sirkeldeel — Deel 2", blurb: "Nou uit 'n beskrywing, nie 'n naam nie.", built: true },
      { id: "s8", n: 15, title: "Radius & middellyn", blurb: "Middellyn = 2 × radius.", built: true },
      { id: "s8b", n: 16, title: "Radius & middellyn — Deel 2", blurb: "Waar of onwaar — is die middellyn reg?", built: true },
      { id: "s9", n: 17, title: "Kongruent of gelykvormig?", blurb: "Selfde grootte, of net selfde vorm?", built: true },
      { id: "s9b", n: 18, title: "Kongruent of gelykvormig? — Deel 2", blurb: "Waar of onwaar — is die stelling reg?", built: true },
      { id: "s10", n: 19, title: "Nog kongruent of gelykvormig?", blurb: "Meer oefening met die verskil.", built: true },
      { id: "s10b", n: 20, title: "Nog kongruent of gelykvormig? — Deel 2", blurb: "Waar of onwaar — is die stelling reg?", built: true },
      { id: "s11", n: 21, title: "Teenoorstaande & aangrensende sye", blurb: "Watter sy is oorkant, watter een is langsaan?", built: true },
      { id: "s12", n: 22, title: "Wat beteken die simbole?", blurb: "Pyltjies, strepies en blokkies — lees die merke.", built: true },
      { id: "s13", n: 23, title: "Eienskappe van vorms", blurb: "Jy kry die vorm — tap AL die eienskappe wat pas.", built: true },
    ],
  },
  {
    id: "transformasies", n: 5, name: "Transformasies", icon: "🔄",
    signature: "#db2777", open: true,
    blurb: "Skuif, flip, draai, vergroot & simmetrie.",
    quests: [
      { id: "t1", n: 1, title: "Benoem die transformasie", blurb: "Translasie, refleksie of rotasie?", built: true },
      { id: "t1b", n: 2, title: "Benoem die transformasie — Deel 2", blurb: "Waar sien jy dit in die lewe? Kies die regte soort.", built: true },
      { id: "t2", n: 3, title: "Translasie & koördinate", blurb: "Skuif 'n punt en kry die nuwe plek.", built: true },
      { id: "t2b", n: 4, title: "Translasie & koördinate — Deel 2", blurb: "Kry die translasie self — van A na A′.", built: true },
      { id: "t3", n: 5, title: "Refleksie-as", blurb: "Om watter as is dit geflip?", built: true },
      { id: "t3b", n: 6, title: "Refleksie-as — Deel 2", blurb: "Waar of onwaar — is die refleksie reg?", built: true },
      { id: "t4", n: 7, title: "Refleksie van 'n punt", blurb: "Kry die beeld se koördinate.", built: true },
      { id: "t4b", n: 8, title: "Refleksie van 'n punt — Deel 2", blurb: "Werk agteruit — kry die OORSPRONKLIKE punt.", built: true },
      { id: "t5", n: 9, title: "Rotasie-hoek", blurb: "Deur watter hoek is dit gedraai?", built: true },
      { id: "t5b", n: 10, title: "Rotasie-hoek — Deel 2", blurb: "Twee punte gegee — watter hoek was dit?", built: true },
      { id: "t6", n: 11, title: "Rotasie van 'n punt", blurb: "Draai 'n punt 180° om O.", built: true },
      { id: "t6b", n: 12, title: "Rotasie van 'n punt — Deel 2", blurb: "Draai dit TWEE KEER — waar eindig jy?", built: true },
      { id: "t7", n: 13, title: "Simmetrielyne", blurb: "Tel die simmetrielyne van 'n vorm.", built: true },
      { id: "t7b", n: 14, title: "Simmetrielyne — Deel 2", blurb: "Jy kry die telling — watter vorm is dit?", built: true },
      { id: "t8", n: 15, title: "Rotasie-orde", blurb: "Hoeveel keer pas dit in een draai?", built: true },
      { id: "t8b", n: 16, title: "Rotasie-orde — Deel 2", blurb: "Waar of onwaar — is die orde reg?", built: true },
      { id: "t9", n: 17, title: "Vergroting & skaalfaktor", blurb: "Maak groter of kleiner.", built: true },
      { id: "t9b", n: 18, title: "Vergroting & skaalfaktor — Deel 2", blurb: "Werk agteruit na die oorspronklike grootte.", built: true },
      { id: "t10", n: 19, title: "Transformasies gemeng", blurb: "Alles deurmekaar — wys wat jy weet!", built: true },
      { id: "t10b", n: 20, title: "Transformasies gemeng — Deel 2", blurb: "Alles omgekeer — wys wat jy weet!", built: true },
    ],
  },
  {
    id: "stellings", n: 6, name: "Meetkunde Stellings", icon: "📐", iconAlt: "⭐",
    signature: "#16a34a", open: true,
    blurb: "Bewys hoekom — leer die ses redes en gebruik hulle.",
    quests: [
      { id: "st1", n: 1, title: "Leer: Regoorstaande hoeke", blurb: "Waar twee lyne sny — die gelyke hoeke.", built: true },
      { id: "st2", n: 2, title: "Regoorstaande hoeke: bereken", blurb: "Gebruik die rede, bereken x.", built: true },
      { id: "st3", n: 3, title: "Regoorstaande hoeke: kies die rede", blurb: "Die waarde is gegee — hoekom?", built: true },
      { id: "st4", n: 4, title: "Regoorstaande hoeke: waarde én rede", blurb: "Tik die waarde EN kies die rede.", built: true },
      { id: "st5", n: 5, title: "Leer: Hoeke op 'n reguitlyn", blurb: "Hulle tel altyd op tot 180°.", built: true },
      { id: "st6", n: 6, title: "Reguitlyn: bereken", blurb: "Gebruik die rede, bereken x.", built: true },
      { id: "st7", n: 7, title: "Reguitlyn: kies die rede", blurb: "Die waarde is gegee — hoekom?", built: true },
      { id: "st8", n: 8, title: "Reguitlyn: waarde én rede", blurb: "Tik die waarde EN kies die rede.", built: true },
      { id: "st9", n: 9, title: "Leer: Hoeke om 'n punt", blurb: "Hulle tel altyd op tot 360°.", built: true },
      { id: "st10", n: 10, title: "Om 'n punt: bereken", blurb: "Gebruik die rede, bereken x.", built: true },
      { id: "st11", n: 11, title: "Om 'n punt: kies die rede", blurb: "Die waarde is gegee — hoekom?", built: true },
      { id: "st12", n: 12, title: "Om 'n punt: waarde én rede", blurb: "Tik die waarde EN kies die rede.", built: true },
      { id: "st13", n: 13, title: "Leer: Binnehoeke van 'n driehoek", blurb: "Hulle tel altyd op tot 180°.", built: true },
      { id: "st14", n: 14, title: "Binnehoeke: bereken", blurb: "Gebruik die rede, bereken x.", built: true },
      { id: "st15", n: 15, title: "Binnehoeke: kies die rede", blurb: "Die waarde is gegee — hoekom?", built: true },
      { id: "st16", n: 16, title: "Binnehoeke: waarde én rede", blurb: "Tik die waarde EN kies die rede.", built: true },
      { id: "st17", n: 17, title: "Leer: Gelykbenige driehoek", blurb: "Hoeke oor gelyke sye is gelyk.", built: true },
      { id: "st18", n: 18, title: "Gelykbenig: basishoek gegee", blurb: "Die ander basishoek is net gelyk.", built: true },
      { id: "st19", n: 19, title: "Gelykbenig: tophoek gegee", blurb: "Minus eerste, dan deel deur 2.", built: true },
      { id: "st20", n: 20, title: "Deel jy deur 2?", blurb: "Yay of Nay — wanneer deel jy?", built: true },
      { id: "st21", n: 21, title: "Gelykbenig: kies die rede", blurb: "Die waarde is gegee — hoekom?", built: true },
      { id: "st22", n: 22, title: "Gelykbenig: waarde én rede", blurb: "Tik die waarde EN kies die rede.", built: true },
      { id: "st23", n: 23, title: "Leer: Buitehoek van 'n driehoek", blurb: "Buite = som van die 2 ver hoeke.", built: true },
      { id: "st24", n: 24, title: "Binne of buite?", blurb: "Watter tipe hoek is gemerk?", built: true },
      { id: "st25", n: 25, title: "Buitehoek: bereken", blurb: "Gebruik die rede, bereken x.", built: true },
      { id: "st26", n: 26, title: "Buitehoek: kies die rede", blurb: "Die waarde is gegee — hoekom?", built: true },
      { id: "st27", n: 27, title: "Buitehoek: waarde én rede", blurb: "Tik die waarde EN kies die rede.", built: true },
      { id: "st28", n: 28, title: "Gemeng: bereken die waarde", blurb: "Al ses stellings deurmekaar.", built: true },
      { id: "st29", n: 29, title: "Gemeng: kies die rede", blurb: "Al ses stellings deurmekaar.", built: true },
      { id: "st30", n: 30, title: "Gemeng: waarde én rede (1)", blurb: "Al ses stellings deurmekaar.", built: true },
      { id: "st31", n: 31, title: "Gemeng: waarde én rede (2)", blurb: "Al ses stellings deurmekaar.", built: true },
      { id: "st32", n: 32, title: "Groot Gemeng — wys wat jy weet!", blurb: "Twee-stap vrae, steeds maklik.", built: true },
    ],
  },
];

export function chapterById(id) { return CHAPTERS.find(c => c.id === id) || null; }

/* rondte-id's wat in 'n GEARGIVEERDE hoofstuk woon (bv. Uitdrukkings, Vergelykings) —
   herbruik deur screens.js (hub/diep-skakel-wag) en daily.js (Daaglikse Quest mag nie
   uit 'n argief-hoofstuk trek nie, al is die rondte per ongeluk as "hersiening" gemerk). */
export const ARCHIVED_QUEST_IDS = new Set(
  CHAPTERS.filter(c => c.archived).flatMap(c => (c.quests || []).map(q => q.id))
);

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
