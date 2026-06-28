/* ============================================================
   HOOFSTUK 1 — ALGEBRAÏESE UITDRUKKINGS
   Eerste kennismaking met letters: identifiseer die dele,
   herken gelyksoortige terme, kombineer hulle, en vervang.
   ============================================================ */
import { mc, mcFrom, calc, multi, randInt, pick, shuffled, distinct, code } from "./_shared.js";

const VARS = ["a", "b", "c", "m", "n", "p", "k", "t", "x", "y"];
const SUP = "²", SUP3 = "³";

/* bou 'n uitdrukking-string uit terme [{coef, vars}] (positiewe koëffisiënte) */
function renderExpr(terms) {
  return terms.map((t, i) => {
    const body = t.vars && t.coef === 1 ? t.vars : `${t.coef}${t.vars}`;
    return i === 0 ? body : ` + ${body}`;
  }).join("");
}

/* ============ u1 · Veranderlike & koëffisiënt ============ */
function genVariable() {
  const v = pick(VARS);
  const coef = randInt(2, 9);
  let cst = randInt(2, 9); if (cst === coef) cst = coef === 9 ? 2 : coef + 1;
  const expr = renderExpr([{ coef, vars: v }, { coef: cst, vars: "" }]);
  return mc(`Wat is die <b>veranderlike</b> in ${code(expr)}?`,
    shuffled([
      { label: v, correct: true },
      { label: String(coef), correct: false },
      { label: String(cst), correct: false },
      { label: pick(VARS.filter(x => x !== v)), correct: false },
    ]), {
    hint: "Die veranderlike is die letter — die simbool wat vir 'n onbekende getal staan.",
    answerLabel: v,
  });
}
function genCoef() {
  const v = pick(VARS), coef = randInt(2, 9);
  let cst = randInt(2, 9); if (cst === coef) cst = coef === 9 ? 2 : coef + 1;
  const expr = renderExpr([{ coef, vars: v }, { coef: cst, vars: "" }]);
  return mc(`Wat is die <b>koëffisiënt</b> van ${code(v)} in ${code(expr)}?`,
    shuffled([
      { label: String(coef), correct: true },
      { label: v, correct: false },
      { label: String(cst), correct: false },
      { label: String(randInt(2, 9) + 9), correct: false },
    ]), {
    hint: "Die koëffisiënt is die getal vlak vóór die veranderlike.",
    answerLabel: String(coef),
  });
}

/* ============ u2 · Konstante & eksponent ============ */
function genConstant() {
  const v = pick(VARS), coef = randInt(2, 9);
  let cst = randInt(2, 12); if (cst === coef) cst = coef + 3;
  const expr = renderExpr([{ coef, vars: v }, { coef: cst, vars: "" }]);
  return mc(`Wat is die <b>konstante</b> in ${code(expr)}?`,
    shuffled([
      { label: String(cst), correct: true },
      { label: String(coef), correct: false },
      { label: v, correct: false },
      { label: String(coef + cst), correct: false },
    ]), {
    hint: "Die konstante is die getal heeltemal op sy eie — sonder 'n veranderlike.",
    answerLabel: String(cst),
  });
}
function genExponent() {
  const v = pick(VARS), coef = randInt(4, 9), exp = pick([2, 3]);
  const expr = `${coef}${v}${exp === 2 ? SUP : SUP3}`;
  return mc(`Wat is die <b>eksponent</b> (die mag) in ${code(expr)}?`,
    shuffled([
      { label: String(exp), correct: true },
      { label: String(coef), correct: false },
      { label: String(exp === 2 ? 3 : 2), correct: false },
      { label: "1", correct: false },
    ]), {
    hint: "Die eksponent is die klein getalletjie regs-bo. By <code>a³</code> is dit 3.",
    answerLabel: String(exp),
  });
}

/* ============ u3 · Gelyksoortige terme (kies almal) ============ */
function genLike() {
  const v = pick(VARS);
  const sq = Math.random() < 0.5 ? SUP : "";
  const a = v + sq;
  const other = pick(VARS.filter(x => x !== v));
  const c1 = randInt(2, 9), c2 = randInt(2, 9);
  const pool = [
    { label: `${c1}${a}`, correct: true },
    { label: `${c2}${a}`, correct: true },
    { label: `${randInt(2, 9)}${other}`, correct: false },
    { label: `${randInt(2, 9)}${v}${sq ? "" : SUP}`, correct: false },
  ];
  return multi(`Kies AL die terme wat gelyksoortig is met ${code(a)}.`, pool, {
    hint: "Gelyksoortig = presies dieselfde veranderlike(s) en magte. Net die getal mag verskil.",
    answerLabel: `${c1}${a} en ${c2}${a}`,
  });
}

/* ============ u4 · Tel terme op en trek af ============ */
function genCombine() {
  const v = pick(VARS);
  const sq = Math.random() < 0.25 ? SUP : "";
  const a = v + sq;
  const sub = Math.random() < 0.45;
  let c1, c2;
  if (sub) { c1 = randInt(5, 9); c2 = randInt(2, c1 - 1); }
  else { c1 = randInt(2, 7); c2 = randInt(2, 7); if (c2 === c1) c2 = c1 + 1; }
  const ans = sub ? c1 - c2 : c1 + c2;
  const expr = `${c1}${a} ${sub ? "−" : "+"} ${c2}${a}`;
  const labels = new Set(), opts = [];
  const add = (label, correct) => { if (!labels.has(label)) { labels.add(label); opts.push({ label, correct }); } };
  add(`${ans}${a}`, true);
  add(`${c1 * c2}${a}`, false);
  add(`${ans}`, false);
  add(`${sub ? c1 + c2 : Math.abs(c1 - c2)}${a}`, false);
  return mc(`Vereenvoudig: ${code(expr)}`, shuffled(opts), {
    hint: "Tel net die getalle (koëffisiënte) op of trek af — die veranderlike bly dieselfde.",
    answerLabel: `${ans}${a}`,
  });
}

/* ============ u5 · Vervang en bereken ============ */
function genSub() {
  const kind = pick(["lin", "two", "sq"]);
  if (kind === "lin") {
    const a = randInt(2, 6), y = randInt(2, 9), b = randInt(2, 9);
    const ans = a * y + b;
    return calc(`As ${code("y = " + y)}, bereken ${code(a + "y + " + b)}.`, ans, {
      hint: `Vervang y met ${y}: ${a}×${y} + ${b}.`,
      solution: [{ s: `${a}(${y}) + ${b}`, r: "vervang y" }, { s: `${a * y} + ${b} = ${ans}`, r: "" }],
    });
  }
  if (kind === "sq") {
    const a = randInt(2, 4), b = randInt(2, 5), add = randInt(1, 8);
    const ans = a * b * b + add;
    return calc(`As ${code("b = " + b)}, bereken ${code(a + "b" + SUP + " + " + add)}.`, ans, {
      hint: `Kwadreer eers b: ${b}×${b} = ${b * b}. Maal dan met ${a}, tel ${add} by.`,
      solution: [{ s: `${a}(${b})${SUP} + ${add}`, r: "vervang b" }, { s: `${a}(${b * b}) + ${add} = ${ans}`, r: "" }],
    });
  }
  const a = randInt(2, 7), b = randInt(2, 7), c = randInt(2, 7);
  const ans = 3 * a + b - c;
  return calc(`As ${code("a = " + a)}, ${code("b = " + b)} en ${code("c = " + c)}, bereken ${code("3a + b − c")}.`, ans, {
    allowNeg: true,
    hint: `3×${a} + ${b} − ${c}.`,
    solution: [{ s: `3(${a}) + ${b} − ${c}`, r: "vervang" }, { s: `${3 * a} + ${b} − ${c} = ${ans}`, r: "" }],
  });
}

export const CH1 = {
  u1: { skills: [
    { concept: "dele", gen: genVariable }, { concept: "dele", gen: genCoef },
    { concept: "dele", gen: genVariable }, { concept: "dele", gen: genCoef },
    { concept: "dele", gen: genVariable },
  ] },
  u2: { skills: [
    { concept: "dele", gen: genConstant }, { concept: "dele", gen: genExponent },
    { concept: "dele", gen: genConstant }, { concept: "dele", gen: genExponent },
    { concept: "dele", gen: genConstant },
  ] },
  u3: { skills: Array.from({ length: 5 }, () => ({ concept: "gelyksoortig", gen: genLike })) },
  u4: { skills: Array.from({ length: 5 }, () => ({ concept: "kombineer", gen: genCombine })) },
  u5: { skills: Array.from({ length: 5 }, () => ({ concept: "vervang", gen: genSub })) },
};
