/* ============================================================
   HOOFSTUK 4 — 2D VORMS  (met diagramme)
   Driehoeke, vierhoeke, poligone, die sirkel (incl. 'n tik-rondte)
   en kongruent vs gelykvormig.
   ============================================================ */
import { mc, calc, tap, randInt, pick, shuffled, code } from "./_shared.js";
import { triangleFigure, quadFigure, polygonFigure, circleFigure, circleTapFigure, congruentFigure } from "../engine/diagrams.js";

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
  { sides: 3, name: "driehoek" }, { sides: 4, name: "vierhoek" }, { sides: 5, name: "vyfhoek" },
  { sides: 6, name: "seshoek" }, { sides: 7, name: "sewehoek" }, { sides: 8, name: "agthoek" },
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
    hint: "Tel die sye: 5 = vyfhoek, 6 = seshoek, 7 = sewehoek, 8 = agthoek.",
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
};
