/* ============================================================
   HOOFSTUK 3 — REGUITLYN MEETKUNDE  (met diagramme)
   Sterkpunt: m1 "Lees die gradeboog" (akkurate protractor).
   ============================================================ */
import { mc, calc, protractor, randInt, pick, shuffled, code } from "./_shared.js";
import { angleFigure, lineFigure, straightLineFigure, aroundPointFigure, verticalFigure } from "../engine/diagrams.js";

const TEAL = "#0d9488";

/* ============ m1 · Lees die gradeboog ============ */
function genRead() {
  let ang = randInt(3, 33) * 5;            // 15 … 165
  if (Math.random() < 0.12) ang = 90;
  const type = ang < 90 ? "skerphoek" : ang === 90 ? "regtehoek" : "stomphoek";
  return protractor(`Hoe groot is hoek <b>AÔB</b>? Lees dit van die gradeboog af.`, ang, {
    tol: 2,
    answerLabel: `${ang}° (${type})`,
    hint: "Arm A lê op die 0-lyn (regs), so lees die BINNESTE ry getalle waar arm B kruis. Begin by 0 langs arm A en tel op. Tussen twee getalle? Elke klein merkie is 1°.",
  });
}

/* ============ m2 · Soorte hoeke (klassifiseer uit 'n diagram) ============ */
const HOEK_TIPES = [
  { name: "skerphoek", lo: 4, hi: 16 },     // ×5 → 20…80
  { name: "regtehoek", exact: 90 },
  { name: "stomphoek", lo: 20, hi: 33 },    // ×5 → 100…165
  { name: "gestrekte hoek", exact: 180 },
];
function genSoortHoek() {
  const t = pick(HOEK_TIPES);
  const deg = t.exact != null ? t.exact : randInt(t.lo, t.hi) * 5;
  return mc("Watter soort hoek is dit?",
    shuffled(HOEK_TIPES.map(x => ({ label: x.name, correct: x.name === t.name }))), {
    figure: angleFigure(deg, TEAL),
    hint: "Kleiner as 'n regtehoek (90°) = skerp · presies 90° = reg · groter as 90° maar nie reguit = stomp · 'n reguit lyn = gestrek (180°).",
    answerLabel: t.name,
  });
}

/* ============ m3 · Lyne & notasie ============ */
function genLineNotasie() {
  const par = Math.random() < 0.5;
  const kind = par ? "ewewydig" : "loodreg";
  if (Math.random() < 0.5) {
    return mc("Hoe lê hierdie twee lyne teenoor mekaar?",
      shuffled([
        { label: "ewewydig (parallel)", correct: par },
        { label: "loodreg", correct: !par },
        { label: "ewe lank", correct: false },
      ]), {
      figure: lineFigure(kind, TEAL),
      hint: "›-merkies wat dieselfde rigting wys = ewewydig (loop langs mekaar). 'n Regtehoek-blokkie (90°) = loodreg.",
      answerLabel: par ? "ewewydig (parallel)" : "loodreg",
    });
  }
  return mc(`Watter simbool beteken ${par ? "ewewydig (parallel)" : "loodreg"}?`,
    shuffled([
      { label: "//", correct: par },
      { label: "⟂", correct: !par },
      { label: "=", correct: false },
      { label: "≡", correct: false },
    ]), {
    figure: lineFigure(kind, TEAL),
    hint: "// beteken ewewydig · ⟂ beteken loodreg (90°).",
    answerLabel: par ? "//" : "⟂",
  });
}

/* ============ m4 · Soorte lyne ============ */
const LINE_TYPES = [
  { key: "lyn", name: "lyn" },
  { key: "straal", name: "straal" },
  { key: "lynsegment", name: "lynsegment" },
  { key: "snylyne", name: "snylyne" },
];
function genLineType() {
  const t = pick(LINE_TYPES);
  return mc("Wat sien jy hier?",
    shuffled(LINE_TYPES.map(x => ({ label: x.name, correct: x.key === t.key }))), {
    figure: lineFigure(t.key, TEAL),
    hint: "Lyn = pyltjies altwee kante (hou vir ewig aan) · straal = begin by 'n punt, een pyltjie · lynsegment = 'n stukkie met twee eindpunte · snylyne = twee lyne wat kruis.",
    answerLabel: t.name,
  });
}

/* ============ m5 · Komplementêre hoeke (som = 90°) ============ */
function genComp() {
  const a = randInt(2, 16) * 5;            // 10…80
  return calc(`Twee hoeke is komplementêr. Een is ${code(a + "°")}. Wat is die ander?`, 90 - a, {
    unit: "°", figure: angleFigure(a, TEAL),
    hint: "Komplementêre hoeke maak saam 90°. Trek die hoek van 90° af.",
    solution: [{ s: `90 − ${a} = ${90 - a}`, r: "" }],
  });
}

/* ============ m6 · Supplementêre hoeke (som = 180°) ============ */
function genSupp() {
  const a = randInt(4, 34) * 5;            // 20…170
  return calc(`Twee hoeke is supplementêr. Een is ${code(a + "°")}. Wat is die ander?`, 180 - a, {
    unit: "°", figure: angleFigure(a, TEAL),
    hint: "Supplementêre hoeke maak saam 180°. Trek die hoek van 180° af.",
    solution: [{ s: `180 − ${a} = ${180 - a}`, r: "" }],
  });
}

/* ============ m7 · Hoeke op 'n reguitlyn (som = 180°) ============ */
function genStraightLineQ() {
  const given = randInt(5, 31) * 5;        // 25…155
  return calc(`Bereken die hoek wat met ${code("?")} gemerk is.`, 180 - given, {
    unit: "°", figure: straightLineFigure(given, TEAL),
    hint: "Hoeke op 'n reguitlyn tel saam tot 180°. Trek die gegewe hoek van 180° af.",
    solution: [{ s: `180 − ${given} = ${180 - given}`, r: "reguitlyn = 180°" }],
  });
}

/* ============ m8 · Hoeke rondom 'n punt (som = 360°) ============ */
function genAroundPointQ() {
  let a, b;
  do { a = randInt(8, 22) * 5; b = randInt(8, 22) * 5; } while (360 - a - b < 40 || 360 - a - b > 230);
  return calc(`Bereken die hoek wat met ${code("?")} gemerk is.`, 360 - a - b, {
    unit: "°", figure: aroundPointFigure(a, b, TEAL),
    hint: "Al die hoeke rondom 'n punt tel saam tot 360°. Trek die twee gegewe hoeke van 360° af.",
    solution: [{ s: `360 − ${a} − ${b} = ${360 - a - b}`, r: "rondom 'n punt = 360°" }],
  });
}

/* ============ m9 · Regoorstaande hoeke (gelyk) ============ */
function genVerticalQ() {
  const known = randInt(5, 15) * 5;        // 25…75
  return calc(`Bereken die hoek wat met ${code("?")} gemerk is (die regoorstaande hoek).`, known, {
    unit: "°", figure: verticalFigure(known, TEAL),
    hint: "Regoorstaande hoeke (waar twee lyne sny) is altyd GELYK. So ? is dieselfde as die gegewe hoek.",
    solution: [{ s: `? = ${known}`, r: "regoorstaande hoeke is gelyk" }],
  });
}

/* ============ m10 · Inspringende (refleks) hoeke (360 − kleiner) ============ */
function genReflexFromInner() {
  const inner = randInt(20, 175);
  return calc(`Die kleiner hoek is ${code(inner + "°")}. Wat is die inspringende (refleks) hoek?`, 360 - inner, {
    unit: "°",
    hint: "Die kleiner hoek en die refleks-hoek maak saam 'n volle draai (360°). Trek dus die kleiner hoek van 360° af.",
    solution: [{ s: `360 − ${inner} = ${360 - inner}`, r: "volle draai = 360°" }],
  });
}
function genReflexAroundPoint() {
  const a = randInt(30, 170);
  return calc(`Hoeke rondom 'n punt maak saam ${code("360°")}. Een hoek is ${code(a + "°")}. Wat is die ander (refleks) hoek rondom die punt?`, 360 - a, {
    unit: "°",
    hint: "Al die hoeke rondom 'n punt tel saam tot 360°. Trek die gegewe hoek van 360° af.",
    solution: [{ s: `360 − ${a} = ${360 - a}`, r: "" }],
  });
}
function genReflexReverse() {
  const reflex = randInt(185, 340);
  return calc(`'n Refleks-hoek is ${code(reflex + "°")}. Wat is die kleiner hoek?`, 360 - reflex, {
    unit: "°",
    hint: "Die refleks-hoek en die kleiner hoek maak saam 360°. Trek die refleks-hoek van 360° af.",
    solution: [{ s: `360 − ${reflex} = ${360 - reflex}`, r: "" }],
  });
}
function genReflexIdentify() {
  const reflex = randInt(37, 71) * 5;
  const pool = new Set();
  while (pool.size < 3) { const d = randInt(2, 35) * 5; if (d < 180) pool.add(d); }
  return mc("Watter een van hierdie is 'n inspringende (refleks) hoek?",
    shuffled([{ label: `${reflex}°`, correct: true }, ...[...pool].map(d => ({ label: `${d}°`, correct: false }))]), {
    hint: "'n Refleks-hoek lê tussen 180° en 360° — dit is groter as 'n gestrekte hoek (180°).",
    answerLabel: `${reflex}°`,
  });
}

export const CH3 = {
  m1: { skills: Array.from({ length: 5 }, () => ({ concept: "gradeboog", gen: genRead })) },
  m2: { skills: Array.from({ length: 5 }, () => ({ concept: "hoektipes", gen: genSoortHoek })) },
  m3: { skills: Array.from({ length: 5 }, () => ({ concept: "lyne", gen: genLineNotasie })) },
  m4: { skills: Array.from({ length: 5 }, () => ({ concept: "lyne", gen: genLineType })) },
  m5: { skills: Array.from({ length: 5 }, () => ({ concept: "hoekverwant", gen: genComp })) },
  m6: { skills: Array.from({ length: 5 }, () => ({ concept: "hoekverwant", gen: genSupp })) },
  m7: { skills: Array.from({ length: 5 }, () => ({ concept: "hoekverwant", gen: genStraightLineQ })) },
  m8: { skills: Array.from({ length: 5 }, () => ({ concept: "hoekverwant", gen: genAroundPointQ })) },
  m9: { skills: Array.from({ length: 5 }, () => ({ concept: "hoekverwant", gen: genVerticalQ })) },
  m10: { skills: [
    { concept: "reflekshoek", gen: genReflexFromInner }, { concept: "reflekshoek", gen: genReflexAroundPoint },
    { concept: "reflekshoek", gen: genReflexIdentify }, { concept: "reflekshoek", gen: genReflexReverse },
    { concept: "reflekshoek", gen: genReflexFromInner },
  ] },
};
