/* ============================================================
   HOOFSTUK 5 — TRANSFORMASIES  (met diagramme, soos Circle Quest)
   ============================================================ */
import { mc, tf, calc, coord, randInt, pick, shuffled, code } from "./_shared.js";
import { transformFigure, pointFigure, reflectFigure, rotateFigure, shapeFigure, enlargeFigure } from "../engine/diagrams.js";

const ACC = "#db2777";

/* ============ t1 · Benoem die transformasie (diagram) ============ */
function genName() {
  const kinds = [
    { kind: "translate", a: "translasie" },
    { kind: "reflectY", a: "refleksie" },
    { kind: "reflectX", a: "refleksie" },
    { kind: "rotate", a: "rotasie" },
  ];
  const it = pick(kinds);
  return mc("Watter transformasie het met vorm <b>A</b> gebeur om die stippellyn-beeld <b>A′</b> te maak?",
    shuffled(["translasie", "refleksie", "rotasie"].map(x => ({ label: x, correct: x === it.a }))), {
    figure: transformFigure(it.kind, ACC),
    hint: "Net geskuif (selfde rigting) = translasie · geflip/omgekeer = refleksie · gedraai = rotasie.",
    answerLabel: it.a,
  });
}

/* ============ t2 · Translasie & koördinate (diagram + invoer) ============ */
function genTranslate() {
  const x = randInt(-5, 5), y = randInt(-5, 5);
  const dx = randInt(1, 6) * pick([1, -1]), dy = randInt(1, 6) * pick([1, -1]);
  const hx = dx >= 0 ? `${dx} eenhede regs` : `${-dx} eenhede links`;
  const hy = dy >= 0 ? `${dy} eenhede op` : `${-dy} eenhede af`;
  return coord(`Punt A is by ${code(`(${x} ; ${y})`)}. Transleer ${hx} en ${hy}. Wat is die nuwe punt?`,
    { x: x + dx, y: y + dy }, {
    figure: pointFigure(x, y, ACC),
    hint: "Regs/links verander x · op/af verander y. Regs en op tel by; links en af trek af.",
    solution: [{ s: `x: ${x} ${dx < 0 ? "− " + -dx : "+ " + dx} = ${x + dx}`, r: "" }, { s: `y: ${y} ${dy < 0 ? "− " + -dy : "+ " + dy} = ${y + dy}`, r: "" }],
  });
}

/* ============ t3 · Refleksie & rotasie (diagram) ============
   Gewaarborgde mengsel: beide refleksie EN rotasie kom voor, met twee
   vraagtipes elk — "watter as/hoek?" (diagram-MK) en "kry die beeld se
   koördinate" (punt-invoer). Soveel afwisseling dat niks herhaal nie. */

/* refleksie — watter as is die vorm oor geflip? */
function genReflectAxis() {
  const axis = pick(["x", "y"]);
  return mc("Om watter as is vorm <b>A</b> na <b>A′</b> gereflekteer (geflip)?",
    shuffled([{ label: "die x-as", correct: axis === "x" }, { label: "die y-as", correct: axis === "y" }]), {
    figure: reflectFigure(axis, ACC),
    hint: "Die stippellyn is die as waaroor die vorm geflip is. 'n Punt en sy beeld lê ewe ver weerskante daarvan.",
    answerLabel: axis === "x" ? "die x-as" : "die y-as",
  });
}

/* rotasie — deur watter hoek is die vorm om O gedraai? */
function genRotateAngle() {
  const deg = pick([90, 180, 270]);
  const label = deg === 180 ? "180°" : deg === 90 ? "90° anti-kloksgewys" : "90° kloksgewys";
  return mc("Vorm <b>A</b> is om die punt <b>O</b> gedraai na <b>A′</b>. Deur hoeveel is dit gedraai?",
    shuffled([
      { label: "180°", correct: deg === 180 },
      { label: "90° anti-kloksgewys", correct: deg === 90 },
      { label: "90° kloksgewys", correct: deg === 270 },
    ]), {
    figure: rotateFigure(deg, ACC),
    hint: "180° draai dit reguit oor (onderste-bo). 90° is 'n kwartdraai — kloksgewys draai na regs, anti-kloksgewys na links.",
    answerLabel: label,
  });
}

/* refleksie — kry die beeld-koördinate van 'n punt */
function genReflectPoint() {
  const axis = pick(["x", "y"]);
  const x = randInt(-5, 5) || 2, y = randInt(-5, 5) || 3;   // vermy presies op die as
  const img = axis === "x" ? { x, y: -y } : { x: -x, y };
  const asNaam = axis === "x" ? "die x-as" : "die y-as";
  return coord(`Punt A is by ${code(`(${x} ; ${y})`)}. Reflekteer dit om ${asNaam}. Wat is die beeld A′?`,
    img, {
    figure: pointFigure(x, y, ACC),
    hint: axis === "x"
      ? "By 'n refleksie om die x-as bly x dieselfde en y verander van teken (+ word − en omgekeerd)."
      : "By 'n refleksie om die y-as bly y dieselfde en x verander van teken (+ word − en omgekeerd).",
    solution: axis === "x"
      ? [{ s: `x bly dieselfde: ${x}`, r: "" }, { s: `y verander teken: ${y} → ${-y}`, r: "" }]
      : [{ s: `x verander teken: ${x} → ${-x}`, r: "" }, { s: `y bly dieselfde: ${y}`, r: "" }],
  });
}

/* rotasie — kry die beeld-koördinate ná 'n draai van 180° om O */
function genRotatePoint() {
  const x = randInt(-5, 5) || 2, y = randInt(-5, 5) || -3;
  return coord(`Punt A is by ${code(`(${x} ; ${y})`)}. Draai dit 180° om die oorsprong O. Wat is die beeld A′?`,
    { x: -x, y: -y }, {
    figure: pointFigure(x, y, ACC),
    hint: "By 'n draai van 180° om O verander BEIDE koördinate van teken: (x ; y) → (−x ; −y).",
    solution: [{ s: `x verander teken: ${x} → ${-x}`, r: "" }, { s: `y verander teken: ${y} → ${-y}`, r: "" }],
  });
}

/* ============ t4 · Simmetrie (diagram) ============ */
const SYM = [
  { name: "vierkant", lines: 4, order: 4 },
  { name: "gelyksydige driehoek", lines: 3, order: 3 },
  { name: "reëlmatige seshoek", lines: 6, order: 6 },
  { name: "reghoek", lines: 2, order: 2 },
  { name: "reëlmatige vyfhoek", lines: 5, order: 5 },
];
function genLines() {
  const s = pick(SYM);
  return calc(`Hoeveel simmetrielyne het hierdie ${code(s.name)}?`, s.lines, {
    figure: shapeFigure(s.name, ACC),
    hint: "By 'n reëlmatige veelhoek is die aantal simmetrielyne gelyk aan die aantal sye.",
    answerLabel: `${s.lines}`,
  });
}
function genOrder() {
  const s = pick(SYM);
  return calc(`Wat is die orde van rotasiesimmetrie van hierdie ${code(s.name)}?`, s.order, {
    figure: shapeFigure(s.name, ACC),
    hint: "Hoeveel keer pas die vorm presies op homself in een volle draai (360°)?",
    answerLabel: `${s.order}`,
  });
}

/* ============ t5 · Vergroting & skaalfaktor (diagram) ============ */
function genEnlarge() {
  const r = Math.random();
  if (r < 0.4) {
    const side = randInt(2, 6), k = randInt(2, 4);
    return calc(`'n Vierkant met sy ${code(side + " cm")} word met faktor ${code(k)} vergroot. Wat is die nuwe sy?`, side * k, {
      unit: "cm", figure: enlargeFigure(side, side * k, ACC),
      hint: `Vermenigvuldig die sy met die faktor: ${side} × ${k}.`,
      solution: [{ s: `${side} × ${k} = ${side * k}`, r: "" }],
    });
  }
  if (r < 0.75) {
    const old = randInt(2, 6), k = randInt(2, 5), neu = old * k;
    return calc(`Die sy van 'n vierkant verander van ${code(old + " cm")} na ${code(neu + " cm")}. Wat is die skaalfaktor?`, k, {
      figure: enlargeFigure(old, neu, ACC),
      hint: "Skaalfaktor = nuwe lengte ÷ ou lengte.",
      solution: [{ s: `${neu} ÷ ${old} = ${k}`, r: "" }],
    });
  }
  const per = randInt(2, 6) * 4, k = randInt(2, 3);
  return calc(`'n Vierkant het omtrek ${code(per + " cm")} en word met faktor ${code(k)} vergroot. Wat is die nuwe omtrek?`, per * k, {
    unit: "cm", hint: "Die omtrek vermenigvuldig met dieselfde faktor.",
    solution: [{ s: `${per} × ${k} = ${per * k}`, r: "" }],
  });
}

/* ============ t10 · Transformasies gemeng (hersiening) ============ */
function genMixed() {
  return pick([genName, genReflectAxis, genRotateAngle, genTranslate, genReflectPoint])();
}

export const CH5 = {
  t1: { skills: Array.from({ length: 5 }, () => ({ concept: "transformasie", gen: genName })) },
  t2: { skills: Array.from({ length: 5 }, () => ({ concept: "translasie", gen: genTranslate })) },
  t3: { skills: Array.from({ length: 5 }, () => ({ concept: "rotasie", gen: genReflectAxis })) },
  t4: { skills: Array.from({ length: 5 }, () => ({ concept: "rotasie", gen: genReflectPoint })) },
  t5: { skills: Array.from({ length: 5 }, () => ({ concept: "rotasie", gen: genRotateAngle })) },
  t6: { skills: Array.from({ length: 5 }, () => ({ concept: "rotasie", gen: genRotatePoint })) },
  t7: { skills: Array.from({ length: 5 }, () => ({ concept: "simmetrie", gen: genLines })) },
  t8: { skills: Array.from({ length: 5 }, () => ({ concept: "simmetrie", gen: genOrder })) },
  t9: { skills: Array.from({ length: 5 }, () => ({ concept: "vergroting", gen: genEnlarge })) },
  t10: { skills: Array.from({ length: 5 }, () => ({ concept: "transformasie", gen: genMixed })) },
};
