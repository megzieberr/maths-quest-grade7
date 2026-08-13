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

/* ============================================================
   DEEL 2 — hersiening-rondtes (t1b–t10b)
   ------------------------------------------------------------
   Nooit 'n Deel-1-sjabloon met vars getalle nie — elke rondte kry
   'n EGTE nuwe vraagstyl: die rigting omgekeer (gee die BEELD, vra
   die oorspronklike; gee twee punte, vra die transformasie), 'n
   nuwe konteks (regte-lewe voorbeelde), of 'n nuwe meganika (dubbele
   rotasie, waar/onwaar-nagaan) — sien ch3-meetkunde.js/ch4-vorms.js
   se Deel 2 vir dieselfde patroon. Grid/koördinaat-antwoorde gebruik
   steeds die coord()-tipe (x ; y). Geen van hierdie rondtes teken 'n
   meetbare booghoek nie (rooster-figure/pointFigure/shapeFigure het
   geen <polyline>-boog nie), dus geen _chk/verify-stellings-
   registrasie nodig nie — geverifieer eerder deur 'n toegewyde
   headless fuzz-toets, tools/fuzz-ch5b.mjs, wat elke rondte se
   transformasie-wiskunde (refleksie/rotasie/translasie/skaalfaktor)
   onafhanklik herbereken en teen die gemerkte antwoord toets.
   Waar/onwaar is 'n antwoord-bepalende keuse, so t3b en t8b se
   skills-lyste word EENMAAL geskommel gebou (die st20/st24-patroon)
   en kry shuffleSkills = true hieronder. */

/* kies 'n "amper reg" vals getal — nooit gelyk aan trueVal nie.
   positiveOnly hou dit bo 0 (grade/orde/skaalfaktore); koördinate
   mag negatief wees, so dié bly af by verstek. */
function wrongBy(trueVal, deltas = [-3, -2, -1, 1, 2, 3], positiveOnly = false) {
  const pool = shuffled(deltas);
  for (const d of pool) {
    const v = trueVal + d;
    if (v !== trueVal && (!positiveOnly || v > 0)) return v;
  }
  return trueVal + 1;
}

/* ---------- t1b · Benoem die transformasie — Deel 2 (regte-lewe voorbeeld → naam) ---------- */
const CONTEXT_KINDS = [
  { a: "translasie", examples: [
    "'n Skaakstuk wat reguit oor die bord skuif, sonder om te draai of te flip",
    "'n Trein wat reguit vorentoe op sy spoor beweeg",
    "'n Boks wat reguit oor 'n tafel gestoot word",
    "'n Hysbak-knoppie wat opskuif na 'n hoër verdieping",
  ] },
  { a: "refleksie", examples: [
    "Jou spieëlbeeld wanneer jy in 'n spieël kyk",
    "'n Vlinder se twee vlerke wat presies dieselfde lyk, net omgekeer",
    "Woorde wat 'agteruit' lyk as jy dit deur 'n vensterruit van buite af lees",
    "Die water se refleksie van 'n boom langs 'n dam",
  ] },
  { a: "rotasie", examples: [
    "Die wysers van 'n horlosie wat om die middelpunt draai",
    "'n Stuurwiel van 'n motor wat gedraai word",
    "'n Rat (gear) wat om sy eie middelpunt draai",
    "'n Windpomp se blaaie wat in 'n sirkel draai",
  ] },
];
function genContextName() {
  const it = pick(CONTEXT_KINDS);
  const ex = pick(it.examples);
  return mc(`${ex}. Watter soort transformasie is dit?`,
    shuffled(["translasie", "refleksie", "rotasie"].map(x => ({ label: x, correct: x === it.a }))), {
    hint: "Net skuif, selfde rigting = translasie · flip/omgekeer = refleksie · draai om 'n punt = rotasie.",
    answerLabel: it.a,
  });
}

/* ---------- t2b · Translasie & koördinate — Deel 2 (gee A en A′, kry die translasie) ---------- */
function genTranslateReverse() {
  const x = randInt(-5, 5), y = randInt(-5, 5);
  const dx = randInt(1, 6) * pick([1, -1]), dy = randInt(1, 6) * pick([1, -1]);
  const x2 = x + dx, y2 = y + dy;
  return coord(`Punt A is by ${code(`(${x} ; ${y})`)} en ná 'n translasie is dit by A′ ${code(`(${x2} ; ${y2})`)}. Wat was die translasie? Tik dit as ${code("dx ; dy")}.`,
    { x: dx, y: dy }, {
    figure: pointFigure(x, y, ACC),
    hint: "Trek die ORIGINELE koördinate van die NUWE koördinate af: dx = x₂ − x₁, dy = y₂ − y₁.",
    answerLabel: `(${dx} ; ${dy})`,
    solution: [{ s: `dx: ${x2} − ${x} = ${dx}`, r: "" }, { s: `dy: ${y2} − ${y} = ${dy}`, r: "" }],
  });
}

/* ---------- t3b · Refleksie-as — Deel 2 (waar of onwaar 'n koördinaat-bewering) ---------- */
function genReflectVerify(claimTrue) {
  const axis = pick(["x", "y"]);
  const x = randInt(-6, 6) || 2, y = randInt(-6, 6) || 3;
  const trueImg = axis === "x" ? { x, y: -y } : { x: -x, y };
  const claimed = claimTrue ? trueImg
    : (axis === "x" ? { x, y: wrongBy(-y) } : { x: wrongBy(-x), y });
  const asNaam = axis === "x" ? "die x-as" : "die y-as";
  return tf(`Punt A is by ${code(`(${x} ; ${y})`)}. Iemand sê: as dit om ${asNaam} gereflekteer word, land dit by A′ ${code(`(${claimed.x} ; ${claimed.y})`)}. Is hulle reg?`, claimTrue, {
    hint: axis === "x"
      ? "By 'n refleksie om die x-as bly x dieselfde en y verander van teken (+ word − en omgekeerd)."
      : "By 'n refleksie om die y-as bly y dieselfde en x verander van teken (+ word − en omgekeerd).",
  });
}

/* ---------- t4b · Refleksie van 'n punt — Deel 2 (gee A′, kry die OORSPRONKLIKE A) ---------- */
function genReflectPointReverse() {
  const axis = pick(["x", "y"]);
  const x = randInt(-5, 5) || 2, y = randInt(-5, 5) || 3;
  const img = axis === "x" ? { x, y: -y } : { x: -x, y };
  const asNaam = axis === "x" ? "die x-as" : "die y-as";
  return coord(`Ná 'n refleksie om ${asNaam} het 'n punt by A′ ${code(`(${img.x} ; ${img.y})`)} geland. Wat was die OORSPRONKLIKE punt A?`,
    { x, y }, {
    figure: pointFigure(img.x, img.y, ACC),
    hint: axis === "x"
      ? "Refleksie om die x-as werk BEIDE KANTE toe dieselfde: x bly, y verander van teken."
      : "Refleksie om die y-as werk BEIDE KANTE toe dieselfde: y bly, x verander van teken.",
    solution: axis === "x"
      ? [{ s: `x bly dieselfde: ${img.x}`, r: "" }, { s: `y verander teken: ${img.y} → ${-img.y}`, r: "" }]
      : [{ s: `x verander teken: ${img.x} → ${-img.x}`, r: "" }, { s: `y bly dieselfde: ${img.y}`, r: "" }],
  });
}

/* ---------- t5b · Rotasie-hoek — Deel 2 (gee A en A′, kry die hoek — geen diagram) ---------- */
function genRotateAngleReverse() {
  let x, y;
  do { x = randInt(-5, 5); y = randInt(-5, 5); } while (x === 0 || y === 0);
  const imgs = { 90: { x: -y, y: x }, 180: { x: -x, y: -y }, 270: { x: y, y: -x } };
  const deg = pick([90, 180, 270]);
  const img = imgs[deg];
  const label = deg === 180 ? "180°" : deg === 90 ? "90° anti-kloksgewys" : "90° kloksgewys";
  return mc(`Punt A ${code(`(${x} ; ${y})`)} is om die oorsprong O gedraai en het by A′ ${code(`(${img.x} ; ${img.y})`)} beland. Deur hoeveel is dit gedraai?`,
    shuffled([
      { label: "180°", correct: deg === 180 },
      { label: "90° anti-kloksgewys", correct: deg === 90 },
      { label: "90° kloksgewys", correct: deg === 270 },
    ]), {
    hint: "180°: BEIDE koördinate verander van teken. 90°: die getalle ruil plek ÉN een verander van teken — kyk mooi watter een.",
    answerLabel: label,
  });
}

/* ---------- t6b · Rotasie van 'n punt — Deel 2 (draai TWEE KEER 180°) ---------- */
function genRotateDouble() {
  const x = randInt(-5, 5) || 2, y = randInt(-5, 5) || -3;
  return coord(`Punt A is by ${code(`(${x} ; ${y})`)}. Dit word 180° om O gedraai, en toe NOG 'n keer 180° om O gedraai. Waar eindig dit?`,
    { x, y }, {
    figure: pointFigure(x, y, ACC),
    hint: "Een 180°-draai verander BEIDE tekens. 'n TWEEDE 180°-draai verander die tekens weer terug — jy is nou net waar jy begin het!",
    solution: [{ s: `Eerste draai: (${x} ; ${y}) → (${-x} ; ${-y})`, r: "" }, { s: `Tweede draai: (${-x} ; ${-y}) → (${x} ; ${y})`, r: "" }],
  });
}

/* ---------- t7b · Simmetrielyne — Deel 2 (gee die telling, kry die vorm) ---------- */
function genLinesReverse() {
  const s = pick(SYM);
  const distract = shuffled(SYM.filter(x => x.lines !== s.lines)).slice(0, 3);
  return mc(`Watter vorm het ${code(s.lines + " simmetrielyne")}?`,
    shuffled([{ label: s.name, correct: true }, ...distract.map(d => ({ label: d.name, correct: false }))]), {
    hint: "By 'n reëlmatige veelhoek is die aantal simmetrielyne gelyk aan die aantal sye.",
    answerLabel: s.name,
  });
}

/* ---------- t8b · Rotasie-orde — Deel 2 (waar of onwaar 'n bewering) ---------- */
function genOrderVerify(claimTrue) {
  const s = pick(SYM);
  const claimed = claimTrue ? s.order : wrongBy(s.order, [-3, -2, -1, 1, 2, 3], true);
  return tf(`Iemand sê: "Hierdie ${code(s.name)} het 'n rotasie-orde van ${claimed}." Is hulle reg?`, claimTrue, {
    figure: shapeFigure(s.name, ACC),
    hint: "Rotasie-orde = hoeveel keer die vorm presies op homself pas in een volle draai (360°). Tel dit self op die prentjie.",
  });
}

/* ---------- t9b · Vergroting & skaalfaktor — Deel 2 (werk agteruit, of vergroot/verklein) ---------- */
function genEnlargeReverse() {
  const r = Math.random();
  if (r < 0.4) {
    const old = randInt(2, 8), k = randInt(2, 4), neu = old * k;
    return calc(`'n Kaart se sy word met 'n skaalfaktor van ${code(k)} vergroot na 'n nuwe sy van ${code(neu + " cm")}. Wat was die OORSPRONKLIKE sy?`, old, {
      unit: "cm", hint: "Werk AGTERUIT: deel die nuwe lengte deur die skaalfaktor.",
      solution: [{ s: `${neu} ÷ ${k} = ${old}`, r: "" }],
    });
  }
  if (r < 0.7) {
    const oldP = randInt(2, 8) * 4, k = randInt(2, 3), neuP = oldP * k;
    return calc(`'n Foto se omtrek word met 'n skaalfaktor van ${code(k)} vergroot na 'n nuwe omtrek van ${code(neuP + " cm")}. Wat was die OORSPRONKLIKE omtrek?`, oldP, {
      unit: "cm", hint: "Werk AGTERUIT: deel die nuwe omtrek deur die skaalfaktor.",
      solution: [{ s: `${neuP} ÷ ${k} = ${oldP}`, r: "" }],
    });
  }
  const old = randInt(4, 20);
  const grow = Math.random() < 0.5;
  const neu = grow ? old + randInt(1, 10) : old - randInt(1, Math.min(old - 1, 10));
  return mc(`'n Vorm se sy verander van ${code(old + " cm")} na ${code(neu + " cm")}. Is dit VERGROOT of VERKLEIN?`,
    shuffled([{ label: "vergroot", correct: grow }, { label: "verklein", correct: !grow }]), {
    hint: "Vergroot = groter geword · verklein = kleiner geword. Vergelyk die twee lengtes.",
    answerLabel: grow ? "vergroot" : "verklein",
  });
}

/* ---------- t10b · Transformasies gemeng — Deel 2 (hersiening van al die omgekeerde style) ---------- */
function genMixed2() {
  return pick([genContextName, genTranslateReverse, genReflectPointReverse, genRotateAngleReverse, genRotateDouble, genLinesReverse, genEnlargeReverse])();
}

export const CH5 = {
  t1: { skills: Array.from({ length: 5 }, () => ({ concept: "transformasie", gen: genName })) },
  t1b: { skills: Array.from({ length: 5 }, () => ({ concept: "transformasie", gen: genContextName })) },
  t2: { skills: Array.from({ length: 5 }, () => ({ concept: "translasie", gen: genTranslate })) },
  t2b: { skills: Array.from({ length: 5 }, () => ({ concept: "translasie", gen: genTranslateReverse })) },
  t3: { skills: Array.from({ length: 5 }, () => ({ concept: "rotasie", gen: genReflectAxis })) },
  t3b: { skills: shuffled([true, true, false, false, true]).map(k => ({ concept: "refleksie", gen: () => genReflectVerify(k) })) },
  t4: { skills: Array.from({ length: 5 }, () => ({ concept: "rotasie", gen: genReflectPoint })) },
  t4b: { skills: Array.from({ length: 5 }, () => ({ concept: "refleksie", gen: genReflectPointReverse })) },
  t5: { skills: Array.from({ length: 5 }, () => ({ concept: "rotasie", gen: genRotateAngle })) },
  t5b: { skills: Array.from({ length: 5 }, () => ({ concept: "rotasie", gen: genRotateAngleReverse })) },
  t6: { skills: Array.from({ length: 5 }, () => ({ concept: "rotasie", gen: genRotatePoint })) },
  t6b: { skills: Array.from({ length: 5 }, () => ({ concept: "rotasie", gen: genRotateDouble })) },
  t7: { skills: Array.from({ length: 5 }, () => ({ concept: "simmetrie", gen: genLines })) },
  t7b: { skills: Array.from({ length: 5 }, () => ({ concept: "simmetrie", gen: genLinesReverse })) },
  t8: { skills: Array.from({ length: 5 }, () => ({ concept: "simmetrie", gen: genOrder })) },
  t8b: { skills: shuffled([true, false, true, false, true]).map(k => ({ concept: "simmetrie", gen: () => genOrderVerify(k) })) },
  t9: { skills: Array.from({ length: 5 }, () => ({ concept: "vergroting", gen: genEnlarge })) },
  t9b: { skills: Array.from({ length: 5 }, () => ({ concept: "vergroting", gen: genEnlargeReverse })) },
  t10: { skills: Array.from({ length: 5 }, () => ({ concept: "transformasie", gen: genMixed })) },
  t10b: { skills: Array.from({ length: 5 }, () => ({ concept: "transformasie", gen: genMixed2 })) },
};

/* waar/onwaar-rondtes: die skill-inskrywing bepaal die ANTWOORD, so skommel
   die volgorde elke speelslag — anders kan herspeel die W/O-patroon memoriseer
   (selfde reël as hfst 3/4 se Deel-2-rondtes, sien play.js). */
for (const id of ["t3b", "t8b"]) {
  CH5[id].shuffleSkills = true;
}
