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
import { verticalFigure, straightLineFigure, straightLineFigure3, aroundPointFigure, aroundPointFigureN, triAnglesFigure, triangleFigure, buitehoekFigure } from "../engine/diagrams.js";
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
   BLOK 4 — BINNEHOEKE VAN 'N DRIEHOEK (st13–st16)
   ------------------------------------------------------------
   binnePair(regtehoek) gee die TWEE "basis"-hoeke wat triAnglesFigure
   gebruik om die driehoek te bou (die derde/tophoek word bereken —
   dis altyd die "?"). regtehoek=true forseer een van die twee op 90°
   (die regtehoek-blokkie-variant, 180−90−a, uit haar klasnotas).
   ============================================================ */
function binnePair(regtehoek = false) {
  if (regtehoek) {
    const other = randInt(5, 12) * 5;                 // 25°…60° (so 90−ander bly ≥30°) — hoër as 60° druk die
    return Math.random() < 0.5 ? [90, other] : [other, 90];   // twee gegewe etikette te na aan mekaar (verify-toets)
  }
  let angB, angC;
  do { angB = randInt(5, 26) * 5; angC = randInt(5, 26) * 5; } while (angB + angC > 140 || angB + angC < 60);
  return [angB, angC];                                // elk 25–115°, som 60–140° → derde (tophoek) 40–120°
  // (som > 145° maak die driehoek te "hoog en smal" — etikette begin oorvleuel; verify-toets vang dit)
}

function introBinneTF1() {
  const [b, c] = binnePair(); const a = 180 - b - c;
  return tf("Tel al drie hoeke van hierdie driehoek saam op tot 180°?", true, {
    figure: triAnglesFigure(b, c, GREEN, { showAsk: true }),
    tip: "Tel al drie binnehoeke van 'n driehoek bymekaar — kyk of dit 180° gee.",
    hint: "Binnehoeke van 'n driehoek tel op tot 180°.",
    _chk: { figKind: "triAngles", values: [a, b, c], hideIndex: null, allShown: true },
  });
}
function introBinneMC1() {
  const [b, c] = binnePair(); const a = 180 - b - c;
  const distract = nearDistractors(a, 3, 12).filter(d => d > 0 && d < 180);
  while (distract.length < 3) distract.push(a + 5 * (distract.length + 1));
  return mc(`Twee hoeke van die driehoek is ${code(b + "°")} en ${code(c + "°")}. Hoe groot is die derde?`,
    shuffled([{ label: `${a}°`, correct: true }, ...distract.slice(0, 3).map(d => ({ label: `${d}°`, correct: false }))]), {
    figure: triAnglesFigure(b, c, GREEN, { showAsk: true }),
    tip: "Lees dit reguit van die prentjie af.",
    hint: `180 − ${b} − ${c} = ${a}.`,
    answerLabel: `${a}°`,
    _chk: { figKind: "triAngles", values: [a, b, c], hideIndex: null, allShown: true },
  });
}
function introBinneReason1() {
  const [b, c] = binnePair(); const a = 180 - b - c;
  return reasonQ("Hoekom tel hierdie drie hoeke saam op tot 180°?", "binne", otherCodes("binne", 1),
    triAnglesFigure(b, c, GREEN, { showAsk: true }), {
    tip: "Kyk — is dit die drie binnehoeke van EEN driehoek?",
    hint: "Binnehoeke van 'n driehoek tel op tot 180°.",
    _chk: { figKind: "triAngles", values: [a, b, c], hideIndex: null, allShown: true },
  });
}
function introBinneTF2() {
  const [b, c] = binnePair(); const a = 180 - b - c;
  return tf("Die drie binnehoeke van ENIGE driehoek tel altyd saam op tot 180°.", true, {
    figure: triAnglesFigure(b, c, GREEN, { showAsk: true }),
    tip: "Maak nie saak hoe die driehoek lyk nie — altyd 180°.",
    hint: "Binnehoeke van 'n driehoek tel op tot 180°.",
    _chk: { figKind: "triAngles", values: [a, b, c], hideIndex: null, allShown: true },
  });
}
function introBinneMC2() {
  const [b, c] = binnePair(true); const a = 180 - b - c;
  const distract = nearDistractors(a, 3, 15).filter(d => d > 0 && d < 180);
  while (distract.length < 3) distract.push(a + 10 * (distract.length + 1));
  return mc(`Twee hoeke van die driehoek is ${code(b + "°")} en ${code(c + "°")}. Hoe groot is die derde?`,
    shuffled([{ label: `${a}°`, correct: true }, ...distract.slice(0, 3).map(d => ({ label: `${d}°`, correct: false }))]), {
    figure: triAnglesFigure(b, c, GREEN, { showAsk: true }),
    tip: "Al drie hoeke saam maak 180° — een hoek hier is 'n regte hoek (90°).",
    hint: `180 − ${b} − ${c} = ${a}.`,
    answerLabel: `${a}°`,
    _chk: { figKind: "triAngles", values: [a, b, c], hideIndex: null, allShown: true },
  });
}
function introBinneReason2() {
  const [b, c] = binnePair(); const a = 180 - b - c;
  return reasonQ("Watter rede verduidelik hierdie drie hoeke se som?", "binne", otherCodes("binne", 2),
    triAnglesFigure(b, c, GREEN, { showAsk: true }), {
    tip: "Dis 'n som van 180°, binne-in EEN driehoek.",
    hint: "Binnehoeke van 'n driehoek tel op tot 180°.",
    _chk: { figKind: "triAngles", values: [a, b, c], hideIndex: null, allShown: true },
  });
}

function binneR1() {
  const regtehoek = Math.random() < 0.4;
  const [b, c] = binnePair(regtehoek); const a = 180 - b - c;
  return calc(`Gebruik: <b>${REDES.binne.vol}</b>. Bereken die hoek wat met ${code("?")} gemerk is.`, a, {
    unit: "°", figure: triAnglesFigure(b, c, GREEN, { hide: "A" }),
    tip: regtehoek ? "Een hoek is 'n regte hoek (90°) — trek 90 EN die ander hoek van 180° af." : "Al drie binnehoeke van 'n driehoek maak saam 180°.",
    hint: `180 − ${b} − ${c} = ${a}.`,
    solution: [{ s: `? = 180 − ${b} − ${c} = ${a}`, r: "binnehoeke van 'n driehoek tel op tot 180°" }],
    _chk: { figKind: "triAngles", values: [a, b, c], hideIndex: 0, allShown: false },
  });
}
function binneR2() {
  const [b, c] = binnePair(Math.random() < 0.35); const a = 180 - b - c;
  return reasonQ(`Op die diagram is ${code("?")} = ${a}°. Watter rede verduidelik dit?`, "binne", otherCodes("binne", 3),
    triAnglesFigure(b, c, GREEN, { hide: "A", showAsk: true }), {
    tip: "Al drie binnehoeke van die driehoek tel saam op tot 180°.",
    hint: "Binnehoeke van 'n driehoek tel op tot 180°.",
    _chk: { figKind: "triAngles", values: [a, b, c], hideIndex: null, allShown: true },
  });
}
function binneR3() {
  const regtehoek = Math.random() < 0.4;
  const [b, c] = binnePair(regtehoek); const a = 180 - b - c;
  return calcReason(`Bereken die hoek wat met ${code("?")} gemerk is, en kies die rede.`, a, "binne", otherCodes("binne", 3),
    triAnglesFigure(b, c, GREEN, { hide: "A" }), {
    unit: "°",
    tip: regtehoek ? "Een hoek is 'n regte hoek (90°) — trek 90 EN die ander hoek van 180° af." : "Al drie binnehoeke van 'n driehoek maak saam 180°.",
    hint: `180 − ${b} − ${c} = ${a}.`,
    solution: [{ s: `? = 180 − ${b} − ${c} = ${a}`, r: "binnehoeke van 'n driehoek tel op tot 180°" }],
    _chk: { figKind: "triAngles", values: [a, b, c], hideIndex: 0, allShown: false },
  });
}

/* ============================================================
   BLOK 5 — GELYKBENIGE DRIEHOEK (st17–st22, SES rondtes)
   ------------------------------------------------------------
   apexEven(): tophoek altyd 'n EWE getal sodat (180−apex)÷2 'n heelgetal
   bly. baseGiven(): 'n basishoek (die "geen ÷2 nodig"-rigting).
   ============================================================ */
function apexEven() { return randInt(15, 60) * 2; }       // 30°…120°, altyd ewe
function baseGiven() { return randInt(6, 15) * 5; }        // 30°…75°

function introGelykTF1() {
  const apex = apexEven(), baseAng = (180 - apex) / 2;
  return tf("Is die twee basishoeke van hierdie gelykbenige driehoek gelyk?", true, {
    figure: triangleFigure("gelykbenig", GREEN, { apex, showAsk: true }),
    tip: "Gelykbenig beteken twee sye is gelyk — die hoeke oor daardie sye is dan OOK gelyk.",
    hint: "Hoeke teenoor gelyke sye is gelyk.",
    _chk: { figKind: "gelykbenig", values: [apex, baseAng, baseAng], apex, hideIndex: null, allShown: true },
  });
}
function introGelykMC1() {
  const apex = apexEven(), baseAng = (180 - apex) / 2;
  const distract = nearDistractors(baseAng, 3, 10).filter(d => d > 0 && d < 90);
  while (distract.length < 3) distract.push(baseAng + 5 * (distract.length + 1));
  return mc(`Die tophoek is ${code(apex + "°")}. Hoe groot is EEN basishoek?`,
    shuffled([{ label: `${baseAng}°`, correct: true }, ...distract.slice(0, 3).map(d => ({ label: `${d}°`, correct: false }))]), {
    figure: triangleFigure("gelykbenig", GREEN, { apex, showAsk: true }),
    tip: "Lees dit reguit van die prentjie af — albei basishoeke wys dieselfde getal.",
    hint: `(180 − ${apex}) ÷ 2 = ${baseAng}.`,
    answerLabel: `${baseAng}°`,
    _chk: { figKind: "gelykbenig", values: [apex, baseAng, baseAng], apex, hideIndex: null, allShown: true },
  });
}
function introGelykReason1() {
  const apex = apexEven();
  return reasonQ("Hoekom is die twee basishoeke van hierdie driehoek gelyk?", "gelykbenig", otherCodes("gelykbenig", 1),
    triangleFigure("gelykbenig", GREEN, { apex, showAsk: true }), {
    tip: "Twee sye is gelyk — kyk watter rede oor GELYKE SYE praat.",
    hint: "Hoeke teenoor gelyke sye is gelyk.",
    _chk: { figKind: "gelykbenig", values: [apex, (180 - apex) / 2, (180 - apex) / 2], apex, hideIndex: null, allShown: true },
  });
}
function introGelykTF2() {
  const apex = apexEven();
  return tf("In 'n gelykbenige driehoek is die twee hoeke teenoor die gelyke sye altyd gelyk.", true, {
    figure: triangleFigure("gelykbenig", GREEN, { apex, showAsk: true }),
    tip: "Dis presies wat 'gelykbenig' beteken — twee sye gelyk, twee hoeke gelyk.",
    hint: "Hoeke teenoor gelyke sye is gelyk.",
    _chk: { figKind: "gelykbenig", values: [apex, (180 - apex) / 2, (180 - apex) / 2], apex, hideIndex: null, allShown: true },
  });
}
function introGelykMC2() {
  const apex = apexEven(), baseAng = (180 - apex) / 2;
  const distract = nearDistractors(baseAng, 3, 14).filter(d => d > 0 && d < 90);
  while (distract.length < 3) distract.push(baseAng + 8 * (distract.length + 1));
  return mc(`Die tophoek is ${code(apex + "°")}. Hoe groot is die ANDER basishoek?`,
    shuffled([{ label: `${baseAng}°`, correct: true }, ...distract.slice(0, 3).map(d => ({ label: `${d}°`, correct: false }))]), {
    figure: triangleFigure("gelykbenig", GREEN, { apex, showAsk: true }),
    tip: "Beide basishoeke wys dieselfde getal.",
    hint: `(180 − ${apex}) ÷ 2 = ${baseAng}.`,
    answerLabel: `${baseAng}°`,
    _chk: { figKind: "gelykbenig", values: [apex, baseAng, baseAng], apex, hideIndex: null, allShown: true },
  });
}
function introGelykReason2() {
  const apex = apexEven();
  return reasonQ("Watter rede verduidelik hoekom die twee basishoeke gelyk is (nie 'n som nie)?", "gelykbenig", otherCodes("gelykbenig", 2),
    triangleFigure("gelykbenig", GREEN, { apex, showAsk: true }), {
    tip: "Dis 'n GELYKHEID tussen twee hoeke, oor gelyke sye.",
    hint: "Hoeke teenoor gelyke sye is gelyk.",
    _chk: { figKind: "gelykbenig", values: [apex, (180 - apex) / 2, (180 - apex) / 2], apex, hideIndex: null, allShown: true },
  });
}

/* st18 — R1-÷2: tophoek gegee, bereken EEN basishoek */
function gelykR1div2() {
  const apex = apexEven(), baseAng = (180 - apex) / 2;
  return calc(`Gebruik: <b>${REDES.gelykbenig.vol}</b>. Die tophoek is ${code(apex + "°")}. Bereken EEN basishoek (${code("?")}).`, baseAng, {
    unit: "°", figure: triangleFigure("gelykbenig", GREEN, { apex, hide: "base" }),
    tip: "Minus EERSTE (trek die tophoek van 180° af), en DAN deel deur 2.",
    hint: `(180 − ${apex}) ÷ 2 = ${baseAng}.`,
    solution: [{ s: `? = (180 − ${apex}) ÷ 2 = ${baseAng}`, r: "hoeke teenoor gelyke sye is gelyk" }],
    _chk: { figKind: "gelykbenig", values: [apex, baseAng, baseAng], apex, hideIndex: 1, allShown: false },
  });
}
/* st19 — R1-geen-÷2: EEN basishoek gegee → ander is net gelyk; apex=180−2b variant */
function gelykR1noDiv() {
  const b = baseGiven(), apex = 180 - 2 * b;
  if (Math.random() < 0.35) {
    return calc(`Gebruik: <b>${REDES.gelykbenig.vol}</b>. Altwee basishoeke is ${code(b + "°")}. Bereken die tophoek (${code("?")}).`, apex, {
      unit: "°", figure: triangleFigure("gelykbenig", GREEN, { apex, hide: "apex" }),
      tip: "Tel die twee basishoeke bymekaar en trek dit van 180° af — geen deling hier nie.",
      hint: `180 − ${b} − ${b} = ${apex}.`,
      solution: [{ s: `? = 180 − ${b} − ${b} = ${apex}`, r: "hoeke teenoor gelyke sye is gelyk" }],
      _chk: { figKind: "gelykbenig", values: [apex, b, b], apex, hideIndex: 0, allShown: false },
    });
  }
  const hideSide = Math.random() < 0.5 ? "baseR" : "baseL";
  return calc(`Gebruik: <b>${REDES.gelykbenig.vol}</b>. EEN basishoek is ${code(b + "°")}. Bereken die ANDER basishoek (${code("?")}).`, b, {
    unit: "°", figure: triangleFigure("gelykbenig", GREEN, { apex, hide: hideSide, showApex: false }),
    tip: "Geen deling hier nie — die ander basishoek is net EWE GROOT (gelyke sye, gelyke hoeke).",
    hint: `? = ${b} — die basishoeke is altyd gelyk.`,
    solution: [{ s: `? = ${b}`, r: "hoeke teenoor gelyke sye is gelyk" }],
    _chk: { figKind: "gelykbenig", values: [apex, b, b], apex, hideIndex: 1, allShown: false },
  });
}
/* st20 — "Deel jy deur 2?": Yay (tophoek gegee) / Nay (basishoek gegee).
   apexGiven word deur die skills-lys GEFORSEER (5 Yay + 5 Nay, geskommel) —
   'n muntgooi hier binne kan 'n hele rondte een kant toe laat val (CLAUDE.md-gotcha). */
function gelykDeelDeur2(apexGiven) {
  if (apexGiven) {
    const apex = apexEven();
    return tf("Moet jy deur 2 deel om die onbekende basishoek te kry?", true, {
      figure: triangleFigure("gelykbenig", GREEN, { apex, hide: "base" }),
      labels: ["Yay ✔️", "Nay ✘"],
      tip: "Kyk wat REEDS gegee is — as dit die TOPHOEK is, moet jy die res deel deur 2 om EEN basishoek te kry.",
      hint: "Tophoek gegee? Trek dit van 180° af, dan deel deur 2 — Yay.",
      _chk: { figKind: "gelykbenig", values: [apex, (180 - apex) / 2, (180 - apex) / 2], apex, hideIndex: 1, allShown: false },
    });
  }
  const b = baseGiven(), apex = 180 - 2 * b;
  const hideSide = Math.random() < 0.5 ? "baseR" : "baseL";
  return tf("Moet jy deur 2 deel om die onbekende basishoek te kry?", false, {
    figure: triangleFigure("gelykbenig", GREEN, { apex, hide: hideSide, showApex: false }),
    labels: ["Yay ✔️", "Nay ✘"],
    tip: "Kyk wat REEDS gegee is — as dit 'n BASISHOEK is, is die ander basishoek net EWE GROOT. Geen deling nie.",
    hint: "Basishoek gegee? Die ander een is net gelyk — Nay.",
    _chk: { figKind: "gelykbenig", values: [apex, b, b], apex, hideIndex: 1, allShown: false },
  });
}
/* st21 — R2 reasonQ, beide rigtings */
function gelykR2() {
  if (Math.random() < 0.5) {
    const apex = apexEven(), baseAng = (180 - apex) / 2;
    return reasonQ(`Op die diagram is EEN basishoek ${code(baseAng + "°")}. Watter rede verduidelik hoekom dit gelyk is aan die ander basishoek?`,
      "gelykbenig", otherCodes("gelykbenig", 3), triangleFigure("gelykbenig", GREEN, { apex, showAsk: true }), {
      tip: "Dis 'n GELYKHEID tussen twee hoeke, oor gelyke sye — nie 'n som nie.",
      hint: "Hoeke teenoor gelyke sye is gelyk.",
      _chk: { figKind: "gelykbenig", values: [apex, baseAng, baseAng], apex, hideIndex: null, allShown: true },
    });
  }
  const b = baseGiven(), apex = 180 - 2 * b;
  return reasonQ(`Op die diagram is EEN basishoek ${code(b + "°")}. Watter rede sê die ANDER basishoek is ook ${code(b + "°")}?`,
    "gelykbenig", otherCodes("gelykbenig", 3), triangleFigure("gelykbenig", GREEN, { apex, showAsk: true }), {
    tip: "Dis 'n GELYKHEID tussen twee hoeke, oor gelyke sye.",
    hint: "Hoeke teenoor gelyke sye is gelyk.",
    _chk: { figKind: "gelykbenig", values: [apex, b, b], apex, hideIndex: null, allShown: true },
  });
}
/* st22 — R3 calcReason, beide rigtings */
function gelykR3() {
  const roll = Math.random();
  if (roll < 0.4) {
    const apex = apexEven(), baseAng = (180 - apex) / 2;
    return calcReason(`Bereken EEN basishoek (${code("?")}), en kies die rede.`, baseAng, "gelykbenig", otherCodes("gelykbenig", 3),
      triangleFigure("gelykbenig", GREEN, { apex, hide: "base" }), {
      unit: "°",
      tip: "Minus EERSTE (trek die tophoek van 180° af), en DAN deel deur 2.",
      hint: `(180 − ${apex}) ÷ 2 = ${baseAng}.`,
      solution: [{ s: `? = (180 − ${apex}) ÷ 2 = ${baseAng}`, r: "hoeke teenoor gelyke sye is gelyk" }],
      _chk: { figKind: "gelykbenig", values: [apex, baseAng, baseAng], apex, hideIndex: 1, allShown: false },
    });
  }
  const b = baseGiven(), apex = 180 - 2 * b;
  if (roll < 0.75) {
    const hideSide = Math.random() < 0.5 ? "baseR" : "baseL";
    return calcReason(`Bereken die ANDER basishoek (${code("?")}), en kies die rede.`, b, "gelykbenig", otherCodes("gelykbenig", 3),
      triangleFigure("gelykbenig", GREEN, { apex, hide: hideSide, showApex: false }), {
      unit: "°",
      tip: "Geen deling nodig nie — die ander basishoek is net EWE GROOT.",
      hint: `? = ${b} — die basishoeke is altyd gelyk.`,
      solution: [{ s: `? = ${b}`, r: "hoeke teenoor gelyke sye is gelyk" }],
      _chk: { figKind: "gelykbenig", values: [apex, b, b], apex, hideIndex: 1, allShown: false },
    });
  }
  return calcReason(`Altwee basishoeke is ${code(b + "°")}. Bereken die tophoek (${code("?")}), en kies die rede.`, apex, "gelykbenig", otherCodes("gelykbenig", 3),
    triangleFigure("gelykbenig", GREEN, { apex, hide: "apex" }), {
    unit: "°",
    tip: "Tel die twee basishoeke bymekaar en trek dit van 180° af.",
    hint: `180 − ${b} − ${b} = ${apex}.`,
    solution: [{ s: `? = 180 − ${b} − ${b} = ${apex}`, r: "hoeke teenoor gelyke sye is gelyk" }],
    _chk: { figKind: "gelykbenig", values: [apex, b, b], apex, hideIndex: 0, allShown: false },
  });
}

/* ============================================================
   BLOK 6 — BUITEHOEK VAN 'N DRIEHOEK (st23–st27)
   ------------------------------------------------------------
   buitePair() gee angA, angB (die twee VER binnehoeke); die buitehoek
   = angA + angB, gemerk by C op die verlengde sy.
   ============================================================ */
function buitePair() {
  let a, b;
  do { a = randInt(5, 26) * 5; b = randInt(5, 26) * 5; } while (a + b > 140 || a + b < 60);
  return [a, b];                                      // elk 25–115°, som (=buitehoek) 60–140°
  // (som > 140° maak die driehoek te "hoog en smal" — etikette begin oorvleuel; verify-toets vang dit)
}

function introBuiteTF1() {
  const [a, b] = buitePair();
  return tf("Is die buitehoek gelyk aan die SOM van die twee ver binnehoeke?", true, {
    figure: buitehoekFigure(a, b, GREEN, { showAsk: true }),
    tip: "Die buitehoek (buite die driehoek, op die verlengde sy) is altyd = die som van die twee ANDER (ver) binnehoeke.",
    hint: "Buitehoek van 'n driehoek = som van die 2 ver binnehoeke.",
    _chk: { figKind: "buitehoek", values: [a, b, a + b], hideIndex: null, allShown: true },
  });
}
function introBuiteMC1() {
  const [a, b] = buitePair(); const ext = a + b;
  const distract = nearDistractors(ext, 3, 15).filter(d => d > 0 && d < 180);
  while (distract.length < 3) distract.push(ext + 8 * (distract.length + 1));
  return mc(`Die twee ver binnehoeke is ${code(a + "°")} en ${code(b + "°")}. Hoe groot is die buitehoek?`,
    shuffled([{ label: `${ext}°`, correct: true }, ...distract.slice(0, 3).map(d => ({ label: `${d}°`, correct: false }))]), {
    figure: buitehoekFigure(a, b, GREEN, { showAsk: true }),
    tip: "Lees dit reguit van die prentjie af — tel die twee ver hoeke bymekaar.",
    hint: `${a} + ${b} = ${ext}.`,
    answerLabel: `${ext}°`,
    _chk: { figKind: "buitehoek", values: [a, b, ext], hideIndex: null, allShown: true },
  });
}
function introBuiteReason1() {
  const [a, b] = buitePair();
  return reasonQ("Hoekom is die buitehoek gelyk aan die som van die twee ver binnehoeke?", "buite", otherCodes("buite", 1),
    buitehoekFigure(a, b, GREEN, { showAsk: true }), {
    tip: "Kyk — is dit 'n buitehoek OP die verlengde sy?",
    hint: "Buitehoek van 'n driehoek = som van die 2 ver binnehoeke.",
    _chk: { figKind: "buitehoek", values: [a, b, a + b], hideIndex: null, allShown: true },
  });
}
function introBuiteTF2() {
  const [a, b] = buitePair();
  return tf("'n Buitehoek van 'n driehoek lê OP die verlengde sy, buite die driehoek.", true, {
    figure: buitehoekFigure(a, b, GREEN, { showAsk: true }),
    tip: "Verleng een sy verby 'n hoekpunt — die hoek daar buite is die buitehoek.",
    hint: "Buite = op die verlengde sy, buite die driehoek.",
    _chk: { figKind: "buitehoek", values: [a, b, a + b], hideIndex: null, allShown: true },
  });
}
function introBuiteMC2() {
  const [a, b] = buitePair(); const ext = a + b;
  const distract = nearDistractors(ext, 3, 18).filter(d => d > 0 && d < 180);
  while (distract.length < 3) distract.push(ext + 10 * (distract.length + 1));
  return mc(`Die twee ver binnehoeke is ${code(a + "°")} en ${code(b + "°")}. Hoe groot is die buitehoek?`,
    shuffled([{ label: `${ext}°`, correct: true }, ...distract.slice(0, 3).map(d => ({ label: `${d}°`, correct: false }))]), {
    figure: buitehoekFigure(a, b, GREEN, { showAsk: true }),
    tip: "Tel die twee ver binnehoeke bymekaar.",
    hint: `${a} + ${b} = ${ext}.`,
    answerLabel: `${ext}°`,
    _chk: { figKind: "buitehoek", values: [a, b, ext], hideIndex: null, allShown: true },
  });
}
function introBuiteReason2() {
  const [a, b] = buitePair();
  return reasonQ("Watter rede verduidelik die buitehoek se waarde (nie 180° of 'gelyke sye' nie)?", "buite", otherCodes("buite", 2),
    buitehoekFigure(a, b, GREEN, { showAsk: true }), {
    tip: "Dis 'n SOM van die twee VER binnehoeke.",
    hint: "Buitehoek van 'n driehoek = som van die 2 ver binnehoeke.",
    _chk: { figKind: "buitehoek", values: [a, b, a + b], hideIndex: null, allShown: true },
  });
}

/* st24 — "Binne of buite?": een hoek gemerk, kies binnehoek/buitehoek.
   `which` word deur die skills-lys GEFORSEER (5 buite + 5 binne, geskommel) —
   pick() hier binne gee gemiddeld net 2,5 buitehoeke per rondte. */
function binneOfBuite(which) {
  const [a, b] = buitePair();
  const isBuite = which === "ext";
  const vals = { A: a, B: b, C: 180 - a - b, ext: a + b };
  return mc("Watter TIPE hoek is gemerk?",
    shuffled([{ label: "Binnehoek", correct: !isBuite }, { label: "Buitehoek", correct: isBuite }]), {
    figure: buitehoekFigure(a, b, GREEN, { markOnly: which }),
    tip: "Buite = OP die verlengde sy, buite die driehoek. Enigiets tussen die driehoek se drie hoekpunte is 'n binnehoek.",
    hint: isBuite ? "Dié hoek lê op die verlengde sy — buitehoek." : "Dié hoek lê binne die driehoek se drie hoeke — binnehoek.",
    answerLabel: isBuite ? "Buitehoek" : "Binnehoek",
    _chk: { figKind: "buitehoek", values: [vals[which]], hideIndex: null, allShown: true },
  });
}

/* st25 — R1: twee ver binnehoeke → buitehoek, EN die omgekeerde rigting */
function buiteR1() {
  const [a, b] = buitePair(); const ext = a + b;
  if (Math.random() < 0.5) {
    return calc(`Gebruik: <b>${REDES.buite.vol}</b>. Bereken die buitehoek (${code("?")}).`, ext, {
      unit: "°", figure: buitehoekFigure(a, b, GREEN, { hide: "ext" }),
      tip: "Tel die twee VER binnehoeke bymekaar.",
      hint: `${a} + ${b} = ${ext}.`,
      solution: [{ s: `? = ${a} + ${b} = ${ext}`, r: "buitehoek van 'n driehoek = som van die 2 ver binnehoeke" }],
      _chk: { figKind: "buitehoek", values: [a, b, ext], hideIndex: 2, allShown: false },
    });
  }
  const hideOne = Math.random() < 0.5 ? "A" : "B";
  const known = hideOne === "A" ? b : a, askVal = hideOne === "A" ? a : b;
  return calc(`Gebruik: <b>${REDES.buite.vol}</b>. Die buitehoek is ${code(ext + "°")} en die een ver binnehoek is ${code(known + "°")}. Bereken die ander ver binnehoek (${code("?")}).`, askVal, {
    unit: "°", figure: buitehoekFigure(a, b, GREEN, { hide: hideOne }),
    tip: "Trek die bekende ver binnehoek van die buitehoek af.",
    hint: `${ext} − ${known} = ${askVal}.`,
    solution: [{ s: `? = ${ext} − ${known} = ${askVal}`, r: "buitehoek van 'n driehoek = som van die 2 ver binnehoeke" }],
    _chk: { figKind: "buitehoek", values: [a, b, ext], hideIndex: hideOne === "A" ? 0 : 1, allShown: false },
  });
}
/* st26 — R2 reasonQ, "binne" as versoekende afleier */
function buiteR2() {
  const [a, b] = buitePair(); const ext = a + b;
  const extra = shuffled(REDE_CODES.filter(c => c !== "buite" && c !== "binne")).slice(0, 2);
  const offered = shuffled(["binne", ...extra]);
  return reasonQ(`Op die diagram is die buitehoek ${code(ext + "°")}. Watter rede verduidelik dit?`, "buite", offered,
    buitehoekFigure(a, b, GREEN, { showAsk: true }), {
    tip: "Dit gaan oor 'n hoek BUITE die driehoek — nie die binnehoeke se som nie.",
    hint: "Buitehoek van 'n driehoek = som van die 2 ver binnehoeke.",
    _chk: { figKind: "buitehoek", values: [a, b, ext], hideIndex: null, allShown: true },
  });
}
/* st27 — R3 calcReason */
function buiteR3() {
  const [a, b] = buitePair(); const ext = a + b;
  if (Math.random() < 0.5) {
    return calcReason(`Bereken die buitehoek (${code("?")}), en kies die rede.`, ext, "buite", otherCodes("buite", 3),
      buitehoekFigure(a, b, GREEN, { hide: "ext" }), {
      unit: "°",
      tip: "Tel die twee VER binnehoeke bymekaar.",
      hint: `${a} + ${b} = ${ext}.`,
      solution: [{ s: `? = ${a} + ${b} = ${ext}`, r: "buitehoek van 'n driehoek = som van die 2 ver binnehoeke" }],
      _chk: { figKind: "buitehoek", values: [a, b, ext], hideIndex: 2, allShown: false },
    });
  }
  const hideOne = Math.random() < 0.5 ? "A" : "B";
  const known = hideOne === "A" ? b : a, askVal = hideOne === "A" ? a : b;
  return calcReason(`Gebruik: <b>${REDES.buite.vol}</b>. Die buitehoek is ${code(ext + "°")}. Bereken die ander ver binnehoek (${code("?")}), en kies die rede.`, askVal, "buite", otherCodes("buite", 3),
    buitehoekFigure(a, b, GREEN, { hide: hideOne }), {
    unit: "°",
    tip: "Trek die bekende ver binnehoek van die buitehoek af.",
    hint: `${ext} − ${known} = ${askVal}.`,
    solution: [{ s: `? = ${ext} − ${known} = ${askVal}`, r: "buitehoek van 'n driehoek = som van die 2 ver binnehoeke" }],
    _chk: { figKind: "buitehoek", values: [a, b, ext], hideIndex: hideOne === "A" ? 0 : 1, allShown: false },
  });
}

/* ============================================================
   BLOK 7 — GEMENGDE RONDTES (st28–st32)
   ------------------------------------------------------------
   Al ses stellings deurmekaar. Skills-lyste FORSEER die mengsel —
   elke stelling se generator is sy EIE skill-inskrywing (nes st20/
   st24 na die formaan-fix); nooit 'n muntgooi BINNE een gen() wat
   'n hele rondte een kant toe kan laat val nie.

   MIXED-RONDTE REËL (haar 2026-08-10 ruling, Fable-hersiening): die
   q.tip (altyd-sigbare blou boks) en die hint noem NOOIT die stelling
   of sy rede se woorde nie — dit gee die "watter rede?"-helfte van
   die antwoord weg. Net die worked solution (r:) mag die volle rede
   noem. Vir st28 (waarde-alleen) staan die rede WEL in die prompt
   self (soos elke R1-rondte) — dis nie die tip/hint nie, en is met
   opset per haar spesifikasie.
   ============================================================ */
const MIX_TIPS = [
  "Kyk mooi na die prentjie — watter storie pas?",
  "Bestudeer die prentjie eers — dit wys jou presies watter tipe hoeke dit is.",
  "Geen haas nie — kyk na die vorm en die gemerkte hoeke voor jy bereken.",
];
const MIX_HINTS_R = [
  "Kyk mooi: is dit 'n SOM van hoeke, of is twee hoeke net gelyk aan mekaar?",
  "Onthou die ses redes hierbo — kyk watter EEN by hierdie prentjie pas.",
];
function mixCalcPrompt(themeCode) {
  return `Gebruik: <b>${REDES[themeCode].vol}</b>. Bereken die hoek wat met ${code("?")} gemerk is.`;
}

/* ---- st28: calc, rede IN die prompt (soos elke R1), tip/hint generies ---- */
function calcMixedRegoorst() {
  const k = knownRegoorst();
  return calc(mixCalcPrompt("regoorst"), k, {
    unit: "°", figure: verticalFigure(k, GREEN),
    tip: pick(MIX_TIPS), hint: `Vergelyk die twee gemerkte hoeke by die snypunt — wat merk jy op?`,
    solution: [{ s: `? = ${k}`, r: REDES.regoorst.vol }],
    _chk: { figKind: "vertical", values: [k, k], hideIndex: 1, allShown: false },
  });
}
function calcMixedReguitlyn() {
  if (Math.random() < 0.45) {
    const [a, b] = pair3(), c = 180 - a - b;
    return calc(mixCalcPrompt("reguitlyn"), c, {
      unit: "°", figure: straightLineFigure3(a, b, GREEN),
      tip: pick(MIX_TIPS), hint: `Probeer: 180 − ${a} − ${b} = ?`,
      solution: [{ s: `? = 180 − ${a} − ${b} = ${c}`, r: REDES.reguitlyn.vol }],
      _chk: { figKind: "straightLine3", values: [a, b, c], hideIndex: 2, allShown: false },
    });
  }
  const a = pair2(), c = 180 - a;
  return calc(mixCalcPrompt("reguitlyn"), c, {
    unit: "°", figure: straightLineFigure(a, GREEN),
    tip: pick(MIX_TIPS), hint: `Probeer: 180 − ${a} = ?`,
    solution: [{ s: `? = 180 − ${a} = ${c}`, r: REDES.reguitlyn.vol }],
    _chk: { figKind: "straightLine", values: [a, c], hideIndex: 1, allShown: false },
  });
}
function calcMixedOmpunt() {
  const { values, hideIndex, unknown } = ompuntSet();
  const sumStr = values.slice(0, hideIndex).join(" − ");
  return calc(mixCalcPrompt("ompunt"), unknown, {
    unit: "°", figure: aroundPointFigureN(values, hideIndex, GREEN),
    tip: pick(MIX_TIPS), hint: `Probeer: 360 − ${sumStr} = ?`,
    solution: [{ s: `? = 360 − ${sumStr} = ${unknown}`, r: REDES.ompunt.vol }],
    _chk: { figKind: "aroundPoint", values, hideIndex, allShown: false },
  });
}
function calcMixedBinne() {
  const regtehoek = Math.random() < 0.4;
  const [b, c] = binnePair(regtehoek); const a = 180 - b - c;
  return calc(mixCalcPrompt("binne"), a, {
    unit: "°", figure: triAnglesFigure(b, c, GREEN, { hide: "A" }),
    tip: pick(MIX_TIPS), hint: `Probeer: 180 − ${b} − ${c} = ?`,
    solution: [{ s: `? = 180 − ${b} − ${c} = ${a}`, r: REDES.binne.vol }],
    _chk: { figKind: "triAngles", values: [a, b, c], hideIndex: 0, allShown: false },
  });
}
function calcMixedGelyk() {
  const roll = Math.random();
  if (roll < 0.45) {
    const apex = apexEven(), baseAng = (180 - apex) / 2;
    return calc(mixCalcPrompt("gelykbenig"), baseAng, {
      unit: "°", figure: triangleFigure("gelykbenig", GREEN, { apex, hide: "base" }),
      tip: pick(MIX_TIPS), hint: `Probeer: (180 − ${apex}) ÷ 2 = ?`,
      solution: [{ s: `? = (180 − ${apex}) ÷ 2 = ${baseAng}`, r: REDES.gelykbenig.vol }],
      _chk: { figKind: "gelykbenig", values: [apex, baseAng, baseAng], apex, hideIndex: 1, allShown: false },
    });
  }
  if (roll < 0.8) {
    const b = baseGiven(), apex = 180 - 2 * b;
    const hideSide = Math.random() < 0.5 ? "baseR" : "baseL";
    return calc(mixCalcPrompt("gelykbenig"), b, {
      unit: "°", figure: triangleFigure("gelykbenig", GREEN, { apex, hide: hideSide, showApex: false }),
      tip: pick(MIX_TIPS), hint: `Kyk na die merkies op die twee sye — wat sê dit van die twee basishoeke?`,
      solution: [{ s: `? = ${b}`, r: REDES.gelykbenig.vol }],
      _chk: { figKind: "gelykbenig", values: [apex, b, b], apex, hideIndex: 1, allShown: false },
    });
  }
  const b = baseGiven(), apex = 180 - 2 * b;
  return calc(mixCalcPrompt("gelykbenig"), apex, {
    unit: "°", figure: triangleFigure("gelykbenig", GREEN, { apex, hide: "apex" }),
    tip: pick(MIX_TIPS), hint: `Probeer: 180 − ${b} − ${b} = ?`,
    solution: [{ s: `? = 180 − ${b} − ${b} = ${apex}`, r: REDES.gelykbenig.vol }],
    _chk: { figKind: "gelykbenig", values: [apex, b, b], apex, hideIndex: 0, allShown: false },
  });
}
function calcMixedBuite() {
  const [a, b] = buitePair(); const ext = a + b;
  if (Math.random() < 0.5) {
    return calc(mixCalcPrompt("buite"), ext, {
      unit: "°", figure: buitehoekFigure(a, b, GREEN, { hide: "ext" }),
      tip: pick(MIX_TIPS), hint: `Probeer: ${a} + ${b} = ?`,
      solution: [{ s: `? = ${a} + ${b} = ${ext}`, r: REDES.buite.vol }],
      _chk: { figKind: "buitehoek", values: [a, b, ext], hideIndex: 2, allShown: false },
    });
  }
  const hideOne = Math.random() < 0.5 ? "A" : "B";
  const known = hideOne === "A" ? b : a, askVal = hideOne === "A" ? a : b;
  return calc(mixCalcPrompt("buite"), askVal, {
    unit: "°", figure: buitehoekFigure(a, b, GREEN, { hide: hideOne }),
    tip: pick(MIX_TIPS), hint: `Probeer: ${ext} − ${known} = ?`,
    solution: [{ s: `? = ${ext} − ${known} = ${askVal}`, r: REDES.buite.vol }],
    _chk: { figKind: "buitehoek", values: [a, b, ext], hideIndex: hideOne === "A" ? 0 : 1, allShown: false },
  });
}

/* ---- st29: reasonQ, waarde alreeds gewys, kies die rede (4 chips) ---- */
function reasonMixedRegoorst() {
  const k = knownRegoorst();
  return reasonQ(`Op die diagram is die twee gemerkte hoeke albei ${code(k + "°")}. Watter rede verduidelik dit?`,
    "regoorst", otherCodes("regoorst", 3), verticalFigure(k, GREEN, { showAsk: true }), {
    tip: pick(MIX_TIPS), hint: pick(MIX_HINTS_R),
    _chk: { figKind: "vertical", values: [k, k], hideIndex: null, allShown: true },
  });
}
function reasonMixedReguitlyn() {
  if (Math.random() < 0.45) {
    const [a, b] = pair3(), c = 180 - a - b;
    return reasonQ(`Op die diagram is ${code("?")} = ${c}°. Watter rede verduidelik dit?`, "reguitlyn", otherCodes("reguitlyn", 3),
      straightLineFigure3(a, b, GREEN, { showAsk: true }), {
      tip: pick(MIX_TIPS), hint: pick(MIX_HINTS_R),
      _chk: { figKind: "straightLine3", values: [a, b, c], hideIndex: null, allShown: true },
    });
  }
  const a = pair2(), c = 180 - a;
  return reasonQ(`Op die diagram is ${code("?")} = ${c}°. Watter rede verduidelik dit?`, "reguitlyn", otherCodes("reguitlyn", 3),
    straightLineFigure(a, GREEN, { showAsk: true }), {
    tip: pick(MIX_TIPS), hint: pick(MIX_HINTS_R),
    _chk: { figKind: "straightLine", values: [a, c], hideIndex: null, allShown: true },
  });
}
function reasonMixedOmpunt() {
  const { values, hideIndex, unknown } = ompuntSet();
  return reasonQ(`Op die diagram is ${code("?")} = ${unknown}°. Watter rede verduidelik dit?`, "ompunt", otherCodes("ompunt", 3),
    aroundPointFigureN(values, hideIndex, GREEN, { showAsk: true }), {
    tip: pick(MIX_TIPS), hint: pick(MIX_HINTS_R),
    _chk: { figKind: "aroundPoint", values, hideIndex: null, allShown: true },
  });
}
function reasonMixedBinne() {
  const [b, c] = binnePair(Math.random() < 0.35); const a = 180 - b - c;
  return reasonQ(`Op die diagram is ${code("?")} = ${a}°. Watter rede verduidelik dit?`, "binne", otherCodes("binne", 3),
    triAnglesFigure(b, c, GREEN, { hide: "A", showAsk: true }), {
    tip: pick(MIX_TIPS), hint: pick(MIX_HINTS_R),
    _chk: { figKind: "triAngles", values: [a, b, c], hideIndex: null, allShown: true },
  });
}
function reasonMixedGelyk() {
  if (Math.random() < 0.5) {
    const apex = apexEven(), baseAng = (180 - apex) / 2;
    return reasonQ(`Op die diagram is EEN basishoek ${code(baseAng + "°")}. Watter rede verduidelik hoekom dit gelyk is aan die ander basishoek?`,
      "gelykbenig", otherCodes("gelykbenig", 3), triangleFigure("gelykbenig", GREEN, { apex, showAsk: true }), {
      tip: pick(MIX_TIPS), hint: pick(MIX_HINTS_R),
      _chk: { figKind: "gelykbenig", values: [apex, baseAng, baseAng], apex, hideIndex: null, allShown: true },
    });
  }
  const b = baseGiven(), apex = 180 - 2 * b;
  return reasonQ(`Op die diagram is EEN basishoek ${code(b + "°")}. Watter rede sê die ANDER basishoek is ook ${code(b + "°")}?`,
    "gelykbenig", otherCodes("gelykbenig", 3), triangleFigure("gelykbenig", GREEN, { apex, showAsk: true }), {
    tip: pick(MIX_TIPS), hint: pick(MIX_HINTS_R),
    _chk: { figKind: "gelykbenig", values: [apex, b, b], apex, hideIndex: null, allShown: true },
  });
}
function reasonMixedBuite() {
  const [a, b] = buitePair(); const ext = a + b;
  return reasonQ(`Op die diagram is die buitehoek ${code(ext + "°")}. Watter rede verduidelik dit?`, "buite", otherCodes("buite", 3),
    buitehoekFigure(a, b, GREEN, { showAsk: true }), {
    tip: pick(MIX_TIPS), hint: pick(MIX_HINTS_R),
    _chk: { figKind: "buitehoek", values: [a, b, ext], hideIndex: null, allShown: true },
  });
}

/* ---- st30/st31: calcReason, enkel-stap, tip/hint generies ---- */
function calcReasonMixedRegoorst() {
  const k = knownRegoorst();
  return calcReason(`Bereken die hoek wat met ${code("?")} gemerk is, en kies die rede.`, k, "regoorst", otherCodes("regoorst", 3),
    verticalFigure(k, GREEN), {
    unit: "°", tip: pick(MIX_TIPS), hint: `Vergelyk die twee gemerkte hoeke by die snypunt — wat merk jy op?`,
    solution: [{ s: `? = ${k}`, r: REDES.regoorst.vol }],
    _chk: { figKind: "vertical", values: [k, k], hideIndex: 1, allShown: false },
  });
}
function calcReasonMixedReguitlyn() {
  if (Math.random() < 0.45) {
    const [a, b] = pair3(), c = 180 - a - b;
    return calcReason(`Bereken die hoek wat met ${code("?")} gemerk is, en kies die rede.`, c, "reguitlyn", otherCodes("reguitlyn", 3),
      straightLineFigure3(a, b, GREEN), {
      unit: "°", tip: pick(MIX_TIPS), hint: `Probeer: 180 − ${a} − ${b} = ?`,
      solution: [{ s: `? = 180 − ${a} − ${b} = ${c}`, r: REDES.reguitlyn.vol }],
      _chk: { figKind: "straightLine3", values: [a, b, c], hideIndex: 2, allShown: false },
    });
  }
  const a = pair2(), c = 180 - a;
  return calcReason(`Bereken die hoek wat met ${code("?")} gemerk is, en kies die rede.`, c, "reguitlyn", otherCodes("reguitlyn", 3),
    straightLineFigure(a, GREEN), {
    unit: "°", tip: pick(MIX_TIPS), hint: `Probeer: 180 − ${a} = ?`,
    solution: [{ s: `? = 180 − ${a} = ${c}`, r: REDES.reguitlyn.vol }],
    _chk: { figKind: "straightLine", values: [a, c], hideIndex: 1, allShown: false },
  });
}
function calcReasonMixedOmpunt() {
  const { values, hideIndex, unknown } = ompuntSet();
  const sumStr = values.slice(0, hideIndex).join(" − ");
  return calcReason(`Bereken die hoek wat met ${code("?")} gemerk is, en kies die rede.`, unknown, "ompunt", otherCodes("ompunt", 3),
    aroundPointFigureN(values, hideIndex, GREEN), {
    unit: "°", tip: pick(MIX_TIPS), hint: `Probeer: 360 − ${sumStr} = ?`,
    solution: [{ s: `? = 360 − ${sumStr} = ${unknown}`, r: REDES.ompunt.vol }],
    _chk: { figKind: "aroundPoint", values, hideIndex, allShown: false },
  });
}
function calcReasonMixedBinne() {
  const regtehoek = Math.random() < 0.4;
  const [b, c] = binnePair(regtehoek); const a = 180 - b - c;
  return calcReason(`Bereken die hoek wat met ${code("?")} gemerk is, en kies die rede.`, a, "binne", otherCodes("binne", 3),
    triAnglesFigure(b, c, GREEN, { hide: "A" }), {
    unit: "°", tip: pick(MIX_TIPS), hint: `Probeer: 180 − ${b} − ${c} = ?`,
    solution: [{ s: `? = 180 − ${b} − ${c} = ${a}`, r: REDES.binne.vol }],
    _chk: { figKind: "triAngles", values: [a, b, c], hideIndex: 0, allShown: false },
  });
}
function calcReasonMixedGelyk() {
  const roll = Math.random();
  if (roll < 0.4) {
    const apex = apexEven(), baseAng = (180 - apex) / 2;
    return calcReason(`Bereken EEN basishoek (${code("?")}), en kies die rede.`, baseAng, "gelykbenig", otherCodes("gelykbenig", 3),
      triangleFigure("gelykbenig", GREEN, { apex, hide: "base" }), {
      unit: "°", tip: pick(MIX_TIPS), hint: `Probeer: (180 − ${apex}) ÷ 2 = ?`,
      solution: [{ s: `? = (180 − ${apex}) ÷ 2 = ${baseAng}`, r: REDES.gelykbenig.vol }],
      _chk: { figKind: "gelykbenig", values: [apex, baseAng, baseAng], apex, hideIndex: 1, allShown: false },
    });
  }
  const b = baseGiven(), apex = 180 - 2 * b;
  if (roll < 0.75) {
    const hideSide = Math.random() < 0.5 ? "baseR" : "baseL";
    return calcReason(`Bereken die ANDER basishoek (${code("?")}), en kies die rede.`, b, "gelykbenig", otherCodes("gelykbenig", 3),
      triangleFigure("gelykbenig", GREEN, { apex, hide: hideSide, showApex: false }), {
      unit: "°", tip: pick(MIX_TIPS), hint: `Kyk na die merkies op die twee sye — wat sê dit van die twee basishoeke?`,
      solution: [{ s: `? = ${b}`, r: REDES.gelykbenig.vol }],
      _chk: { figKind: "gelykbenig", values: [apex, b, b], apex, hideIndex: 1, allShown: false },
    });
  }
  return calcReason(`Altwee basishoeke is ${code(b + "°")}. Bereken die tophoek (${code("?")}), en kies die rede.`, apex, "gelykbenig", otherCodes("gelykbenig", 3),
    triangleFigure("gelykbenig", GREEN, { apex, hide: "apex" }), {
    unit: "°", tip: pick(MIX_TIPS), hint: `Probeer: 180 − ${b} − ${b} = ?`,
    solution: [{ s: `? = 180 − ${b} − ${b} = ${apex}`, r: REDES.gelykbenig.vol }],
    _chk: { figKind: "gelykbenig", values: [apex, b, b], apex, hideIndex: 0, allShown: false },
  });
}
function calcReasonMixedBuite() {
  const [a, b] = buitePair(); const ext = a + b;
  if (Math.random() < 0.5) {
    return calcReason(`Bereken die buitehoek (${code("?")}), en kies die rede.`, ext, "buite", otherCodes("buite", 3),
      buitehoekFigure(a, b, GREEN, { hide: "ext" }), {
      unit: "°", tip: pick(MIX_TIPS), hint: `Probeer: ${a} + ${b} = ?`,
      solution: [{ s: `? = ${a} + ${b} = ${ext}`, r: REDES.buite.vol }],
      _chk: { figKind: "buitehoek", values: [a, b, ext], hideIndex: 2, allShown: false },
    });
  }
  const hideOne = Math.random() < 0.5 ? "A" : "B";
  const known = hideOne === "A" ? b : a, askVal = hideOne === "A" ? a : b;
  return calcReason(`Die buitehoek is ${code(ext + "°")}. Bereken die ander ver binnehoek (${code("?")}), en kies die rede.`, askVal, "buite", otherCodes("buite", 3),
    buitehoekFigure(a, b, GREEN, { hide: hideOne }), {
    unit: "°", tip: pick(MIX_TIPS), hint: `Probeer: ${ext} − ${known} = ?`,
    solution: [{ s: `? = ${ext} − ${known} = ${askVal}`, r: REDES.buite.vol }],
    _chk: { figKind: "buitehoek", values: [a, b, ext], hideIndex: hideOne === "A" ? 0 : 1, allShown: false },
  });
}

/* ---- st32 "Groot Gemeng": drie GENTLE twee-stap variante (altyd geforseer,
   nie 'n muntgooi nie) — reguitlyn (180−a−b), gelykbenig (apex→basishoek,
   ÷2), buitehoek omgekeer (buite + een ver hoek → die ander ver hoek). Die
   ander drie stellings hergebruik hulle st30/31-generators (enkel-stap). ---- */
function calcReasonMixedReguitlynTwoStep() {
  const [a, b] = pair3(), c = 180 - a - b;
  return calcReason(`Bereken die hoek wat met ${code("?")} gemerk is, en kies die rede.`, c, "reguitlyn", otherCodes("reguitlyn", 3),
    straightLineFigure3(a, b, GREEN), {
    unit: "°", tip: pick(MIX_TIPS), hint: `Probeer: 180 − ${a} − ${b} = ?`,
    solution: [{ s: `? = 180 − ${a} − ${b} = ${c}`, r: REDES.reguitlyn.vol }],
    _chk: { figKind: "straightLine3", values: [a, b, c], hideIndex: 2, allShown: false },
  });
}
function calcReasonMixedGelykTwoStep() {
  const apex = apexEven(), baseAng = (180 - apex) / 2;
  return calcReason(`Bereken EEN basishoek (${code("?")}), en kies die rede.`, baseAng, "gelykbenig", otherCodes("gelykbenig", 3),
    triangleFigure("gelykbenig", GREEN, { apex, hide: "base" }), {
    unit: "°", tip: pick(MIX_TIPS), hint: `Probeer: (180 − ${apex}) ÷ 2 = ?`,
    solution: [{ s: `? = (180 − ${apex}) ÷ 2 = ${baseAng}`, r: REDES.gelykbenig.vol }],
    _chk: { figKind: "gelykbenig", values: [apex, baseAng, baseAng], apex, hideIndex: 1, allShown: false },
  });
}
function calcReasonMixedBuiteReverse() {
  const [a, b] = buitePair(); const ext = a + b;
  const hideOne = Math.random() < 0.5 ? "A" : "B";
  const known = hideOne === "A" ? b : a, askVal = hideOne === "A" ? a : b;
  return calcReason(`Die buitehoek is ${code(ext + "°")}. Bereken die ander ver binnehoek (${code("?")}), en kies die rede.`, askVal, "buite", otherCodes("buite", 3),
    buitehoekFigure(a, b, GREEN, { hide: hideOne }), {
    unit: "°", tip: pick(MIX_TIPS), hint: `Probeer: ${ext} − ${known} = ?`,
    solution: [{ s: `? = ${ext} − ${known} = ${askVal}`, r: REDES.buite.vol }],
    _chk: { figKind: "buitehoek", values: [a, b, ext], hideIndex: hideOne === "A" ? 0 : 1, allShown: false },
  });
}

/* forseer die ses-stellings-mengsel: 10 skille, elke stelling sy EIE
   inskrywing (regoorst×1, reguitlyn×2, ompunt×1, binne×2, gelykbenig×2,
   buite×2), dan geskommel — soos st20/st24 se patroon. */
const MIX_THEMES_10 = ["regoorst", "reguitlyn", "reguitlyn", "ompunt", "binne", "binne", "gelykbenig", "gelykbenig", "buite", "buite"];
const MIX_CALC = { regoorst: calcMixedRegoorst, reguitlyn: calcMixedReguitlyn, ompunt: calcMixedOmpunt, binne: calcMixedBinne, gelykbenig: calcMixedGelyk, buite: calcMixedBuite };
const MIX_REASON = { regoorst: reasonMixedRegoorst, reguitlyn: reasonMixedReguitlyn, ompunt: reasonMixedOmpunt, binne: reasonMixedBinne, gelykbenig: reasonMixedGelyk, buite: reasonMixedBuite };
const MIX_CALCREASON = { regoorst: calcReasonMixedRegoorst, reguitlyn: calcReasonMixedReguitlyn, ompunt: calcReasonMixedOmpunt, binne: calcReasonMixedBinne, gelykbenig: calcReasonMixedGelyk, buite: calcReasonMixedBuite };
const MIX_CALCREASON_32 = { regoorst: calcReasonMixedRegoorst, reguitlyn: calcReasonMixedReguitlynTwoStep, ompunt: calcReasonMixedOmpunt, binne: calcReasonMixedBinne, gelykbenig: calcReasonMixedGelykTwoStep, buite: calcReasonMixedBuiteReverse };
function mixSkills(map) {
  return shuffled(MIX_THEMES_10).map(t => ({ concept: t, gen: map[t] }));
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

  st13: {
    guide: ["binne"],
    lesson: {
      title: "Binnehoeke van 'n driehoek",
      figure: triAnglesFigure(70, 60, GREEN, { showAsk: true }),
      code: "binne",
      body: `<p>Die drie <b>binnehoeke</b> van ENIGE driehoek (skerp, stomp, klein of groot) tel altyd saam op tot <b>180°</b>.</p>
        <p>Hier is die drie hoeke 70°, 60° en 50° — saam: <code>70° + 60° + 50° = 180°</code>. As een hoek 'n regte hoek (90°) is, trek jy net 90 EN die ander hoek van 180° af.</p>`,
    },
    skills: [
      { concept: "binne", gen: introBinneTF1 }, { concept: "binne", gen: introBinneMC1 },
      { concept: "binne", gen: introBinneReason1 }, { concept: "binne", gen: introBinneTF2 },
      { concept: "binne", gen: introBinneMC2 }, { concept: "binne", gen: introBinneReason2 },
    ],
  },
  st14: { guide: ["binne"], skills: rep(10, "binne", binneR1) },
  st15: { guide: ["binne"], skills: rep(10, "binne", binneR2) },
  st16: { guide: ["binne"], skills: rep(10, "binne", binneR3) },

  st17: {
    guide: ["gelykbenig"],
    lesson: {
      title: "Gelykbenige driehoek",
      figure: triangleFigure("gelykbenig", GREEN, { apex: 70, showAsk: true }),
      code: "gelykbenig",
      body: `<p>'n <b>Gelykbenige driehoek</b> het twee sye ewe lank (die merkies op die sye wys dit). Die twee hoeke <b>teenoor</b> daardie gelyke sye — die <b>basishoeke</b> — is dan ook altyd <b>presies gelyk</b>.</p>
        <p>Hier is die tophoek 70° — die twee basishoeke is elk <code>(180 − 70) ÷ 2 = 55°</code>.</p>`,
    },
    skills: [
      { concept: "gelykbenig", gen: introGelykTF1 }, { concept: "gelykbenig", gen: introGelykMC1 },
      { concept: "gelykbenig", gen: introGelykReason1 }, { concept: "gelykbenig", gen: introGelykTF2 },
      { concept: "gelykbenig", gen: introGelykMC2 }, { concept: "gelykbenig", gen: introGelykReason2 },
    ],
  },
  st18: { guide: ["gelykbenig"], skills: rep(10, "gelykbenig", gelykR1div2) },
  st19: { guide: ["gelykbenig"], skills: rep(10, "gelykbenig", gelykR1noDiv) },
  st20: { guide: ["gelykbenig"], skills: shuffled([true, true, true, true, true, false, false, false, false, false])
    .map(k => ({ concept: "gelykbenig", gen: () => gelykDeelDeur2(k) })) },
  st21: { guide: ["gelykbenig"], skills: rep(10, "gelykbenig", gelykR2) },
  st22: { guide: ["gelykbenig"], skills: rep(10, "gelykbenig", gelykR3) },

  st23: {
    guide: ["buite", "binne"],
    lesson: {
      title: "Buitehoek van 'n driehoek",
      figure: buitehoekFigure(70, 50, GREEN, { showAsk: true }),
      code: "buite",
      body: `<p>Verleng een sy van 'n driehoek verby 'n hoekpunt — die hoek wat daar BUITE gevorm word, is die <b>buitehoek</b>. Dit is altyd gelyk aan die <b>som van die twee ver binnehoeke</b> (die twee wat NIE langsaan die buitehoek lê nie).</p>
        <p>Hier is die twee ver binnehoeke 70° en 50° — die buitehoek: <code>70° + 50° = 120°</code>.</p>`,
    },
    skills: [
      { concept: "buite", gen: introBuiteTF1 }, { concept: "buite", gen: introBuiteMC1 },
      { concept: "buite", gen: introBuiteReason1 }, { concept: "buite", gen: introBuiteTF2 },
      { concept: "buite", gen: introBuiteMC2 }, { concept: "buite", gen: introBuiteReason2 },
    ],
  },
  st24: { guide: ["buite", "binne"], skills: shuffled(["ext", "ext", "ext", "ext", "ext", "A", "B", "C", "A", "B"])
    .map(w => ({ concept: "buite", gen: () => binneOfBuite(w) })) },
  st25: { guide: ["buite"], skills: rep(10, "buite", buiteR1) },
  st26: { guide: ["buite", "binne"], skills: rep(10, "buite", buiteR2) },
  st27: { guide: ["buite"], skills: rep(10, "buite", buiteR3) },

  st28: { guide: REDE_CODES, skills: mixSkills(MIX_CALC) },
  st29: { guide: REDE_CODES, skills: mixSkills(MIX_REASON) },
  st30: { guide: REDE_CODES, skills: mixSkills(MIX_CALCREASON) },
  st31: { guide: REDE_CODES, skills: mixSkills(MIX_CALCREASON) },
  st32: { guide: REDE_CODES, skills: mixSkills(MIX_CALCREASON_32) },
};
