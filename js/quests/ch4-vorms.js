/* ============================================================
   HOOFSTUK 4 — 2D VORMS  (met diagramme)
   Driehoeke, vierhoeke, poligone, die sirkel (incl. 'n tik-rondte)
   en kongruent vs gelykvormig.
   ============================================================ */
import { mc, calc, tap, randInt, pick, shuffled, code } from "./_shared.js";
import { triangleFigure, quadFigure, polygonFigure, circleFigure, circleTapFigure, congruentFigure, quadPropsFigure, QUAD_PROPS } from "../engine/diagrams.js";

const ORANGE = "#ea580c";

/* ============ s1 · Driehoeke volgens sye ============ */
function genTriBySides() {
  const kind = pick(["gelyksydig", "gelykbenig", "ongelyksydig"]);
  return mc("Watter soort driehoek is dit (volgens sye)?",
    shuffled([
      { label: "gelyksydig", correct: kind === "gelyksydig" },
      { label: "gelykbenig", correct: kind === "gelykbenig" },
      { label: "ongelyksydig", correct: kind === "ongelyksydig" },
    ]), {
    figure: triangleFigure(kind, ORANGE),
    hint: "Die merkies wys gelyke sye: 3 gelyk = gelyksydig · 2 gelyk = gelykbenig · geen gelyk = ongelyksydig.",
    answerLabel: kind,
  });
}

/* ============ s2 · Driehoeke volgens hoeke ============ */
function genTriByAngles() {
  const kind = pick(["skerphoekig", "reghoekig", "stomphoekig"]);
  return mc("Watter soort driehoek is dit (volgens hoeke)?",
    shuffled([
      { label: "skerphoekig", correct: kind === "skerphoekig" },
      { label: "reghoekig", correct: kind === "reghoekig" },
      { label: "stomphoekig", correct: kind === "stomphoekig" },
    ]), {
    figure: triangleFigure(kind, ORANGE),
    hint: "Regtehoek-blokkie (90°) → reghoekig · een hoek groter as 90° → stomphoekig · al die hoeke skerp → skerphoekig.",
    answerLabel: kind,
  });
}

/* ============ s3 · Binnehoeke van 'n driehoek (som = 180°) ============ */
function genAngleSum() {
  if (Math.random() < 0.55) {
    const a = randInt(30, 80), b = randInt(30, 80);
    return calc(`Twee hoeke van 'n driehoek is ${code(a + "°")} en ${code(b + "°")}. Wat is die derde hoek?`, 180 - a - b, {
      unit: "°", figure: triangleFigure("ongelyksydig", ORANGE),
      hint: "Die drie hoeke maak saam 180°.",
      solution: [{ s: `180 − ${a} − ${b} = ${180 - a - b}`, r: "" }],
    });
  }
  const top = randInt(10, 50) * 2;
  return calc(`'n Gelykbenige driehoek het 'n tophoek van ${code(top + "°")}. Hoe groot is elke basishoek?`, (180 - top) / 2, {
    unit: "°", figure: triangleFigure("gelykbenig", ORANGE),
    hint: "Die twee basishoeke is gelyk. (180 − tophoek) ÷ 2.",
    tip: `Op jou sakrekenaar: druk eers <b>=</b> ná ${code("180 − " + top)} <b>voordat</b> jy deur 2 deel — anders deel die sakrekenaar net die ${top} deur 2!`,
    solution: [{ s: `180 − ${top} = ${180 - top}`, r: "" }, { s: `${180 - top} ÷ 2 = ${(180 - top) / 2}`, r: "twee gelyke hoeke" }],
  });
}

/* ============ s4 · Vierhoeke ============ */
const QUADS = [
  { key: "vierkant", name: "vierkant" }, { key: "reghoek", name: "reghoek" },
  { key: "ruit", name: "ruit" }, { key: "parallelogram", name: "parallelogram" },
  { key: "trapesium", name: "trapesium" }, { key: "vlieer", name: "vlieër" },
];
function genQuad() {
  const q = pick(QUADS);
  const distract = shuffled(QUADS.filter(x => x.key !== q.key)).slice(0, 3);
  return mc("Watter vierhoek is dit?",
    shuffled([{ label: q.name, correct: true }, ...distract.map(d => ({ label: d.name, correct: false }))]), {
    figure: quadFigure(q.key, ORANGE),
    hint: "Kyk na gelyke sye (merkies), regte hoeke (blokkies) en watter sye ewewydig is (›-merkies).",
    answerLabel: q.name,
  });
}

/* ============ s5 · Poligone ============ */
const POLY = [
  { sides: 3, name: "driehoek" }, { sides: 4, name: "vierhoek" }, { sides: 5, name: "pentagoon" },
  { sides: 6, name: "heksagoon" }, { sides: 7, name: "heptagoon" }, { sides: 8, name: "oktagoon" },
  { sides: 9, name: "nonagoon" }, { sides: 10, name: "dekagoon" },
];
function genPoly() {
  const p = pick(POLY);
  if (Math.random() < 0.5)
    return calc("Hoeveel sye het hierdie vorm?", p.sides, {
      figure: polygonFigure(p.sides, ORANGE),
      hint: "Tel die sye (die reguit lyne) van die vorm.",
      answerLabel: `${p.sides}`,
    });
  const distract = shuffled(POLY.filter(x => x.sides !== p.sides)).slice(0, 3);
  return mc("Wat noem ons hierdie vorm?",
    shuffled([{ label: p.name, correct: true }, ...distract.map(d => ({ label: d.name, correct: false }))]), {
    figure: polygonFigure(p.sides, ORANGE),
    hint: "Tel die sye: 5 = pentagoon, 6 = heksagoon, 7 = heptagoon, 8 = oktagoon, 9 = nonagoon, 10 = dekagoon.",
    answerLabel: p.name,
  });
}

/* ============ s6 · Dele van 'n sirkel (benoem) ============ */
const CIRCLE_PARTS = [
  { key: "radius", name: "radius (straal)" }, { key: "middellyn", name: "middellyn (deursnee)" },
  { key: "koord", name: "koord" }, { key: "sektor", name: "sektor" },
  { key: "omtrek", name: "omtrek" }, { key: "boog", name: "boog" },
];
function genCirclePart() {
  const it = pick(CIRCLE_PARTS);
  const distract = shuffled(CIRCLE_PARTS.filter(p => p.key !== it.key)).slice(0, 3);
  return mc("Wat noem ons die <b>gemerkte</b> deel van die sirkel?",
    shuffled([{ label: it.name, correct: true }, ...distract.map(d => ({ label: d.name, correct: false }))]), {
    figure: circleFigure(it.key, ORANGE),
    hint: "Radius: middel→rand. Middellyn: oor die sirkel deur die middel. Koord: twee randpunte (nie deur die middel). Sektor: 'n “pizza-snytjie”. Boog: 'n stuk van die rand.",
    answerLabel: it.name,
  });
}

/* ============ s7 · Tik die sirkeldeel ============ */
const TAP_PARTS = [
  { key: "koord", q: "Tik die <b>koord</b> op die sirkel." },
  { key: "middelpunt", q: "Tik die <b>middelpunt</b> van die sirkel." },
  { key: "radius", q: "Tik die <b>radius</b> van die sirkel." },
  { key: "boog", q: "Tik die <b>boog</b> op die sirkel." },
];
function genCircleTap() {
  const t = pick(TAP_PARTS);
  return tap(t.q, t.key, circleTapFigure(t.key, ORANGE), {
    hint: "Middelpunt = die kol in die middel · radius = lyn van die middel na die rand · koord = lyn tussen twee randpunte · boog = 'n stuk van die rand self.",
    answerLabel: { koord: "die koord", middelpunt: "die middelpunt", radius: "die radius", boog: "die boog" }[t.key],
  });
}

/* ============ s8 · Radius & middellyn ============ */
function genDiameter() {
  const r = randInt(2, 15);
  if (Math.random() < 0.5)
    return calc(`'n Sirkel het 'n radius van ${code(r + " cm")}. Wat is die middellyn?`, 2 * r, {
      unit: "cm", figure: circleFigure("radius", ORANGE),
      hint: "Middellyn = 2 × radius.", solution: [{ s: `2 × ${r} = ${2 * r}`, r: "" }],
    });
  return calc(`'n Sirkel het 'n middellyn van ${code(2 * r + " cm")}. Wat is die radius?`, r, {
    unit: "cm", figure: circleFigure("middellyn", ORANGE),
    hint: "Radius = middellyn ÷ 2.", solution: [{ s: `${2 * r} ÷ 2 = ${r}`, r: "" }],
  });
}

/* ============ s9/s10 · Kongruent of gelykvormig? (kies een van twee) ============ */
function genCongruent() {
  const congruent = Math.random() < 0.5;
  return mc("Is hierdie twee vorms <b>kongruent</b> of <b>gelykvormig</b>?",
    shuffled([
      { label: "kongruent", correct: congruent },
      { label: "gelykvormig", correct: !congruent },
    ]), {
    figure: congruentFigure(congruent, ORANGE),
    hint: "Kongruent = presies dieselfde vorm ÉN dieselfde grootte. Gelykvormig = dieselfde vorm, maar 'n ander grootte.",
    answerLabel: congruent ? "kongruent" : "gelykvormig",
  });
}

/* ============ s11 · Teenoorstaande & aangrensende sye ============
   'n Vierhoek ABCD: elke sy/hoekpunt het een teenoorstaande party (die
   een heel anderkant) en twee aangrensende (wat 'n hoekpunt deel). Die
   drie vraag-vorms hieronder is elk sy EIE skill-inskrywing (nie 'n
   muntgooi binne een gen() nie — CLAUDE.md se gemengde-rondte-gotcha)
   sodat 'n 10-vraag rondte altyd al drie soorte kry. */
const SIDE_KEYS = ["AB", "BC", "CD", "DA"];
const CORNER_KEYS = ["A", "B", "C", "D"];
const OPP_SIDE = { AB: "CD", BC: "DA", CD: "AB", DA: "BC" };
const ADJ_SIDES = { AB: ["BC", "DA"], BC: ["AB", "CD"], CD: ["BC", "DA"], DA: ["AB", "CD"] };
const OPP_CORNER = { A: "C", B: "D", C: "A", D: "B" };

function genOppositeSide() {
  const q = pick(QUADS), side = pick(SIDE_KEYS), target = OPP_SIDE[side];
  return tap(`Die BLOU sy is <b>${side}</b>. Tap die sy <b>TEENOORSTAANDE</b> ${side}.`, target,
    quadPropsFigure(q.key, ORANGE, { highlightSide: side, decor: "none" }), {
    tip: "Teenoorstaande = oorkant, raak nie.",
    hint: `${side} en ${target} lê oorkant mekaar in die vierhoek — hulle raak mekaar nêrens.`,
    answerLabel: target,
  });
}
function genAdjacentSide() {
  const q = pick(QUADS), side = pick(SIDE_KEYS), targets = ADJ_SIDES[side];
  return tap(`Die BLOU sy is <b>${side}</b>. Tap 'n sy wat <b>AANGRENSEND</b> aan ${side} is.`, targets,
    quadPropsFigure(q.key, ORANGE, { highlightSide: side, decor: "none" }), {
    tip: "Aangrensend = langsaan, deel 'n hoekpunt.",
    hint: `${targets.join(" en ")} deel elk 'n hoekpunt met ${side} — albei tel.`,
    answerLabel: targets.join(" of "),
  });
}
function genOppositeCorner() {
  const q = pick(QUADS), corner = pick(CORNER_KEYS), target = OPP_CORNER[corner];
  return tap(`Die BLOU hoek is <b>${corner}</b>. Tap die hoek <b>TEENOORSTAANDE</b> hoek ${corner}.`, target,
    quadPropsFigure(q.key, ORANGE, { highlightCorner: corner, decor: "none" }), {
    tip: "Teenoorstaande = oorkant, raak nie.",
    hint: `${corner} en ${target} is die twee hoekpunte heel anderkant mekaar.`,
    answerLabel: target,
  });
}

/* ============ s12 · Wat beteken die simbole? ============
   3 simbole (pyltjie=parallel, streep=ewe lank, blokkie=90°) — mc vra
   die BETEKENIS, die tap-vrae werk ANDERSOM ('n gegewe groen sy, tap sy
   party). Elke keuse-lys is beperk tot vierhoeke wat DIE eienskap
   werklik het (bv. 'n vlieër het geen parallelle sye nie — nooit vra
   nie; 'n trapesium se bene kry nooit pyltjies nie). */
const PARALLEL_KINDS = QUADS.filter(q => QUAD_PROPS[q.key].parallelPairs.length > 0);
const EQUAL_KINDS = QUADS.filter(q => QUAD_PROPS[q.key].equalGroups.length > 0);
const RIGHT_KINDS = QUADS.filter(q => QUAD_PROPS[q.key].rightCorners.length > 0);
const SYMBOL_OPTS = (correctLabel) => shuffled([
  { label: "Die sye is parallel (ewewydig)", correct: correctLabel === "par" },
  { label: "Die sye is ewe lank", correct: correctLabel === "tick" },
  { label: "Die hoek is 'n regte hoek (90°)", correct: correctLabel === "right" },
]);

function genSymbolPar() {
  const q = pick(PARALLEL_KINDS);
  const pairs = QUAD_PROPS[q.key].parallelPairs;
  const pi = randInt(0, pairs.length - 1);
  return mc("Wat beteken die <b>›</b>-pyltjie(s) op die sye?", SYMBOL_OPTS("par"), {
    figure: quadPropsFigure(q.key, ORANGE, { tapSides: false, tapCorners: false, decor: { type: "par", pair: pi } }),
    hint: "Pyltjies (›) op sye beteken hulle is parallel — hulle loop langs mekaar en sny nooit.",
    answerLabel: "Die sye is parallel (ewewydig)",
  });
}
function genSymbolTick() {
  const q = pick(EQUAL_KINDS);
  const groups = QUAD_PROPS[q.key].equalGroups;
  const gi = randInt(0, groups.length - 1);
  return mc("Wat beteken die <b>streep-merkies</b> op die sye?", SYMBOL_OPTS("tick"), {
    figure: quadPropsFigure(q.key, ORANGE, { tapSides: false, tapCorners: false, decor: { type: "tick", group: gi } }),
    hint: "Streep-merkies (dieselfde aantal strepies) op sye beteken hulle is ewe lank.",
    answerLabel: "Die sye is ewe lank",
  });
}
function genSymbolRight() {
  const q = pick(RIGHT_KINDS);
  const corners = QUAD_PROPS[q.key].rightCorners;
  const c = pick(corners);
  return mc("Wat beteken die <b>blokkie</b>-merkie by die hoek?", SYMBOL_OPTS("right"), {
    figure: quadPropsFigure(q.key, ORANGE, { tapSides: false, tapCorners: false, decor: { type: "right", corner: c } }),
    hint: "'n Klein blokkie by 'n hoekpunt beteken dit is presies 90° — 'n regte hoek.",
    answerLabel: "Die hoek is 'n regte hoek (90°)",
  });
}
function genTapParallel() {
  const q = pick(PARALLEL_KINDS);
  const pair = pick(QUAD_PROPS[q.key].parallelPairs);
  const green = pick(pair), target = pair.find(s => s !== green);
  return tap(`Die GROEN sy is <b>${green}</b>. Tap 'n sy wat <b>parallel</b> aan die groen sy is.`, target,
    quadPropsFigure(q.key, ORANGE, { highlightSide: green, highlightColor: "#16a34a", decor: "none" }), {
    tip: "Parallel = loop langs mekaar, sny nooit.",
    hint: `${target} is die enigste ander sy wat nooit ${green} sal raak nie — parallel.`,
    answerLabel: target,
  });
}
function genTapEqual() {
  const q = pick(EQUAL_KINDS);
  const group = pick(QUAD_PROPS[q.key].equalGroups);
  const green = pick(group), targets = group.filter(s => s !== green);
  return tap(`Die GROEN sy is <b>${green}</b>. Tap 'n sy wat <b>ewe lank</b> is as die groen sy.`, targets,
    quadPropsFigure(q.key, ORANGE, { highlightSide: green, highlightColor: "#16a34a", decor: "none" }), {
    tip: "Ewe lank = presies dieselfde lengte.",
    hint: `${targets.join(" en ")} is ewe lank as ${green}.`,
    answerLabel: targets.join(" of "),
  });
}

export const CH4 = {
  s1: { skills: Array.from({ length: 5 }, () => ({ concept: "driehoeke", gen: genTriBySides })) },
  s2: { skills: Array.from({ length: 5 }, () => ({ concept: "driehoeke", gen: genTriByAngles })) },
  s3: { skills: Array.from({ length: 5 }, () => ({ concept: "hoeksom", gen: genAngleSum })) },
  s4: { skills: Array.from({ length: 5 }, () => ({ concept: "vierhoeke", gen: genQuad })) },
  s5: { skills: Array.from({ length: 5 }, () => ({ concept: "poligone", gen: genPoly })) },
  s6: { skills: Array.from({ length: 5 }, () => ({ concept: "sirkeldele", gen: genCirclePart })) },
  s7: { skills: Array.from({ length: 5 }, () => ({ concept: "sirkeldele", gen: genCircleTap })) },
  s8: { skills: Array.from({ length: 5 }, () => ({ concept: "sirkeldele", gen: genDiameter })) },
  s9: { skills: Array.from({ length: 5 }, () => ({ concept: "kongruent", gen: genCongruent })) },
  s10: { skills: Array.from({ length: 5 }, () => ({ concept: "kongruent", gen: genCongruent })) },
  s11: { skills: shuffled([
    genOppositeSide, genOppositeSide, genOppositeSide, genOppositeSide,
    genAdjacentSide, genAdjacentSide, genAdjacentSide,
    genOppositeCorner, genOppositeCorner, genOppositeCorner,
  ]).map(gen => ({ concept: "vierhoeksye", gen })) },
  s12: { skills: shuffled([
    genSymbolPar, genSymbolPar, genSymbolTick, genSymbolRight,
    genTapParallel, genTapParallel, genTapEqual, genTapEqual,
    genSymbolTick, genSymbolRight,
  ]).map(gen => ({ concept: "vierhoeksimbole", gen })) },
};
