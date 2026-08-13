/* ============================================================
   HOOFSTUK 3 — REGUITLYN MEETKUNDE  (met diagramme)
   Sterkpunt: m1 "Lees die gradeboog" (akkurate protractor).
   ============================================================ */
import { mc, tf, multi, calc, protractor, randInt, pick, shuffled, code, nearDistractors } from "./_shared.js";
import { angleFigure, lineFigure, straightLineFigure, aroundPointFigure, verticalFigure } from "../engine/diagrams.js";
import { renderProtractor } from "../engine/protractor.js";

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

/* ============ m4 · Punte & lyne ============ */
const LINE_TYPES = [
  { key: "punt", name: "punt" },
  { key: "lyn", name: "lyn" },
  { key: "straal", name: "straal" },
  { key: "lynsegment", name: "lynsegment" },
  { key: "snylyne", name: "snylyn" },
];
function genLineType() {
  const t = pick(LINE_TYPES);
  return mc("Wat sien jy hier?",
    shuffled(LINE_TYPES.map(x => ({ label: x.name, correct: x.key === t.key }))), {
    figure: lineFigure(t.key, TEAL),
    hint: "Punt = net 'n kol (geen lengte of breedte) · lyn = pyltjies altwee kante (hou vir ewig aan) · straal = begin by 'n punt, een pyltjie · lynsegment = 'n stukkie met twee eindpunte · snylyn = 'n lyn wat deur ander lyne sny.",
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

/* ============================================================
   DEEL 2 — hersiening-rondtes (m1b–m10b)
   ------------------------------------------------------------
   Nooit 'n Deel-1-sjabloon met vars getalle nie — elke rondte kry
   'n EGTE nuwe vraagstyl: die rigting omgekeer, 'n nuwe konteks, of
   'n nuwe meganika. Die herhalende idee hier (m2b, m5b–m10b): waar
   Deel 1 UITreken of IDENTIFISEER, vra Deel 2 "is hierdie bewering
   reg?" — 'n WAAR/ONWAAR-nagaan-meganika i.p.v. 'n reken-meganika.
   _chk dra steeds net die WERKLIKE waardes wat in die figuur
   geteken word (nooit die bewering se vals getal, wat net in die
   prompt-teks staan) — sien tools/verify-stellings-core.mjs.
   Waar/onwaar is 'n antwoord-bepalende keuse, so elke sulke rondte
   se skills-lys word EENMAAL geskommel gebou (die st20/st24-patroon
   — 'n gedwonge mengsel, nooit 'n coin-flip BINNE een gen nie). */

/* kies 'n "amper reg" vals getal — altyd positief, nooit gelyk aan trueVal nie */
function wrongBy(trueVal, deltas = [-20, -15, -10, 10, 15, 20]) {
  const pool = shuffled(deltas);
  for (const d of pool) { const v = trueVal + d; if (v > 0 && v !== trueVal) return v; }
  return trueVal + 5;   // noodval, behoort nooit bereik te word nie
}

/* ---------- m1b · Lees die gradeboog — Deel 2 (kies die REGTE lesing) ---------- */
function genReadReverse() {
  let ang = randInt(3, 33) * 5;
  if (Math.random() < 0.12) ang = 90;
  const wrongScale = 180 - ang;   // die klassieke fout: die buitenste ry i.p.v. die binneste ry
  // by 90° val die "verkeerde skaal"-afleier saam met die regte antwoord (180−90=90) —
  // los dit dan uit en vul aan met gewone naby-afleiers i.p.v. 'n duplikaat-opsie.
  const includeWrongScale = wrongScale !== ang;
  const distract = nearDistractors(ang, 6, 10).filter(d => d > 0 && d < 180 && d !== ang && d !== wrongScale);
  const needed = includeWrongScale ? 2 : 3;
  return mc(`Kyk mooi na ALTWEE rye syfers op die gradeboog. Watter lesing is REG vir hoek AÔB?`,
    shuffled([
      { label: `${ang}°`, correct: true },
      ...(includeWrongScale ? [{ label: `${wrongScale}°`, correct: false }] : []),
      ...distract.slice(0, needed).map(d => ({ label: `${d}°`, correct: false })),
    ]), {
    figure: renderProtractor(ang, { accent: TEAL }),
    hint: "Arm A lê op die 0-lyn (regs). Lees die BINNESTE ry (nie die buitenste nie) waar arm B kruis.",
    answerLabel: `${ang}°`,
  });
}

/* ---------- m2b · Soorte hoeke — Deel 2 (waar of onwaar 'n bewering) ---------- */
const HOEK_TIPES_B = [
  { name: "skerphoek", lo: 5, hi: 16 },     // ×5 → 25…80
  { name: "regtehoek", exact: 90 },
  { name: "stomphoek", lo: 20, hi: 33 },    // ×5 → 100…165
  { name: "gestrekte hoek", exact: 180 },
];
function genSoortHoekTF(claimTrue) {
  const t = pick(HOEK_TIPES_B);
  const deg = t.exact != null ? t.exact : randInt(t.lo, t.hi) * 5;
  const claimed = claimTrue ? t.name : pick(HOEK_TIPES_B.filter(x => x.name !== t.name)).name;
  return tf(`Iemand sê: "Dit is 'n <b>${claimed}</b>." Is hulle reg?`, claimTrue, {
    figure: angleFigure(deg, TEAL),
    hint: "Kleiner as 'n regtehoek (90°) = skerp · presies 90° = reg · groter as 90° maar nie reguit = stomp · 'n reguit lyn = gestrek (180°).",
    _chk: { figKind: "angle", values: [deg], hideIndex: null, allShown: true },
  });
}

/* ---------- m3b · Lyne & notasie — Deel 2 (regte-lewe konteks, kies-almal) ---------- */
const LYN_KONTEKS = {
  ewewydig: ["Spoorlyne wat langs mekaar loop", "Die twee kante van 'n reguit pad", "Lyne op skryfpapier", "Die snare bo-op 'n gitaar"],
  loodreg: ["Die hoek van 'n boek se bladsy", "Waar 'n muur die vloer ontmoet", "Die twee strepe van 'n plusteken (+)", "'n Vlagpaal wat regop uit die grond kom"],
};
function genLineContext() {
  const kind = pick(["ewewydig", "loodreg"]);
  const other = kind === "ewewydig" ? "loodreg" : "ewewydig";
  const yes = shuffled(LYN_KONTEKS[kind]).slice(0, 2);
  const no = shuffled(LYN_KONTEKS[other]).slice(0, 2);
  const label = kind === "ewewydig" ? "ewewydig (parallel)" : "loodreg";
  return multi(`Kies AL die voorbeelde wat <b>${label}</b> is.`,
    shuffled([...yes.map(l => ({ label: l, correct: true })), ...no.map(l => ({ label: l, correct: false }))]), {
    hint: "Ewewydig = loop langs mekaar en ontmoet nooit · Loodreg = maak 'n presiese hoek van 90° waar hulle ontmoet.",
  });
}

/* ---------- m4b · Punte & lyne — Deel 2 (beskrywing → naam) ---------- */
const LINE_DESC = {
  punt: "Net 'n plek — dit het geen lengte of breedte nie.",
  lyn: "Gaan vir ewig aan na BEIDE kante toe, met 'n pyltjie op elke punt.",
  straal: "Begin by een vaste punt, en gaan van daar af net EEN kant toe vir ewig aan.",
  lynsegment: "'n Stukkie lyn met 'n duidelike begin- ÉN eindpunt.",
  snylyne: "Twee (of meer) lyne wat mekaar op een plek kruis.",
};
function genLineTypeReverse() {
  const t = pick(LINE_TYPES);
  return mc(LINE_DESC[t.key],
    shuffled(LINE_TYPES.map(x => ({ label: x.name, correct: x.key === t.key }))), {
    hint: "Tel die pyltjies en eindpunte: 2 eindpunte = lynsegment · 1 punt + een pyl = straal · 0 eindpunte oral = lyn · 'n kruising = snylyn · geen grootte = punt.",
    answerLabel: t.name,
  });
}

/* ---------- m5b · Komplementêre hoeke — Deel 2 (waar of onwaar 'n som) ---------- */
function genCompTF(claimTrue) {
  const a = randInt(5, 16) * 5;              // 25…80
  const trueB = 90 - a;
  const claimedB = claimTrue ? trueB : wrongBy(trueB);
  return tf(`Twee hoeke is ${code(a + "°")} en ${code(claimedB + "°")}. Is hulle komplementêr (saam = 90°)?`, claimTrue, {
    figure: angleFigure(a, TEAL),
    hint: "Tel die twee hoeke bymekaar. Kry jy presies 90°? Dan is hulle komplementêr.",
    _chk: { figKind: "angle", values: [a], hideIndex: null, allShown: true },
  });
}

/* ---------- m6b · Supplementêre hoeke — Deel 2 (waar of onwaar 'n som) ---------- */
function genSuppTF(claimTrue) {
  const a = randInt(5, 34) * 5;              // 25…170
  const trueB = 180 - a;
  const claimedB = claimTrue ? trueB : wrongBy(trueB);
  return tf(`Twee hoeke is ${code(a + "°")} en ${code(claimedB + "°")}. Is hulle supplementêr (saam = 180°)?`, claimTrue, {
    figure: angleFigure(a, TEAL),
    hint: "Tel die twee hoeke bymekaar. Kry jy presies 180°? Dan is hulle supplementêr.",
    _chk: { figKind: "angle", values: [a], hideIndex: null, allShown: true },
  });
}

/* ---------- m7b · Hoeke op 'n reguitlyn — Deel 2 (gaan 'n bewering na) ---------- */
function genStraightLineTF(claimTrue) {
  const given = randInt(5, 31) * 5;          // 25…155
  const trueOther = 180 - given;
  const claimed = claimTrue ? trueOther : wrongBy(trueOther);
  return tf(`Op die diagram is die een hoek ${code(given + "°")}. Iemand sê die ANDER hoek (langs die reguitlyn) is ${code(claimed + "°")}. Is hulle reg?`, claimTrue, {
    figure: straightLineFigure(given, TEAL),
    hint: "Hoeke op 'n reguitlyn tel altyd saam op tot 180°. Trek die gegewe hoek van 180° af en vergelyk.",
    _chk: { figKind: "straightLine", values: [given, trueOther], hideIndex: 1, allShown: false },
  });
}

/* ---------- m8b · Hoeke rondom 'n punt — Deel 2 (gaan 'n bewering na) ---------- */
function genAroundPointTF(claimTrue) {
  let a, b;
  do { a = randInt(8, 22) * 5; b = randInt(8, 22) * 5; } while (360 - a - b < 40 || 360 - a - b > 230);
  const trueC = 360 - a - b;
  const claimed = claimTrue ? trueC : wrongBy(trueC);
  return tf(`Twee hoeke rondom 'n punt is ${code(a + "°")} en ${code(b + "°")}. Iemand sê die DERDE hoek is ${code(claimed + "°")}. Is hulle reg?`, claimTrue, {
    figure: aroundPointFigure(a, b, TEAL),
    hint: "Al die hoeke rondom 'n punt tel altyd saam op tot 360°. Trek die twee gegewe hoeke van 360° af en vergelyk.",
    _chk: { figKind: "aroundPoint", values: [a, b, trueC], hideIndex: 2, allShown: false },
  });
}

/* ---------- m9b · Regoorstaande hoeke — Deel 2 (gaan 'n bewering na) ---------- */
function genVerticalTF(claimTrue) {
  const known = randInt(5, 15) * 5;          // 25…75
  const claimed = claimTrue ? known : wrongBy(known);
  return tf(`Die een hoek by die snypunt is ${code(known + "°")}. Iemand sê die REGOORSTAANDE hoek is ${code(claimed + "°")}. Is hulle reg?`, claimTrue, {
    figure: verticalFigure(known, TEAL),
    hint: "Regoorstaande hoeke (oorkant die snypunt waar twee lyne kruis) is altyd presies EWE GROOT — nooit 'n som nie.",
    _chk: { figKind: "vertical", values: [known, known], hideIndex: 1, allShown: false },
  });
}

/* ---------- m10b · Inspringende (refleks) hoeke — Deel 2 (gaan 'n bewering na) ---------- */
function genReflexTF(claimTrue) {
  const inner = randInt(20, 175);
  const trueReflex = 360 - inner;
  const claimed = claimTrue ? trueReflex : wrongBy(trueReflex, [-30, -20, -15, 15, 20, 30]);
  return tf(`Die kleiner hoek is ${code(inner + "°")}. Iemand sê die inspringende (refleks) hoek is ${code(claimed + "°")}. Is hulle reg?`, claimTrue, {
    hint: "Die kleiner hoek en die refleks-hoek maak saam 'n volle draai (360°). Trek die kleiner hoek van 360° af en vergelyk.",
  });
}

export const CH3 = {
  m1: { skills: Array.from({ length: 5 }, () => ({ concept: "gradeboog", gen: genRead })) },
  m1b: { skills: Array.from({ length: 5 }, () => ({ concept: "gradeboog", gen: genReadReverse })) },
  m2: { skills: Array.from({ length: 5 }, () => ({ concept: "hoektipes", gen: genSoortHoek })) },
  m2b: { skills: shuffled([true, true, false, false, true]).map(k => ({ concept: "hoektipes", gen: () => genSoortHoekTF(k) })) },
  m3: { skills: Array.from({ length: 5 }, () => ({ concept: "lyne", gen: genLineNotasie })) },
  m3b: { skills: Array.from({ length: 5 }, () => ({ concept: "lyne", gen: genLineContext })) },
  m4: { skills: Array.from({ length: 5 }, () => ({ concept: "lyne", gen: genLineType })) },
  m4b: { skills: Array.from({ length: 5 }, () => ({ concept: "lyne", gen: genLineTypeReverse })) },
  m5: { skills: Array.from({ length: 5 }, () => ({ concept: "hoekverwant", gen: genComp })) },
  m5b: { skills: shuffled([true, true, false, false, true]).map(k => ({ concept: "hoekverwant", gen: () => genCompTF(k) })) },
  m6: { skills: Array.from({ length: 5 }, () => ({ concept: "hoekverwant", gen: genSupp })) },
  m6b: { skills: shuffled([true, false, true, false, true]).map(k => ({ concept: "hoekverwant", gen: () => genSuppTF(k) })) },
  m7: { skills: Array.from({ length: 5 }, () => ({ concept: "hoekverwant", gen: genStraightLineQ })) },
  m7b: { skills: shuffled([true, true, false, false, true]).map(k => ({ concept: "hoekverwant", gen: () => genStraightLineTF(k) })) },
  m8: { skills: Array.from({ length: 5 }, () => ({ concept: "hoekverwant", gen: genAroundPointQ })) },
  m8b: { skills: shuffled([true, false, true, false, true]).map(k => ({ concept: "hoekverwant", gen: () => genAroundPointTF(k) })) },
  m9: { skills: Array.from({ length: 5 }, () => ({ concept: "hoekverwant", gen: genVerticalQ })) },
  m9b: { skills: shuffled([true, true, false, false, true]).map(k => ({ concept: "hoekverwant", gen: () => genVerticalTF(k) })) },
  m10: { skills: [
    { concept: "reflekshoek", gen: genReflexFromInner }, { concept: "reflekshoek", gen: genReflexAroundPoint },
    { concept: "reflekshoek", gen: genReflexIdentify }, { concept: "reflekshoek", gen: genReflexReverse },
    { concept: "reflekshoek", gen: genReflexFromInner },
  ] },
  m10b: { skills: shuffled([true, false, true, false, true]).map(k => ({ concept: "reflekshoek", gen: () => genReflexTF(k) })) },
};

/* waar/onwaar-rondtes: die skill-inskrywing bepaal die ANTWOORD, so skommel
   die volgorde elke speelslag — anders kan herspeel die W/O-patroon memoriseer
   (selfde reël as hfst 6 se strik-rondtes, sien play.js). */
for (const id of ["m2b", "m5b", "m6b", "m7b", "m8b", "m9b", "m10b"]) {
  CH3[id].shuffleSkills = true;
}
