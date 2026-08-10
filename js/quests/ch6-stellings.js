/* ============================================================
   HOOFSTUK 6 — MEETKUNDE STELLINGS
   ------------------------------------------------------------
   st1–st12: regoorstaande hoeke · hoeke op 'n reguitlyn · hoeke
   om 'n punt. Elke blok = 4 rondtes: INTRO ("Leer:", 6 sagte
   herkenningsvrae) → R1 (calc, rede in die prompt) → R2 (reasonQ,
   4 chips) → R3 (calcReason, waarde ÉN rede).

   _chk op elke vraag = onsigbare metadata vir tools/verify-stellings
   (mns nie deur die UI gebruik nie) — dit dra die WERKLIKE hoeke wat
   in die figuur geteken is, sodat die verify-skrip die geTEKENDE
   booghoeke teen die vraag se eie wiskunde kan MEET (nie afgekyk nie).
   ============================================================ */
import { mc, tf, calc, reasonQ, calcReason, randInt, pick, shuffled, code, nearDistractors } from "./_shared.js";
import { verticalFigure, straightLineFigure, straightLineFigure3, aroundPointFigure, aroundPointFigureN } from "../engine/diagrams.js";
import { REDES, REDE_CODES } from "../redes.js";

const GREEN = "#16a34a";

/* n plausibele afleier-kodes (nie die korrekte een nie), geskommel */
function otherCodes(correctCode, n) {
  return shuffled(REDE_CODES.filter(c => c !== correctCode)).slice(0, n);
}

/* ============================================================
   BLOK 1 — REGOORSTAANDE HOEKE (st1–st4)
   ============================================================ */
function knownRegoorst() { return randInt(5, 34) * 5; }   // 25° … 170°

/* ---- st1: INTRO — 6 sagte herkenningsvrae, ALMAL waardes gewys ---- */
function introRegoorstTF1() {
  const k = knownRegoorst();
  return tf("Is hierdie twee hoeke gelyk?", true, {
    figure: verticalFigure(k, GREEN, { showAsk: true }),
    tip: "Kyk waar die twee lyne mekaar sny — die hoeke oorkant mekaar het altyd dieselfde waarde.",
    hint: "Waar twee lyne sny — regoorstaande hoeke is gelyk.",
    _chk: { figKind: "vertical", values: [k, k], hideIndex: null, allShown: true },
  });
}
function introRegoorstMC1() {
  const k = knownRegoorst();
  const distract = nearDistractors(k, 3, 15).filter(d => d > 0 && d < 180);
  while (distract.length < 3) distract.push(k + 5 * (distract.length + 1));
  return mc(`Die twee gemerkte hoeke is regoorstaande hoeke. Hoe groot is die tweede een?`,
    shuffled([{ label: `${k}°`, correct: true }, ...distract.slice(0, 3).map(d => ({ label: `${d}°`, correct: false }))]), {
    figure: verticalFigure(k, GREEN, { showAsk: true }),
    tip: "Lees dit reguit van die prentjie af — dis albei dieselfde getal.",
    hint: "Regoorstaande hoeke is altyd gelyk.",
    answerLabel: `${k}°`,
    _chk: { figKind: "vertical", values: [k, k], hideIndex: null, allShown: true },
  });
}
function introRegoorstReason1() {
  const k = knownRegoorst();
  return reasonQ("Hoekom is hierdie twee hoeke gelyk?", "regoorst", otherCodes("regoorst", 1),
    verticalFigure(k, GREEN, { showAsk: true }), {
    tip: "Waar twee lyne mekaar sny, kry die hoeke oorkant mekaar 'n spesiale naam.",
    hint: "Waar twee lyne sny — regoorstaande hoeke is gelyk.",
    _chk: { figKind: "vertical", values: [k, k], hideIndex: null, allShown: true },
  });
}
function introRegoorstTF2() {
  const k = knownRegoorst();
  return tf("Regoorstaande hoeke ontstaan waar twee reguit lyne mekaar sny (soos 'n groot \"X\").", true, {
    figure: verticalFigure(k, GREEN, { showAsk: true }),
    tip: "Die 'X'-vorm wat twee lyne maak, gee vier hoeke — die oorkantste pare is gelyk.",
    hint: "Waar twee lyne sny — regoorstaande hoeke is gelyk.",
    _chk: { figKind: "vertical", values: [k, k], hideIndex: null, allShown: true },
  });
}
function introRegoorstMC2() {
  const k = knownRegoorst();
  const distract = nearDistractors(180 - k, 3, 12).filter(d => d > 0 && d < 180);
  while (distract.length < 3) distract.push(k + 10 * (distract.length + 1));
  return mc(`Die twee gemerkte hoeke is regoorstaande hoeke. Wat is HULLE gemeenskaplike waarde?`,
    shuffled([{ label: `${k}°`, correct: true }, ...distract.slice(0, 3).map(d => ({ label: `${d}°`, correct: false }))]), {
    figure: verticalFigure(k, GREEN, { showAsk: true }),
    tip: "Beide hoeke wys dieselfde getal — kies dit net.",
    hint: "Regoorstaande hoeke is altyd gelyk.",
    answerLabel: `${k}°`,
    _chk: { figKind: "vertical", values: [k, k], hideIndex: null, allShown: true },
  });
}
function introRegoorstReason2() {
  const k = knownRegoorst();
  return reasonQ("Watter rede sê vir ons hierdie twee hoeke is gelyk (nie 180° of 360° nie)?", "regoorst", otherCodes("regoorst", 2),
    verticalFigure(k, GREEN, { showAsk: true }), {
    tip: "Dis nie 'n som nie — dis 'n GELYKHEID tussen twee hoeke oorkant mekaar.",
    hint: "Waar twee lyne sny — regoorstaande hoeke is gelyk.",
    _chk: { figKind: "vertical", values: [k, k], hideIndex: null, allShown: true },
  });
}

/* ---- st2/st6/st10 se patroon: R1 = calc, rede IN die prompt ---- */
function regoorstR1() {
  const k = knownRegoorst();
  return calc(`Gebruik: <b>${REDES.regoorst.vol}</b>. Bereken die hoek wat met ${code("?")} gemerk is.`, k, {
    unit: "°", figure: verticalFigure(k, GREEN),
    tip: "Regoorstaande hoeke lê oorkant mekaar by die snypunt — soek 'n GELYKE waarde, nie 'n som nie.",
    hint: `Waar twee lyne sny — regoorstaande hoeke is gelyk. ? = ${k}°.`,
    solution: [{ s: `? = ${k}`, r: "regoorstaande hoeke is gelyk" }],
    _chk: { figKind: "vertical", values: [k, k], hideIndex: 1, allShown: false },
  });
}
function regoorstR2() {
  const k = knownRegoorst();
  return reasonQ(`Op die diagram is die twee gemerkte hoeke albei ${code(k + "°")}. Watter rede verduidelik dit?`,
    "regoorst", otherCodes("regoorst", 3), verticalFigure(k, GREEN, { showAsk: true }), {
    tip: "Kyk of dit 'n reguitlyn-som, 'n punt-som, of 'n GELYKHEID is.",
    hint: "Waar twee lyne sny — regoorstaande hoeke is gelyk.",
    _chk: { figKind: "vertical", values: [k, k], hideIndex: null, allShown: true },
  });
}
function regoorstR3() {
  const k = knownRegoorst();
  return calcReason(`Bereken die hoek wat met ${code("?")} gemerk is, en kies die rede.`, k, "regoorst", otherCodes("regoorst", 3),
    verticalFigure(k, GREEN), {
    unit: "°",
    tip: "Regoorstaande hoeke lê oorkant mekaar by die snypunt.",
    hint: `? = ${k}° — regoorstaande hoeke is gelyk.`,
    solution: [{ s: `? = ${k}`, r: "regoorstaande hoeke is gelyk" }],
    _chk: { figKind: "vertical", values: [k, k], hideIndex: 1, allShown: false },
  });
}

/* ============================================================
   BLOK 2 — HOEKE OP 'N REGUITLYN (st5–st8)
   ------------------------------------------------------------
   2-hoek variant: x = 180 − a. 3-hoek variant: x = 180 − a − b.
   ============================================================ */
function pair2() { return randInt(5, 31) * 5; }            // 25° … 155° (ask = 180−a, ook ≥25°)
function pair3() {
  let a, b;
  do { a = randInt(5, 20) * 5; b = randInt(5, 20) * 5; } while (a + b > 150 || a + b < 60);
  return [a, b];                                            // elk 25–100°, som ≤150° → derde ≥30°
}

function introReguitlynTF1() {
  const a = pair2(), c = 180 - a;
  return tf("Tel hierdie twee hoeke saam op tot 180°?", true, {
    figure: straightLineFigure(a, GREEN, { showAsk: true }),
    tip: "Kyk mooi — lê hulle langs mekaar op EEN reguit lyn?",
    hint: "Hoeke op 'n reguit lyn tel op tot 180°.",
    _chk: { figKind: "straightLine", values: [a, c], hideIndex: null, allShown: true },
  });
}
function introReguitlynMC1() {
  const a = pair2(), c = 180 - a;
  const distract = nearDistractors(c, 3, 12).filter(d => d > 0 && d < 180);
  while (distract.length < 3) distract.push(c + 5 * (distract.length + 1));
  return mc(`Die een hoek op die reguitlyn is ${code(a + "°")}. Hoe groot is die ander een?`,
    shuffled([{ label: `${c}°`, correct: true }, ...distract.slice(0, 3).map(d => ({ label: `${d}°`, correct: false }))]), {
    figure: straightLineFigure(a, GREEN, { showAsk: true }),
    tip: "Lees dit reguit van die prentjie af.",
    hint: `180 − ${a} = ${c}.`,
    answerLabel: `${c}°`,
    _chk: { figKind: "straightLine", values: [a, c], hideIndex: null, allShown: true },
  });
}
function introReguitlynReason1() {
  const a = pair2();
  return reasonQ("Hoekom tel hierdie twee hoeke saam op tot 180°?", "reguitlyn", otherCodes("reguitlyn", 1),
    straightLineFigure(a, GREEN, { showAsk: true }), {
    tip: "Kyk — is dit een reguit lyn met 'n knik van 'n ray af?",
    hint: "Hoeke op 'n reguit lyn tel op tot 180°.",
    _chk: { figKind: "straightLine", values: [a, 180 - a], hideIndex: null, allShown: true },
  });
}
function introReguitlynTF2() {
  const a = pair2();
  return tf("Hoeke op 'n reguit lyn tel altyd saam op tot 180°.", true, {
    figure: straightLineFigure(a, GREEN, { showAsk: true }),
    tip: "180° is 'n gestrekte hoek — presies 'n reguit lyn.",
    hint: "Hoeke op 'n reguit lyn tel op tot 180°.",
    _chk: { figKind: "straightLine", values: [a, 180 - a], hideIndex: null, allShown: true },
  });
}
function introReguitlynMC2() {
  const a = pair2(), c = 180 - a;
  const distract = nearDistractors(c, 3, 15).filter(d => d > 0 && d < 180);
  while (distract.length < 3) distract.push(c + 10 * (distract.length + 1));
  return mc(`Die een hoek op die reguitlyn is ${code(a + "°")}. Hoe groot is die ander een?`,
    shuffled([{ label: `${c}°`, correct: true }, ...distract.slice(0, 3).map(d => ({ label: `${d}°`, correct: false }))]), {
    figure: straightLineFigure(a, GREEN, { showAsk: true }),
    tip: "Beide hoeke saam maak presies 'n reguit lyn.",
    hint: `180 − ${a} = ${c}.`,
    answerLabel: `${c}°`,
    _chk: { figKind: "straightLine", values: [a, c], hideIndex: null, allShown: true },
  });
}
function introReguitlynReason2() {
  const a = pair2();
  return reasonQ("Watter rede verduidelik hierdie twee hoeke se som?", "reguitlyn", otherCodes("reguitlyn", 2),
    straightLineFigure(a, GREEN, { showAsk: true }), {
    tip: "Dis 'n SOM van 180°, nie 'n gelykheid nie.",
    hint: "Hoeke op 'n reguit lyn tel op tot 180°.",
    _chk: { figKind: "straightLine", values: [a, 180 - a], hideIndex: null, allShown: true },
  });
}

function reguitlynR1() {
  if (Math.random() < 0.45) {
    const [a, b] = pair3(), c = 180 - a - b;
    return calc(`Gebruik: <b>${REDES.reguitlyn.vol}</b>. Bereken die hoek wat met ${code("?")} gemerk is.`, c, {
      unit: "°", figure: straightLineFigure3(a, b, GREEN),
      tip: "Drie hoeke op EEN reguit lyn? Almal saam maak steeds 180°.",
      hint: `180 − ${a} − ${b} = ${c}.`,
      solution: [{ s: `? = 180 − ${a} − ${b} = ${c}`, r: "hoeke op 'n reguitlyn tel op tot 180°" }],
      _chk: { figKind: "straightLine3", values: [a, b, c], hideIndex: 2, allShown: false },
    });
  }
  const a = pair2(), c = 180 - a;
  return calc(`Gebruik: <b>${REDES.reguitlyn.vol}</b>. Bereken die hoek wat met ${code("?")} gemerk is.`, c, {
    unit: "°", figure: straightLineFigure(a, GREEN),
    tip: "Hoeke op 'n reguit lyn tel altyd op tot 180°.",
    hint: `180 − ${a} = ${c}.`,
    solution: [{ s: `? = 180 − ${a} = ${c}`, r: "hoeke op 'n reguitlyn tel op tot 180°" }],
    _chk: { figKind: "straightLine", values: [a, c], hideIndex: 1, allShown: false },
  });
}
function reguitlynR2() {
  if (Math.random() < 0.45) {
    const [a, b] = pair3(), c = 180 - a - b;
    return reasonQ(`Op die diagram is ${code("?")} = ${c}°. Watter rede verduidelik dit?`, "reguitlyn", otherCodes("reguitlyn", 3),
      straightLineFigure3(a, b, GREEN, { showAsk: true }), {
      tip: "Al drie hoeke lê saam op EEN reguit lyn.",
      hint: "Hoeke op 'n reguit lyn tel op tot 180°.",
      _chk: { figKind: "straightLine3", values: [a, b, c], hideIndex: null, allShown: true },
    });
  }
  const a = pair2(), c = 180 - a;
  return reasonQ(`Op die diagram is ${code("?")} = ${c}°. Watter rede verduidelik dit?`, "reguitlyn", otherCodes("reguitlyn", 3),
    straightLineFigure(a, GREEN, { showAsk: true }), {
    tip: "Die twee hoeke lê saam op EEN reguit lyn.",
    hint: "Hoeke op 'n reguit lyn tel op tot 180°.",
    _chk: { figKind: "straightLine", values: [a, c], hideIndex: null, allShown: true },
  });
}
function reguitlynR3() {
  if (Math.random() < 0.45) {
    const [a, b] = pair3(), c = 180 - a - b;
    return calcReason(`Bereken die hoek wat met ${code("?")} gemerk is, en kies die rede.`, c, "reguitlyn", otherCodes("reguitlyn", 3),
      straightLineFigure3(a, b, GREEN), {
      unit: "°",
      tip: "Drie hoeke op EEN reguit lyn? Almal saam maak steeds 180°.",
      hint: `180 − ${a} − ${b} = ${c}.`,
      solution: [{ s: `? = 180 − ${a} − ${b} = ${c}`, r: "hoeke op 'n reguitlyn tel op tot 180°" }],
      _chk: { figKind: "straightLine3", values: [a, b, c], hideIndex: 2, allShown: false },
    });
  }
  const a = pair2(), c = 180 - a;
  return calcReason(`Bereken die hoek wat met ${code("?")} gemerk is, en kies die rede.`, c, "reguitlyn", otherCodes("reguitlyn", 3),
    straightLineFigure(a, GREEN), {
    unit: "°",
    tip: "Hoeke op 'n reguit lyn tel altyd op tot 180°.",
    hint: `180 − ${a} = ${c}.`,
    solution: [{ s: `? = 180 − ${a} = ${c}`, r: "hoeke op 'n reguitlyn tel op tot 180°" }],
    _chk: { figKind: "straightLine", values: [a, c], hideIndex: 1, allShown: false },
  });
}

/* ============================================================
   BLOK 3 — HOEKE OM 'N PUNT (st9–st12)
   ------------------------------------------------------------
   2–4 hoeke rondom die punt (1–3 gegewe, 1 onbekend).
   ============================================================ */
function ompuntSet(minGiven = 1, maxGiven = 3) {
  const n = randInt(minGiven, maxGiven);
  const vals = [];
  for (let i = 0; i < n; i++) vals.push(randInt(5, 18) * 5);   // 25°…90° elk
  let sum = vals.reduce((s, v) => s + v, 0);
  let guard = 0;
  while ((360 - sum < 25 || 360 - sum > 300) && guard++ < 60) {
    vals[vals.length - 1] = randInt(5, 18) * 5;
    sum = vals.reduce((s, v) => s + v, 0);
  }
  const unknown = 360 - sum;
  return { values: [...vals, unknown], hideIndex: vals.length, unknown };
}
function introOmpuntSet() {
  let a, b;
  do { a = randInt(6, 16) * 5; b = randInt(6, 16) * 5; } while (360 - a - b < 40 || 360 - a - b > 230);
  return { a, b, c: 360 - a - b };
}

function introOmpuntTF1() {
  const { a, b, c } = introOmpuntSet();
  return tf("Tel al drie hoeke rondom die punt saam op tot 360°?", true, {
    figure: aroundPointFigureN([a, b, c], 2, GREEN, { showAsk: true }),
    tip: "Rondom een punt maak al die hoeke saam 'n volle draai.",
    hint: "Hoeke rondom 'n punt tel op tot 360°.",
    _chk: { figKind: "aroundPoint", values: [a, b, c], hideIndex: null, allShown: true },
  });
}
function introOmpuntMC1() {
  const { a, b, c } = introOmpuntSet();
  const distract = nearDistractors(c, 3, 15).filter(d => d > 0 && d < 360);
  while (distract.length < 3) distract.push(c + 10 * (distract.length + 1));
  return mc(`Twee hoeke rondom die punt is ${code(a + "°")} en ${code(b + "°")}. Hoe groot is die derde?`,
    shuffled([{ label: `${c}°`, correct: true }, ...distract.slice(0, 3).map(d => ({ label: `${d}°`, correct: false }))]), {
    figure: aroundPointFigureN([a, b, c], 2, GREEN, { showAsk: true }),
    tip: "Lees dit reguit van die prentjie af.",
    hint: `360 − ${a} − ${b} = ${c}.`,
    answerLabel: `${c}°`,
    _chk: { figKind: "aroundPoint", values: [a, b, c], hideIndex: null, allShown: true },
  });
}
function introOmpuntReason1() {
  const { a, b, c } = introOmpuntSet();
  return reasonQ("Hoekom tel hierdie drie hoeke saam op tot 360°?", "ompunt", otherCodes("ompunt", 1),
    aroundPointFigureN([a, b, c], 2, GREEN, { showAsk: true }), {
    tip: "Kyk — kom al die hoeke by EEN punt saam?",
    hint: "Hoeke rondom 'n punt tel op tot 360°.",
    _chk: { figKind: "aroundPoint", values: [a, b, c], hideIndex: null, allShown: true },
  });
}
function introOmpuntTF2() {
  const { a, b, c } = introOmpuntSet();
  return tf("Hoeke rondom 'n punt tel altyd saam op tot 360° — 'n volle draai.", true, {
    figure: aroundPointFigureN([a, b, c], 2, GREEN, { showAsk: true }),
    tip: "360° is 'n volle omwenteling — soos 'n hele pizza.",
    hint: "Hoeke rondom 'n punt tel op tot 360°.",
    _chk: { figKind: "aroundPoint", values: [a, b, c], hideIndex: null, allShown: true },
  });
}
function introOmpuntMC2() {
  const { a, b, c } = introOmpuntSet();
  const distract = nearDistractors(c, 3, 20).filter(d => d > 0 && d < 360);
  while (distract.length < 3) distract.push(c + 15 * (distract.length + 1));
  return mc(`Twee hoeke rondom die punt is ${code(a + "°")} en ${code(b + "°")}. Hoe groot is die derde?`,
    shuffled([{ label: `${c}°`, correct: true }, ...distract.slice(0, 3).map(d => ({ label: `${d}°`, correct: false }))]), {
    figure: aroundPointFigureN([a, b, c], 2, GREEN, { showAsk: true }),
    tip: "Al drie hoeke saam maak 'n volle draai.",
    hint: `360 − ${a} − ${b} = ${c}.`,
    answerLabel: `${c}°`,
    _chk: { figKind: "aroundPoint", values: [a, b, c], hideIndex: null, allShown: true },
  });
}
function introOmpuntReason2() {
  const { a, b, c } = introOmpuntSet();
  return reasonQ("Watter rede verduidelik hierdie drie hoeke se som?", "ompunt", otherCodes("ompunt", 2),
    aroundPointFigureN([a, b, c], 2, GREEN, { showAsk: true }), {
    tip: "Dis 'n som van 360°, om EEN punt.",
    hint: "Hoeke rondom 'n punt tel op tot 360°.",
    _chk: { figKind: "aroundPoint", values: [a, b, c], hideIndex: null, allShown: true },
  });
}

function ompuntR1() {
  const { values, hideIndex, unknown } = ompuntSet();
  const sumStr = values.slice(0, hideIndex).join(" − ");
  return calc(`Gebruik: <b>${REDES.ompunt.vol}</b>. Bereken die hoek wat met ${code("?")} gemerk is.`, unknown, {
    unit: "°", figure: aroundPointFigureN(values, hideIndex, GREEN),
    tip: "Al die hoeke rondom 'n punt maak saam 'n volle draai — 360°.",
    hint: `360 − ${sumStr} = ${unknown}.`,
    solution: [{ s: `? = 360 − ${sumStr} = ${unknown}`, r: "hoeke rondom 'n punt tel op tot 360°" }],
    _chk: { figKind: "aroundPoint", values, hideIndex, allShown: false },
  });
}
function ompuntR2() {
  const { values, hideIndex, unknown } = ompuntSet();
  return reasonQ(`Op die diagram is ${code("?")} = ${unknown}°. Watter rede verduidelik dit?`, "ompunt", otherCodes("ompunt", 3),
    aroundPointFigureN(values, hideIndex, GREEN, { showAsk: true }), {
    tip: "Al die hoeke rondom die punt tel saam op tot 'n volle draai.",
    hint: "Hoeke rondom 'n punt tel op tot 360°.",
    _chk: { figKind: "aroundPoint", values, hideIndex: null, allShown: true },
  });
}
function ompuntR3() {
  const { values, hideIndex, unknown } = ompuntSet();
  const sumStr = values.slice(0, hideIndex).join(" − ");
  return calcReason(`Bereken die hoek wat met ${code("?")} gemerk is, en kies die rede.`, unknown, "ompunt", otherCodes("ompunt", 3),
    aroundPointFigureN(values, hideIndex, GREEN), {
    unit: "°",
    tip: "Al die hoeke rondom 'n punt maak saam 'n volle draai — 360°.",
    hint: `360 − ${sumStr} = ${unknown}.`,
    solution: [{ s: `? = 360 − ${sumStr} = ${unknown}`, r: "hoeke rondom 'n punt tel op tot 360°" }],
    _chk: { figKind: "aroundPoint", values, hideIndex, allShown: false },
  });
}

/* ============================================================
   REGISTER
   ============================================================ */
const rep = (n, concept, gen) => Array.from({ length: n }, () => ({ concept, gen }));

export const CH6 = {
  st1: {
    guide: ["regoorst"],
    lesson: {
      title: "Regoorstaande hoeke",
      figure: verticalFigure(70, GREEN, { showAsk: true }),
      code: "regoorst",
      body: `<p>Wanneer twee reguit lyne mekaar sny, vorm hulle 'n groot <b>"X"</b>. Die twee hoeke wat <b>regoorskant</b> mekaar lê (nie langsaan nie) is altyd <b>presies ewe groot</b>.</p>
        <p>Op hierdie prentjie is altwee gemerkte hoeke <b>70°</b> — hulle lê oorkant mekaar by die snypunt. Jy hoef niks te bereken nie, net af te kyk!</p>`,
    },
    skills: [
      { concept: "regoorst", gen: introRegoorstTF1 }, { concept: "regoorst", gen: introRegoorstMC1 },
      { concept: "regoorst", gen: introRegoorstReason1 }, { concept: "regoorst", gen: introRegoorstTF2 },
      { concept: "regoorst", gen: introRegoorstMC2 }, { concept: "regoorst", gen: introRegoorstReason2 },
    ],
  },
  st2: { guide: ["regoorst"], skills: rep(10, "regoorst", regoorstR1) },
  st3: { guide: ["regoorst"], skills: rep(10, "regoorst", regoorstR2) },
  st4: { guide: ["regoorst"], skills: rep(10, "regoorst", regoorstR3) },

  st5: {
    guide: ["reguitlyn"],
    lesson: {
      title: "Hoeke op 'n reguitlyn",
      figure: straightLineFigure(130, GREEN, { showAsk: true }),
      code: "reguitlyn",
      body: `<p>As hoeke langs mekaar op <b>een reguit lyn</b> lê, tel hulle altyd saam op tot <b>180°</b> — dis presies 'n gestrekte hoek.</p>
        <p>Hier is die een hoek <b>130°</b> en die ander <b>50°</b> — saam: <code>130° + 50° = 180°</code>.</p>`,
    },
    skills: [
      { concept: "reguitlyn", gen: introReguitlynTF1 }, { concept: "reguitlyn", gen: introReguitlynMC1 },
      { concept: "reguitlyn", gen: introReguitlynReason1 }, { concept: "reguitlyn", gen: introReguitlynTF2 },
      { concept: "reguitlyn", gen: introReguitlynMC2 }, { concept: "reguitlyn", gen: introReguitlynReason2 },
    ],
  },
  st6: { guide: ["reguitlyn"], skills: rep(10, "reguitlyn", reguitlynR1) },
  st7: { guide: ["reguitlyn"], skills: rep(10, "reguitlyn", reguitlynR2) },
  st8: { guide: ["reguitlyn"], skills: rep(10, "reguitlyn", reguitlynR3) },

  st9: {
    guide: ["ompunt"],
    lesson: {
      title: "Hoeke om 'n punt",
      figure: aroundPointFigure(110, 90, GREEN, { showAsk: true }),
      code: "ompunt",
      body: `<p>Al die hoeke wat rondom <b>een punt</b> saamkom (soos snye van 'n pizza) tel altyd saam op tot 'n <b>volle draai</b> — <b>360°</b>.</p>
        <p>Hier is die drie hoeke 110°, 90° en 160° — saam: <code>110° + 90° + 160° = 360°</code>.</p>`,
    },
    skills: [
      { concept: "ompunt", gen: introOmpuntTF1 }, { concept: "ompunt", gen: introOmpuntMC1 },
      { concept: "ompunt", gen: introOmpuntReason1 }, { concept: "ompunt", gen: introOmpuntTF2 },
      { concept: "ompunt", gen: introOmpuntMC2 }, { concept: "ompunt", gen: introOmpuntReason2 },
    ],
  },
  st10: { guide: ["ompunt"], skills: rep(10, "ompunt", ompuntR1) },
  st11: { guide: ["ompunt"], skills: rep(10, "ompunt", ompuntR2) },
  st12: { guide: ["ompunt"], skills: rep(10, "ompunt", ompuntR3) },
};
