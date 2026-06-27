/* ============================================================
   HOOFSTUK 4 — 2D VORMS
   ============================================================ */
import { mc, tf, calc, randInt, pick, shuffled, code } from "./_shared.js";

/* ============ s1 · Klassifiseer driehoeke ============ */
function genBySides() {
  const kind = pick(["gelyksydig", "gelykbenig", "ongelyksydig"]);
  let sides;
  if (kind === "gelyksydig") { const a = randInt(3, 9); sides = [a, a, a]; }
  else if (kind === "gelykbenig") { const a = randInt(4, 9), b = randInt(2, a - 1); sides = shuffled([a, a, b]); }
  else { const a = randInt(3, 9); sides = [a, a + 1, a + 2]; }
  return mc(`'n Driehoek het sye ${code(sides.join(" cm, ") + " cm")}. Watter tipe is dit (volgens sye)?`,
    shuffled([
      { label: "gelyksydig", correct: kind === "gelyksydig" },
      { label: "gelykbenig", correct: kind === "gelykbenig" },
      { label: "ongelyksydig", correct: kind === "ongelyksydig" },
    ]), { hint: "3 gelyk = gelyksydig · 2 gelyk = gelykbenig · geen gelyk = ongelyksydig.", answerLabel: kind });
}
function genByAngles() {
  const kind = pick(["skerphoekig", "reghoekig", "stomphoekig"]);
  let ang;
  if (kind === "reghoekig") ang = 90;
  else if (kind === "stomphoekig") ang = randInt(95, 140);
  else ang = randInt(40, 80);
  return mc(`'n Driehoek het 'n hoek van ${code(ang + "°")}. Watter tipe is dit (volgens hoeke)?`,
    shuffled([
      { label: "skerphoekig", correct: kind === "skerphoekig" },
      { label: "reghoekig", correct: kind === "reghoekig" },
      { label: "stomphoekig", correct: kind === "stomphoekig" },
    ]), { hint: "Een hoek = 90° → reghoekig · een > 90° → stomphoekig · almal < 90° → skerphoekig.", answerLabel: kind });
}

/* ============ s2 · Driehoek-hoeksom ============ */
function genAngleSum() {
  if (Math.random() < 0.6) {
    const a = randInt(30, 80), b = randInt(30, 80);
    return calc(`Twee hoeke van 'n driehoek is ${code(a + "°")} en ${code(b + "°")}. Wat is die derde hoek?`, 180 - a - b, {
      unit: "°", hint: "Die drie hoeke maak saam 180°.",
      solution: [{ s: `180 − ${a} − ${b} = ${180 - a - b}`, r: "" }] });
  }
  // gelykbenig: top-hoek gegee, vind 'n basishoek (ewe tophoek → heelgetal basishoek)
  const top = randInt(10, 50) * 2;
  return calc(`'n Gelykbenige driehoek het 'n tophoek van ${code(top + "°")}. Hoe groot is elke basishoek?`, (180 - top) / 2, {
    unit: "°", hint: "Die twee basishoeke is gelyk. (180 − tophoek) ÷ 2.",
    solution: [{ s: `180 − ${top} = ${180 - top}`, r: "" }, { s: `${180 - top} ÷ 2 = ${(180 - top) / 2}`, r: "twee gelyke hoeke" }] });
}

/* ============ s3 · Poligone ============ */
const POLY = [
  { sides: 3, name: "driehoek" }, { sides: 4, name: "vierhoek" }, { sides: 5, name: "vyfhoek (pentagoon)" },
  { sides: 6, name: "seshoek (heksagoon)" }, { sides: 7, name: "sewehoek (heptagoon)" },
  { sides: 8, name: "agthoek (oktagoon)" }, { sides: 10, name: "tienhoek (dekagoon)" },
];
function genPolyName() {
  const p = pick(POLY);
  if (Math.random() < 0.5)
    return calc(`Hoeveel sye het 'n ${code(p.name.split(" ")[0])}?`, p.sides, {
      hint: "Tel die sye volgens die naam (vyf = 5, ses = 6, ...).", answerLabel: `${p.sides}` });
  const opts = shuffled(POLY).slice(0, 4);
  if (!opts.find(o => o.sides === p.sides)) opts[0] = p;
  return mc(`Wat noem ons 'n ${code(p.sides + "-sydige")} vorm?`,
    opts.map(o => ({ label: o.name, correct: o.sides === p.sides })), { answerLabel: p.name });
}
function genIsPoly() {
  const items = [
    { q: "Is 'n sirkel 'n poligoon?", yes: false, why: "Nee — 'n poligoon het reguit sye, nie geboë nie." },
    { q: "Is 'n vyfhoek 'n poligoon?", yes: true, why: "Ja — geslote vorm met reguit sye." },
    { q: "Het 'n poligoon geboë sye?", yes: false, why: "Nee — poligone het net reguit sye." },
    { q: "Is 'n driehoek 'n poligoon?", yes: true, why: "Ja — 3 reguit sye." },
  ];
  const it = pick(items);
  return tf(it.q, it.yes, { labels: ["Ja", "Nee"], hint: "Poligoon = geslote vorm, reguit sye, 3+ hoeke.", answerLabel: it.why });
}

/* ============ s4 · Vierhoeke ============ */
function genQuad() {
  const items = [
    { q: "Al 4 sye gelyk, maar die hoeke is nie 90° nie. Watter vierhoek?", a: "ruit", d: ["vierkant", "reghoek", "trapesium"] },
    { q: "Al die hoeke 90° en al 4 sye gelyk. Watter vierhoek?", a: "vierkant", d: ["reghoek", "ruit", "parallelogram"] },
    { q: "Net 1 paar teenoorstaande sye is parallel. Watter vierhoek?", a: "trapesium", d: ["parallelogram", "ruit", "vlieër"] },
    { q: "Teenoorstaande sye parallel en gelyk, hoeke nie 90° nie. Watter vierhoek?", a: "parallelogram", d: ["reghoek", "trapesium", "vierkant"] },
  ];
  const it = pick(items);
  return mc(it.q, shuffled([{ label: it.a, correct: true }, ...it.d.map(x => ({ label: x, correct: false }))]),
    { hint: "Dink aan die sye, hoeke en hoeklyne van elke vierhoek.", answerLabel: it.a });
}
function genQuadTF() {
  const items = [
    { s: "Alle vierkante is ook reghoeke.", yes: true },
    { s: "Alle vierkante is ook ruite.", yes: true },
    { s: "Alle reghoeke is ook parallelogramme.", yes: true },
    { s: "Alle reghoeke is vierkante.", yes: false },
    { s: "Alle parallelogramme is vierkante.", yes: false },
  ];
  const it = pick(items);
  return tf(it.s, it.yes, { hint: "'n Vierkant is 'n spesiale reghoek én ruit — maar nie andersom nie.",
    answerLabel: it.yes ? "Waar" : "Onwaar" });
}

/* ============ s5 · Kongruent of gelykvormig ============ */
function genCong() {
  const r = Math.random();
  if (r < 0.34)
    return mc(`Twee vorms het dieselfde vorm maar verskillende grootte. Is hulle kongruent of gelykvormig?`,
      shuffled([{ label: "gelykvormig", correct: true }, { label: "kongruent", correct: false }]),
      { hint: "Kongruent = presies dieselfde. Gelykvormig = selfde vorm, ander grootte.", answerLabel: "gelykvormig" });
  if (r < 0.67) {
    const sym = Math.random() < 0.5;
    return mc(`Wat is die simbool vir ${sym ? "kongruent" : "gelykvormig"}?`,
      shuffled([{ label: "≡", correct: sym }, { label: "|||", correct: !sym }, { label: "//", correct: false }, { label: "⟂", correct: false }]),
      { hint: "≡ is kongruent · ||| is gelykvormig.", answerLabel: sym ? "≡" : "|||" });
  }
  const conds = [
    { q: "Twee sye en die hoek tussen hulle is gelyk. Watter voorwaarde?", a: "SHS" },
    { q: "Al drie sye gelyk. Watter voorwaarde?", a: "SSS" },
    { q: "Twee hoeke en 'n nie-ingeslote sy gelyk. Watter voorwaarde?", a: "HHS" },
    { q: "Reghoekige driehoek: skuinssy en een sy gelyk. Watter voorwaarde?", a: "RSS" },
  ];
  const it = pick(conds);
  return mc(it.q, shuffled(["SSS", "SHS", "HHS", "RSS"].map(x => ({ label: x, correct: x === it.a }))),
    { hint: "S = sy, H = hoek, R = regtehoek.", answerLabel: it.a });
}

export const CH4 = {
  s1: { skills: [
    { concept: "driehoeke", gen: genBySides }, { concept: "driehoeke", gen: genByAngles },
    { concept: "driehoeke", gen: genBySides }, { concept: "driehoeke", gen: genByAngles },
    { concept: "driehoeke", gen: genBySides },
  ] },
  s2: { skills: Array.from({ length: 5 }, () => ({ concept: "hoeksom", gen: genAngleSum })) },
  s3: { skills: [
    { concept: "poligone", gen: genPolyName }, { concept: "poligone", gen: genIsPoly },
    { concept: "poligone", gen: genPolyName }, { concept: "poligone", gen: genIsPoly },
    { concept: "poligone", gen: genPolyName },
  ] },
  s4: { skills: [
    { concept: "vierhoeke", gen: genQuad }, { concept: "vierhoeke", gen: genQuadTF },
    { concept: "vierhoeke", gen: genQuad }, { concept: "vierhoeke", gen: genQuadTF },
    { concept: "vierhoeke", gen: genQuad },
  ] },
  s5: { skills: Array.from({ length: 5 }, () => ({ concept: "kongruent", gen: genCong })) },
};
