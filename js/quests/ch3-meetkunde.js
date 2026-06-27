/* ============================================================
   HOOFSTUK 3 — REGUITLYN MEETKUNDE
   Sterkpunt: m1 "Lees die gradeboog" (akkurate protractor).
   ============================================================ */
import { mc, mcFrom, tf, calc, protractor, randInt, pick, shuffled, distinct, code } from "./_shared.js";
import { circleFigure } from "../engine/diagrams.js";

const TEAL = "#0d9488";

/* ============ m1 · Lees die gradeboog ============ */
function genRead() {
  // veelvoude van 5, weg van die uiterstes; sluit soms presies 90 in
  let ang = randInt(3, 33) * 5;            // 15 … 165
  if (Math.random() < 0.12) ang = 90;
  const type = ang < 90 ? "skerphoek" : ang === 90 ? "regtehoek" : "stomphoek";
  return protractor(`Hoe groot is hoek <b>AÔB</b>? Lees dit van die gradeboog af.`, ang, {
    tol: 2,
    answerLabel: `${ang}° (${type})`,
    hint: "Arm A lê op die 0-lyn (regs), so lees die BINNESTE ry getalle waar arm B kruis. Begin by 0 langs arm A en tel op. Tussen twee getalle? Elke klein merkie is 1°.",
  });
}

/* ============ m2 · Soorte hoeke ============ */
const TYPES = [
  { name: "skerphoek", lo: 1, hi: 89, range: "tussen 0° en 90°" },
  { name: "regtehoek", exact: 90, range: "presies 90°" },
  { name: "stomphoek", lo: 91, hi: 179, range: "tussen 90° en 180°" },
  { name: "gestrekte hoek", exact: 180, range: "presies 180°" },
  { name: "inspringende hoek", lo: 181, hi: 359, range: "tussen 180° en 360°" },
];
function genTypeFromDeg() {
  const t = pick(TYPES.filter(x => x.name !== "inspringende hoek" || Math.random() < 0.3));
  const deg = t.exact != null ? t.exact : randInt(t.lo, t.hi);
  const opts = shuffled(TYPES).slice(0, 4);
  if (!opts.find(o => o.name === t.name)) opts[0] = t;
  return mc(`'n Hoek meet ${code(deg + "°")}. Watter tipe hoek is dit?`,
    opts.map(o => ({ label: o.name, correct: o.name === t.name })), {
    hint: "Onthou: < 90° skerp · 90° reg · 90°–180° stomp · 180° gestrek · > 180° inspringend.",
    answerLabel: t.name,
  });
}
function genRangeFromType() {
  const t = pick(TYPES.slice(0, 4));
  const opts = shuffled(TYPES.slice(0, 5)).slice(0, 4);
  if (!opts.find(o => o.name === t.name)) opts[0] = t;
  return mc(`Tussen watter groottes lê 'n ${code(t.name)}?`,
    opts.map(o => ({ label: o.range, correct: o.name === t.name })), {
    hint: "Dink aan 'n regtehoek (90°) en 'n gestrekte hoek (180°) as die grenslyne.",
    answerLabel: t.range,
  });
}

/* ============ m3 · Lyne & notasie ============ */
function genLines() {
  const items = [
    { q: `Twee lyne met pyltjies op loop langs mekaar en sny nooit. Hulle is...?`, a: "ewewydig (parallel)", d: ["loodreg", "snylyne", "strale"] },
    { q: `Twee lyne sny mekaar teen 'n 90°-hoek. Hulle is...?`, a: "loodreg", d: ["ewewydig", "parallel", "gestrek"] },
    { q: `'n Lyn met twee pyltjies en geen eindpunte is 'n...?`, a: "lyn", d: ["lynsegment", "straal", "punt"] },
    { q: `Begin by een punt, geen eindpunt, een pyltjie. Dit is 'n...?`, a: "straal", d: ["lyn", "lynsegment", "snylyn"] },
    { q: `Strepies op twee lyne beteken die lyne is...?`, a: "ewe lank", d: ["ewewydig", "loodreg", "geboë"] },
  ];
  const it = pick(items);
  return mc(it.q, [{ label: it.a, correct: true }, ...it.d.map(x => ({ label: x, correct: false }))], {
    hint: "Pyltjies → parallel. Vierkantjie → loodreg (90°). Strepies → ewe lank.",
    answerLabel: it.a,
  });
}
function genNotasie() {
  const par = Math.random() < 0.5;
  const correct = par ? "AB // CD" : "AB ⟂ CD";
  const opts = [
    { label: "AB // CD", correct: par },
    { label: "AB ⟂ CD", correct: !par },
    { label: "AB = CD", correct: false },
    { label: "AB ≡ CD", correct: false },
  ];
  return mc(`Hoe dui jy aan dat AB ${par ? "ewewydig (parallel)" : "loodreg"} op CD is?`, shuffled(opts), {
    hint: "// beteken parallel. ⟂ beteken loodreg (90°).",
    answerLabel: correct,
  });
}

/* ============ m4 · Hoekverwantskappe ============ */
function genComp() {
  const a = randInt(10, 80);
  return calc(`Skryf die komplement van ${code(a + "°")}.`, 90 - a, {
    unit: "°",
    hint: "Komplementêre hoeke maak saam 90°. Trek af van 90°.",
    solution: [{ s: `90 − ${a} = ${90 - a}`, r: "" }],
  });
}
function genSupp() {
  const a = randInt(20, 160);
  return calc(`Skryf die supplement van ${code(a + "°")}.`, 180 - a, {
    unit: "°",
    hint: "Supplementêre hoeke maak saam 180°. Trek af van 180°.",
    solution: [{ s: `180 − ${a} = ${180 - a}`, r: "" }],
  });
}
function genStraight() {
  const x = randInt(30, 150);
  return calc(`Twee hoeke op 'n reguitlyn is ${code("x")} en ${code((180 - x) + "°")}. Wat is ${code("x")}?`, x, {
    unit: "°",
    hint: "Hoeke op 'n reguitlyn tel saam tot 180°.",
    solution: [{ s: `x = 180 − ${180 - x} = ${x}`, r: "reguitlyn = 180°" }],
  });
}
function genReflex() {
  const inner = randInt(40, 160);
  return calc(`Die binnehoek is ${code(inner + "°")}. Wat is die inspringende (refleks) hoek?`, 360 - inner, {
    unit: "°",
    hint: "Inspringende hoek = 360° − die binnehoek.",
    solution: [{ s: `360 − ${inner} = ${360 - inner}`, r: "" }],
  });
}

/* ============ m5 · Dele van 'n sirkel ============ */
const CIRCLE_PARTS = [
  { key: "radius", name: "radius (straal)" },
  { key: "middellyn", name: "middellyn (deursnee)" },
  { key: "koord", name: "koord" },
  { key: "sektor", name: "sektor" },
  { key: "omtrek", name: "omtrek" },
  { key: "boog", name: "boog" },
];
function genCirclePart() {
  const it = pick(CIRCLE_PARTS);
  const distract = shuffled(CIRCLE_PARTS.filter(p => p.key !== it.key)).slice(0, 3);
  const opts = [{ label: it.name, correct: true }, ...distract.map(d => ({ label: d.name, correct: false }))];
  return mc("Wat noem ons die <b>gemerkte</b> deel van die sirkel?", opts, {
    figure: circleFigure(it.key, TEAL),
    hint: "Radius: middel→rand. Middellyn: oor die sirkel, deur die middel. Koord: twee randpunte (nie deur die middel). Sektor: 'n “pizza-snytjie”. Boog: 'n stuk van die rand.",
    answerLabel: it.name,
  });
}
function genDiameter() {
  const r = randInt(2, 15);
  if (Math.random() < 0.5)
    return calc(`'n Sirkel het 'n radius van ${code(r + " cm")}. Wat is die middellyn?`, 2 * r, {
      unit: "cm", figure: circleFigure("radius", TEAL),
      hint: "Middellyn = 2 × radius.", solution: [{ s: `2 × ${r} = ${2 * r}`, r: "" }],
    });
  return calc(`'n Sirkel het 'n middellyn van ${code(2 * r + " cm")}. Wat is die radius?`, r, {
    unit: "cm", figure: circleFigure("middellyn", TEAL),
    hint: "Radius = middellyn ÷ 2.", solution: [{ s: `${2 * r} ÷ 2 = ${r}`, r: "" }],
  });
}

export const CH3 = {
  m1: { skills: Array.from({ length: 6 }, () => ({ concept: "gradeboog", gen: genRead })) },
  m2: { skills: [
    { concept: "hoektipes", gen: genTypeFromDeg }, { concept: "hoektipes", gen: genRangeFromType },
    { concept: "hoektipes", gen: genTypeFromDeg }, { concept: "hoektipes", gen: genRangeFromType },
    { concept: "hoektipes", gen: genTypeFromDeg },
  ] },
  m3: { skills: [
    { concept: "lyne", gen: genLines }, { concept: "lyne", gen: genNotasie },
    { concept: "lyne", gen: genLines }, { concept: "lyne", gen: genNotasie },
    { concept: "lyne", gen: genLines },
  ] },
  m4: { skills: [
    { concept: "hoekverwant", gen: genComp }, { concept: "hoekverwant", gen: genSupp },
    { concept: "hoekverwant", gen: genStraight }, { concept: "hoekverwant", gen: genReflex },
    { concept: "hoekverwant", gen: genComp }, { concept: "hoekverwant", gen: genSupp },
  ] },
  m5: { skills: [
    { concept: "sirkeldele", gen: genCirclePart }, { concept: "sirkeldele", gen: genDiameter },
    { concept: "sirkeldele", gen: genCirclePart }, { concept: "sirkeldele", gen: genDiameter },
    { concept: "sirkeldele", gen: genCirclePart },
  ] },
};
