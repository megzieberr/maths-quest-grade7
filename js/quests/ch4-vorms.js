/* ============================================================
   HOOFSTUK 4 — 2D VORMS  (met diagramme)
   Driehoeke, vierhoeke, poligone, die sirkel (incl. 'n tik-rondte)
   en kongruent vs gelykvormig.
   ============================================================ */
import { mc, tf, calc, tap, multi, randInt, pick, shuffled, code } from "./_shared.js";
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

/* ============================================================
   DEEL 2 — hersiening-rondtes (s1b–s10b)
   ------------------------------------------------------------
   Nooit 'n Deel-1-sjabloon met vars getalle nie — elke rondte kry
   'n EGTE nuwe vraagstyl: die rigting omgekeer, 'n nuwe konteks, of
   'n waar/onwaar-nagaan-meganika i.p.v. Deel 1 se identifiseer-
   meganika (sien ch3-meetkunde.js se Deel 2 vir dieselfde patroon).
   s3b is die enigste rondte met 'n EGTE geTEKENDE hoekfiguur (die
   gelykbenige driehoek se apex+basishoeke), so dis die enigste een
   met _chk — sien tools/verify-stellings-core.mjs. Die ander s-b-
   rondtes se figure (driehoek-soort, sirkeldele, kongruent) teken
   nooit 'n meetbare booghoek nie, dus geen _chk nodig nie.
   Waar/onwaar is 'n antwoord-bepalende keuse, so elke sulke rondte
   se skills-lys word EENMAAL geskommel gebou (die st20/st24-patroon
   — 'n gedwonge mengsel, nooit 'n coin-flip BINNE een gen nie). */

/* kies 'n "amper reg" vals getal — altyd positief, nooit gelyk aan trueVal nie */
function wrongBy(trueVal, deltas = [-20, -15, -10, 10, 15, 20]) {
  const pool = shuffled(deltas);
  for (const d of pool) { const v = trueVal + d; if (v > 0 && v !== trueVal) return v; }
  return trueVal + 5;   // noodval, behoort nooit bereik te word nie
}

/* ---------- s1b · Driehoeke volgens sye — Deel 2 (waar of onwaar 'n bewering) ---------- */
function genTriBySidesTF(claimTrue) {
  const kinds = ["gelyksydig", "gelykbenig", "ongelyksydig"];
  const kind = pick(kinds);
  // 'n gelyksydige driehoek IS streng gesproke ook gelykbenig (2 sye is mos gelyk) —
  // daardie bewering mag nooit as ONWAAR gemerk word nie, so laat dit heeltemal uit.
  const falsePool = kinds.filter(k => k !== kind && !(kind === "gelyksydig" && k === "gelykbenig"));
  const claimed = claimTrue ? kind : pick(falsePool);
  return tf(`Iemand sê: "Dit is 'n <b>${claimed}</b> driehoek (volgens sye)." Is hulle reg?`, claimTrue, {
    figure: triangleFigure(kind, ORANGE),
    hint: "Die merkies wys gelyke sye: 3 gelyk = gelyksydig · 2 gelyk = gelykbenig · geen gelyk = ongelyksydig.",
  });
}

/* ---------- s2b · Driehoeke volgens hoeke — Deel 2 (waar of onwaar 'n bewering) ---------- */
function genTriByAnglesTF(claimTrue) {
  const kinds = ["skerphoekig", "reghoekig", "stomphoekig"];
  const kind = pick(kinds);
  const claimed = claimTrue ? kind : pick(kinds.filter(k => k !== kind));
  return tf(`Iemand sê: "Dit is 'n <b>${claimed}</b> driehoek (volgens hoeke)." Is hulle reg?`, claimTrue, {
    figure: triangleFigure(kind, ORANGE),
    hint: "Regtehoek-blokkie (90°) → reghoekig · een hoek groter as 90° → stomphoekig · al die hoeke skerp → skerphoekig.",
  });
}

/* ---------- s3b · Binnehoeke van 'n driehoek — Deel 2 (gaan 'n bewering na, met egte hoeke) ---------- */
function genAngleSumTF(claimTrue) {
  const top = randInt(15, 60) * 2;              // 30…120 — die apex-reël
  const trueBase = (180 - top) / 2;
  const claimed = claimTrue ? trueBase : wrongBy(trueBase, [-10, -8, -5, 5, 8, 10]);
  return tf(`'n Gelykbenige driehoek het 'n tophoek van ${code(top + "°")}. Iemand sê elke basishoek is ${code(claimed + "°")}. Is hulle reg?`, claimTrue, {
    // hide:"base" — die basishoeke wys as "?" sodat die figuur nie die
    // antwoord op die bewering weggee (of dit weerspreek) nie.
    figure: triangleFigure("gelykbenig", ORANGE, { apex: top, hide: "base" }),
    hint: "Die drie hoeke van 'n driehoek tel altyd saam op tot 180°. (180 − tophoek) ÷ 2 = elke basishoek.",
    _chk: { figKind: "gelykbenig", values: [top, trueBase, trueBase], apex: top, hideIndex: 1, allShown: false },
  });
}

/* ---------- s4b · Vierhoeke — Deel 2 (beskrywing → naam) ---------- */
const QUAD_DESC = {
  vierkant: "4 gelyke sye ÉN 4 regte hoeke.",
  reghoek: "2 pare gelyke sye ÉN 4 regte hoeke, maar nie al 4 sye ewe lank nie.",
  ruit: "4 gelyke sye, maar GEEN regte hoeke nie.",
  parallelogram: "2 pare ewewydige sye en 2 pare gelyke sye, maar nie al 4 sye ewe lank nie en geen regte hoeke nie.",
  trapesium: "net EEN paar ewewydige sye.",
  vlieer: "2 pare langsaan-liggende gelyke sye, en geen paar sye is ewewydig nie.",
};
function genQuadReverse() {
  const q = pick(QUADS);
  const distract = shuffled(QUADS.filter(x => x.key !== q.key)).slice(0, 3);
  return mc(`Watter vierhoek het ${QUAD_DESC[q.key]}`,
    shuffled([{ label: q.name, correct: true }, ...distract.map(d => ({ label: d.name, correct: false }))]), {
    hint: "Tel gelyke sye, regte hoeke en ewewydige sye — elke vierhoek se eie kombinasie is uniek.",
    answerLabel: q.name,
  });
}

/* ---------- s5b · Poligone — Deel 2 (regte-lewe voorbeeld → naam) ---------- */
const POLY_CONTEXT = [
  { sides: 3, name: "driehoek", ex: "'n Waarskuwingsteken langs die pad (▲)" },
  { sides: 4, name: "vierhoek", ex: "'n Los A4-vel papier" },
  { sides: 5, name: "pentagoon", ex: "Elke swart lappie op 'n sokkerbal" },
  { sides: 6, name: "heksagoon", ex: "'n Sel in 'n heuningkoek" },
  { sides: 8, name: "oktagoon", ex: "'n STOP-verkeersteken" },
];
function genPolyContext() {
  const it = pick(POLY_CONTEXT);
  const distract = shuffled(POLY.filter(p => p.sides !== it.sides)).slice(0, 3);
  return mc(`${it.ex} het die vorm van watter poligoon?`,
    shuffled([{ label: it.name, correct: true }, ...distract.map(d => ({ label: d.name, correct: false }))]), {
    hint: "Tel hoeveel sye die voorbeeld het, en pas dit by die poligoon se naam.",
    answerLabel: it.name,
  });
}

/* ---------- s6b · Dele van 'n sirkel — Deel 2 (beskrywing → naam) ---------- */
const CIRCLE_DESC = {
  radius: "'n Reguit lyn van die middelpunt na die rand.",
  middellyn: "'n Reguit lyn wat DEUR die middelpunt gaan, van rand tot rand.",
  koord: "'n Reguit lyn tussen twee randpunte wat NIE deur die middelpunt gaan nie.",
  sektor: "'n “Pizza-snytjie”-vorm tussen twee radiusse en 'n boog.",
  omtrek: "Die afstand heeltemal rondom die sirkel.",
  boog: "'n Stukkie van die sirkel se rand.",
};
function genCirclePartReverse() {
  const it = pick(CIRCLE_PARTS);
  const distract = shuffled(CIRCLE_PARTS.filter(p => p.key !== it.key)).slice(0, 3);
  return mc(CIRCLE_DESC[it.key],
    shuffled([{ label: it.name, correct: true }, ...distract.map(d => ({ label: d.name, correct: false }))]), {
    hint: "Radius: middel→rand. Middellyn: oor die sirkel deur die middel. Koord: twee randpunte (nie deur die middel). Sektor: 'n “pizza-snytjie”. Boog: 'n stuk van die rand.",
    answerLabel: it.name,
  });
}

/* ---------- s7b · Tik die sirkeldeel — Deel 2 (beskrywing i.p.v. naam) ---------- */
const TAP_PARTS_DESC = [
  { key: "koord", q: "Tik die lyn wat twee randpunte verbind, maar NIE deur die middelpunt gaan nie." },
  { key: "middelpunt", q: "Tik die punt heel binne-in die sirkel, in die middel." },
  { key: "radius", q: "Tik die lyn wat van die middelpunt af reguit na die rand toe loop." },
  { key: "boog", q: "Tik 'n stukkie van die sirkel se buitenste rand self." },
];
function genCircleTapReverse() {
  const t = pick(TAP_PARTS_DESC);
  return tap(t.q, t.key, circleTapFigure(t.key, ORANGE), {
    hint: "Middelpunt = die kol in die middel · radius = lyn van die middel na die rand · koord = lyn tussen twee randpunte · boog = 'n stuk van die rand self.",
    answerLabel: { koord: "die koord", middelpunt: "die middelpunt", radius: "die radius", boog: "die boog" }[t.key],
  });
}

/* ---------- s8b · Radius & middellyn — Deel 2 (waar of onwaar 'n bewering) ---------- */
function genDiameterTF(claimTrue) {
  const r = randInt(2, 15);
  const trueD = 2 * r;
  const claimed = claimTrue ? trueD : wrongBy(trueD, [-6, -4, -2, 2, 4, 6]);
  return tf(`'n Sirkel het 'n radius van ${code(r + " cm")}. Iemand sê die middellyn is ${code(claimed + " cm")}. Is hulle reg?`, claimTrue, {
    figure: circleFigure("radius", ORANGE),
    hint: "Middellyn = 2 × radius. Vermenigvuldig die radius met 2 en vergelyk met die bewering.",
  });
}

/* ---------- s9b/s10b · Kongruent of gelykvormig — Deel 2 (waar of onwaar 'n stelling) ----------
   Elke bewering se waarheid is VAS (nie 'n coin-flip binne een gen nie) — daarom EEN
   funksie per bewering, dan die lys self geskommel gebou (soos CH3 se m2b-patroon). */
function claimQ(text, isTrue) {
  // GEEN figuur nie: die bewerings is algemene stellings, en 'n lukraak gekose
  // kongruent/gelykvormig-prentjie kan die teks visueel weerspreek en mislei.
  return () => tf(text, isTrue, {
    hint: "Kongruent = presies dieselfde vorm ÉN dieselfde grootte. Gelykvormig = dieselfde vorm, maar 'n ander grootte.",
  });
}
const CONGRUENT_CLAIMS = [
  claimQ("Kongruente vorms het presies dieselfde vorm ÉN dieselfde grootte.", true),
  claimQ("Gelykvormige vorms het dieselfde vorm, maar kan 'n ANDER grootte hê.", true),
  claimQ("Kongruente vorms kan verskillende groottes hê, solank hulle dieselfde vorm het.", false),
  claimQ("Gelykvormige vorms moet altyd presies dieselfde grootte wees.", false),
  claimQ("Twee vorms wat kongruent is, is OOK altyd gelykvormig.", true),
];

/* ============================================================
   S13 — Eienskappe van vorms (NUUT, nie 'n Deel-2-hersiening nie)
   ------------------------------------------------------------
   Die vraag gee die vierhoek se NAAM ÉN 'n SKOON figuur (geen
   merkies/pyltjies/blokkies nie — quadPropsFigure met decor:"none"
   + tapSides/tapCorners af het toe al geen dekorasie of tik-areas
   nie, sien engine/diagrams.js), en vra "kies AL die eienskappe".
   'n Kind moet dus die eienskappe ONTHOU, nie van die prent aflees
   nie — haar eksplisiete ontwerp-eis.

   S_TRUTH is die BRON VAN WAARHEID: vir elke vierhoek-sleutel, vir
   elke eienskap-id, true/false — of die sleutel WORD WEGGELAAT as
   die eienskap wel WAAR is vir daardie vorm, maar nie een van sy
   "kern"-eienskappe is nie (bv. 'n vierkant IS ook 'n reghoek/ruit/
   parallelogram, dus "teenoorstaande sye ewe lank" ens. is tegnies
   waar — dit verskyn NOOIT as 'n vals afleier nie, dit word bloot
   heeltemal weggelaat uit die vierkant se lys). Elke vorm se "true"-
   stel is haar bevestigde voorbeeld vir vierkant (4 korrek: al 4 sye
   ewe lank · teenoorstaande sye parallel · al 4 hoeke 90° · hoeklyne
   ewe lank) — sien tools/fuzz-s13.mjs vir die outomatiese nagaan
   teen hierdie tabel. */
const S_PROPS = [
  { id: "allEq", label: "Al 4 sye is ewe lank" },
  { id: "oppEq", label: "Teenoorstaande sye is ewe lank" },
  { id: "adjEq", label: "Twee pare AANGRENSENDE sye is ewe lank" },
  { id: "allDiff", label: "Al 4 sye is verskillende lengtes" },
  { id: "oppPar", label: "Teenoorstaande sye is parallel" },
  { id: "onePar", label: "Net EEN paar sye is parallel" },
  { id: "noPar", label: "Geen paar sye is parallel nie" },
  { id: "allRight", label: "Al 4 hoeke is 90°" },
  { id: "twoRight", label: "Net twee van die hoeke is 90°" },
  { id: "noRight", label: "Geen hoek is 90° nie" },
  { id: "diagEq", label: "Die hoeklyne is ewe lank" },
  { id: "diagPerp", label: "Die hoeklyne is loodreg (90° by mekaar)" },
  { id: "onePairEq", label: "Net EEN paar sye is ewe lank" },
];
const S_TRUTH = {
  vierkant: { allEq: true, allDiff: false, oppPar: true, onePar: false, noPar: false,
    allRight: true, twoRight: false, noRight: false, diagEq: true, onePairEq: false },
  reghoek: { allEq: false, oppEq: true, adjEq: false, allDiff: false, oppPar: true, onePar: false, noPar: false,
    allRight: true, twoRight: false, noRight: false, diagEq: true, diagPerp: false, onePairEq: false },
  ruit: { allEq: true, allDiff: false, oppPar: true, onePar: false, noPar: false,
    allRight: false, twoRight: false, noRight: true, diagEq: false, diagPerp: true, onePairEq: false },
  parallelogram: { allEq: false, oppEq: true, adjEq: false, allDiff: false, oppPar: true, onePar: false, noPar: false,
    allRight: false, twoRight: false, noRight: true, diagEq: false, diagPerp: false, onePairEq: false },
  trapesium: { allEq: false, oppEq: false, adjEq: false, allDiff: true, oppPar: false, onePar: true, noPar: false,
    allRight: false, twoRight: false, noRight: true, diagEq: false, diagPerp: false, onePairEq: false },
  vlieer: { allEq: false, oppEq: false, adjEq: true, allDiff: false, oppPar: false, onePar: false, noPar: true,
    allRight: false, twoRight: false, noRight: true, diagEq: false, diagPerp: true, onePairEq: false },
};
function buildQuadPropOptions(key) {
  const truth = S_TRUTH[key];
  return S_PROPS.filter(p => truth[p.id] !== undefined).map(p => ({ label: p.label, correct: truth[p.id] }));
}
/* Die GEDEELDE QUADS-koordinate is ontwerp om saam met merkies gelees te word:
   sonder versiering lyk daardie trapesium se bene gelyk (108 vs 111 px) en die
   vlieër soos 'n ruit met vier 90°-hoeke (85,8°–92,6°). Vir s13 se skoon figure
   kry dié twee vorms dus OORDREWE koordinate — bene 20%+ verskillend, hoeke
   ≥10° weg van 90° — sodat wat die kind SIEN nooit die waarheidstabel weerspreek
   nie. s4/s11/s12 se gedeelde punte bly onaangeraak (opt.pts is opt-in). */
const S13_CLEAN_PTS = {
  trapesium: [[105, 42], [175, 42], [215, 138], [25, 138]],   // sye 70/104/190/125 · hoeke 130/113/67/50
  vlieer: [[120, 22], [175, 66], [120, 168], [65, 66]],       // sye 70,4/115,9 pare · hoeke 103/100/57/100
};
function genShapeProps(key) {
  const q = QUADS.find(x => x.key === key);
  const opts = buildQuadPropOptions(key);
  return multi(`Watter eienskappe pas by hierdie <b>${q.name}</b>?`, opts, {
    figure: quadPropsFigure(key, ORANGE, { decor: "none", tapSides: false, tapCorners: false, pts: S13_CLEAN_PTS[key] }),
    instruction: "Tap AL die eienskappe wat pas, dan Stuur.",
    hint: "Dink aan die sye, dan die hoeke, dan die hoeklyne — tel hoeveel van elke soort gelyk is.",
  });
}

export const CH4 = {
  s1: { skills: Array.from({ length: 5 }, () => ({ concept: "driehoeke", gen: genTriBySides })) },
  s1b: { skills: shuffled([true, true, false, false, true]).map(k => ({ concept: "driehoeke", gen: () => genTriBySidesTF(k) })) },
  s2: { skills: Array.from({ length: 5 }, () => ({ concept: "driehoeke", gen: genTriByAngles })) },
  s2b: { skills: shuffled([true, false, true, false, true]).map(k => ({ concept: "driehoeke", gen: () => genTriByAnglesTF(k) })) },
  s3: { skills: Array.from({ length: 5 }, () => ({ concept: "hoeksom", gen: genAngleSum })) },
  s3b: { skills: shuffled([true, true, false, false, true]).map(k => ({ concept: "hoeksom", gen: () => genAngleSumTF(k) })) },
  s4: { skills: Array.from({ length: 5 }, () => ({ concept: "vierhoeke", gen: genQuad })) },
  s4b: { skills: Array.from({ length: 5 }, () => ({ concept: "vierhoeke", gen: genQuadReverse })) },
  s5: { skills: Array.from({ length: 5 }, () => ({ concept: "poligone", gen: genPoly })) },
  s5b: { skills: Array.from({ length: 5 }, () => ({ concept: "poligone", gen: genPolyContext })) },
  s6: { skills: Array.from({ length: 5 }, () => ({ concept: "sirkeldele", gen: genCirclePart })) },
  s6b: { skills: Array.from({ length: 5 }, () => ({ concept: "sirkeldele", gen: genCirclePartReverse })) },
  s7: { skills: Array.from({ length: 5 }, () => ({ concept: "sirkeldele", gen: genCircleTap })) },
  s7b: { skills: Array.from({ length: 5 }, () => ({ concept: "sirkeldele", gen: genCircleTapReverse })) },
  s8: { skills: Array.from({ length: 5 }, () => ({ concept: "sirkeldele", gen: genDiameter })) },
  s8b: { skills: shuffled([true, true, false, false, true]).map(k => ({ concept: "sirkeldele", gen: () => genDiameterTF(k) })) },
  s9: { skills: Array.from({ length: 5 }, () => ({ concept: "kongruent", gen: genCongruent })) },
  s9b: { skills: shuffled(CONGRUENT_CLAIMS).map(gen => ({ concept: "kongruent", gen })) },
  s10: { skills: Array.from({ length: 5 }, () => ({ concept: "kongruent", gen: genCongruent })) },
  s10b: { skills: shuffled(CONGRUENT_CLAIMS).map(gen => ({ concept: "kongruent", gen })) },
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
  /* 5 van die 6 vierhoeke, geen herhaling: shuffled(QUADS).slice(0,5) kies
     5 UNIEKE vorms sodra hierdie module laai (dieselfde patroon as s9b se
     CONGRUENT_CLAIMS en s11/s12 hierbo). Elke skill se gen() is 'n GESLOTE
     funksie oor SY EIE vorm — 'n herprobeer ("Probeer 'n soortgelyke een")
     wys dus weer DIESELFDE vorm se vraag (soos s9b se claimQ-patroon), nie
     'n nuwe lukrake vorm wat die 5-uit-6-waarborg kon breek nie. */
  s13: { skills: shuffled(QUADS).slice(0, 5).map(q => ({ concept: "vierhoeke", gen: () => genShapeProps(q.key) })) },
};

/* waar/onwaar-rondtes: die skill-inskrywing bepaal die ANTWOORD, so skommel
   die volgorde elke speelslag — anders kan herspeel die W/O-patroon memoriseer
   (selfde reël as hfst 3 se Deel-2-rondtes, sien play.js). */
for (const id of ["s1b", "s2b", "s3b", "s8b", "s9b", "s10b"]) {
  CH4[id].shuffleSkills = true;
}
