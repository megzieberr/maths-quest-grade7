/* ============================================================
   HOOFSTUK 2 — ALGEBRAÏESE VERGELYKINGS
   ============================================================ */
import { mc, tf, calc, randInt, pick, code } from "./_shared.js";

const V = () => pick(["x", "a", "y", "m", "p"]);

/* ============ v1 · Een-stap ============ */
function genOne() {
  const v = V(), kind = pick(["plus", "minus", "times", "div"]);
  if (kind === "plus") { const x = randInt(1, 15), a = randInt(1, 15);
    return calc(`Los op: ${code(`${v} + ${a} = ${x + a}`)}`, x, { allowNeg: true, answerLabel: `${v} = ${x}`,
      hint: `Trek ${a} aan albei kante af.`, solution: [{ s: `${v} = ${x + a} − ${a} = ${x}`, r: "+ word −" }] }); }
  if (kind === "minus") { const x = randInt(1, 15), a = randInt(1, 12);
    return calc(`Los op: ${code(`${v} − ${a} = ${x - a}`)}`, x, { allowNeg: true, answerLabel: `${v} = ${x}`,
      hint: `Tel ${a} aan albei kante by.`, solution: [{ s: `${v} = ${x - a} + ${a} = ${x}`, r: "− word +" }] }); }
  if (kind === "times") { const a = randInt(2, 9), x = randInt(2, 12);
    return calc(`Los op: ${code(`${a}${v} = ${a * x}`)}`, x, { answerLabel: `${v} = ${x}`,
      hint: `Deel albei kante deur ${a}.`, solution: [{ s: `${v} = ${a * x} ÷ ${a} = ${x}`, r: "× word ÷" }] }); }
  const a = randInt(2, 6), x = randInt(2, 9);
  return calc(`Los op: ${code(`${v}/${a} = ${x}`)}`, a * x, { answerLabel: `${v} = ${a * x}`,
    hint: `Maal albei kante met ${a}.`, solution: [{ s: `${v} = ${x} × ${a} = ${a * x}`, r: "÷ word ×" }] });
}

/* ============ v2 · Twee-stap ============ */
function genTwo() {
  const v = V(), a = randInt(2, 6), x = randInt(2, 9), b = randInt(1, 12);
  if (Math.random() < 0.5) {
    const c = a * x + b;
    return calc(`Los op: ${code(`${a}${v} + ${b} = ${c}`)}`, x, { allowNeg: true, answerLabel: `${v} = ${x}`,
      hint: `Trek eers ${b} af, deel dan deur ${a}.`,
      solution: [{ s: `${a}${v} = ${c} − ${b} = ${a * x}`, r: "konstante weg" }, { s: `${v} = ${a * x} ÷ ${a} = ${x}`, r: "koëffisiënt weg" }] });
  }
  const c = a * x - b;
  return calc(`Los op: ${code(`${a}${v} − ${b} = ${c}`)}`, x, { allowNeg: true, answerLabel: `${v} = ${x}`,
    hint: `Tel eers ${b} by, deel dan deur ${a}.`,
    solution: [{ s: `${a}${v} = ${c} + ${b} = ${a * x}`, r: "konstante weg" }, { s: `${v} = ${a * x} ÷ ${a} = ${x}`, r: "koëffisiënt weg" }] });
}

/* ============ v3 · Lastige gevalle ============ */
function genTricky() {
  const v = V(), kind = pick(["negc", "both", "negx"]);
  if (kind === "negc") { const a = randInt(2, 6), x = randInt(-6, -2), b = -a * x;
    return calc(`Los op: ${code(`−${a}${v} = ${b}`)}`, x, { allowNeg: true, answerLabel: `${v} = ${x}`,
      hint: `Deel deur −${a}. Onthou − ÷ − = +, en + ÷ − = −.`,
      solution: [{ s: `${v} = ${b} ÷ −${a} = ${x}`, r: "" }] }); }
  if (kind === "negx") { const x = randInt(-12, -2), a = randInt(2, 12), b = -x - a;
    return calc(`Los op: ${code(`−${v} − ${a} = ${b}`)}`, x, { allowNeg: true, answerLabel: `${v} = ${x}`,
      hint: `Tel ${a} by: −${v} = ${b + a}. Dan ${v} = −(${b + a}).`,
      solution: [{ s: `−${v} = ${b} + ${a} = ${b + a}`, r: "" }, { s: `${v} = ${x}`, r: "× −1" }] }); }
  // veranderlike albei kante
  const x = randInt(-6, 8), c1 = randInt(3, 9), c2 = randInt(2, c1 - 1), d1 = randInt(-4, 6);
  const d2 = c1 * x + d1 - c2 * x;
  return calc(`Los op: ${code(`${c1}${v} + ${fmtSigned(d1)} = ${c2}${v} + ${fmtSigned(d2)}`)}`, x, {
    allowNeg: true, answerLabel: `${v} = ${x}`,
    hint: "Skuif die veranderlikes na een kant en die getalle na die ander.",
    solution: [{ s: `${c1}${v} − ${c2}${v} = ${fmtSigned(d2)} ${fmtSigned(-d1)}`, r: "groepeer" }, { s: `${c1 - c2}${v} = ${(c1 - c2) * x}  →  ${v} = ${x}`, r: "" }] });
}
function fmtSigned(n) { return n < 0 ? `− ${-n}` : `+ ${n}`; }

/* ============ v4 · Toets & woordprobleme ============ */
function genTest() {
  const v = V(), a = randInt(2, 12), x = randInt(2, 12), b = x + a;
  const claim = Math.random() < 0.5;                       // wys 'n korrekte of foutiewe oplossing
  const shown = claim ? x : x + pick([-2, -1, 1, 2]);
  return tf(`Is ${code(`${v} = ${shown}`)} 'n oplossing vir ${code(`${v} + ${a} = ${b}`)}?`, (shown + a) === b, {
    labels: ["Ja", "Nee"],
    hint: `Vervang ${v} = ${shown}: LK = ${shown} + ${a}. Is dit gelyk aan ${b}?`,
    answerLabel: (shown + a) === b ? "Ja — LK = RK" : `Nee — LK = ${shown + a}, RK = ${b}`,
  });
}
function genWord() {
  const a = randInt(2, 6), num = randInt(3, 15), b = randInt(1, 12), ans = a * num - b;
  return calc(`'n Getal word met ${a} gemaal en dan word ${b} afgetrek. Die antwoord is ${code(ans)}. Wat is die getal?`, num, {
    allowNeg: true, answerLabel: `${num}`,
    hint: `Vergelyking: ${a}n − ${b} = ${ans}. Los op vir n.`,
    solution: [{ s: `${a}n = ${ans} + ${b} = ${a * num}`, r: "" }, { s: `n = ${a * num} ÷ ${a} = ${num}`, r: "" }] });
}

export const CH2 = {
  v1: { skills: Array.from({ length: 5 }, () => ({ concept: "eenstap", gen: genOne })) },
  v2: { skills: Array.from({ length: 5 }, () => ({ concept: "tweestap", gen: genTwo })) },
  v3: { skills: Array.from({ length: 5 }, () => ({ concept: "spesiaal", gen: genTricky })) },
  v4: { skills: [
    { concept: "toets", gen: genTest }, { concept: "toets", gen: genWord },
    { concept: "toets", gen: genTest }, { concept: "toets", gen: genWord },
    { concept: "toets", gen: genTest },
  ] },
};
