/* ============================================================
   HOOFSTUK 2 — ALGEBRAÏESE VERGELYKINGS
   ------------------------------------------------------------
   Baie sagte intrap-trap: net EEN-stap vergelykings, altyd 'n
   positiewe heelgetal-antwoord. Drill, drill, drill. Daarna die
   inset/uitset- en getalpatroon-rondtes.
   ============================================================ */
import { mc, calc, randInt, pick, shuffled, code } from "./_shared.js";

/* ---------- een-stap oplossers (antwoord altyd 'n positiewe heelgetal) ---------- */
function eqAdd() {
  const x = randInt(2, 20), a = randInt(1, 15);
  return calc(`Los op vir ${code("x")}:  ${code(`x + ${a} = ${x + a}`)}`, x, {
    answerLabel: `x = ${x}`,
    hint: `Maak x alleen: trek ${a} aan albei kante af.`,
    solution: [{ s: `x = ${x + a} − ${a}`, r: "+ word −" }, { s: `x = ${x}`, r: "" }],
  });
}
function eqMinus() {
  const a = randInt(1, 12), x = a + randInt(2, 15), b = x - a;
  return calc(`Los op vir ${code("x")}:  ${code(`x − ${a} = ${b}`)}`, x, {
    answerLabel: `x = ${x}`,
    hint: `Maak x alleen: tel ${a} aan albei kante by.`,
    solution: [{ s: `x = ${b} + ${a}`, r: "− word +" }, { s: `x = ${x}`, r: "" }],
  });
}
const eqAddSub = () => Math.random() < 0.5 ? eqAdd() : eqMinus();
function eqMul() {
  const a = randInt(2, 9), x = randInt(2, 12);
  return calc(`Los op vir ${code("x")}:  ${code(`${a}x = ${a * x}`)}`, x, {
    answerLabel: `x = ${x}`,
    hint: `${a}x beteken ${a} maal x. Doen die teenoorgestelde: deel albei kante deur ${a}.`,
    solution: [{ s: `x = ${a * x} ÷ ${a}`, r: "× word ÷" }, { s: `x = ${x}`, r: "" }],
  });
}
function eqDiv() {
  const a = randInt(2, 6), x = a * randInt(2, 10), b = x / a;
  return calc(`Los op vir ${code("x")}:  ${code(`x ÷ ${a} = ${b}`)}`, x, {
    answerLabel: `x = ${x}`,
    hint: `Doen die teenoorgestelde van deel: maal albei kante met ${a}.`,
    solution: [{ s: `x = ${b} × ${a}`, r: "÷ word ×" }, { s: `x = ${x}`, r: "" }],
  });
}
const eqMulDiv = () => Math.random() < 0.5 ? eqMul() : eqDiv();
const eqAll = () => pick([eqAdd, eqMinus, eqMul, eqDiv])();

/* ============ v9 · Inset & uitset ============ */
function genIO() {
  const m = randInt(2, 6), c = randInt(1, 9);
  if (Math.random() < 0.6) {
    const inp = randInt(2, 12), out = m * inp + c;
    return calc(`Reël: ${code(m + "n + " + c)}. As die inset ${code(inp)} is, wat is die uitset?`, out, {
      hint: `Sit n = ${inp} in: ${m}×${inp} + ${c}.`,
      solution: [{ s: `${m}(${inp}) + ${c} = ${out}`, r: "" }],
    });
  }
  const inp = randInt(2, 12), out = m * inp + c;
  return calc(`Reël: ${code(m + "n + " + c)}. As die uitset ${code(out)} is, wat is die inset?`, inp, {
    hint: `Werk terug: (${out} − ${c}) ÷ ${m}.`,
    solution: [{ s: `${out} − ${c} = ${out - c}`, r: "trek konstante af" }, { s: `${out - c} ÷ ${m} = ${inp}`, r: "deel deur koëffisiënt" }],
  });
}

/* ============ v10 · Getalpatrone ============ */
function pattern() { const d = randInt(2, 5), c = randInt(1, 6); return { d, c, T: k => d * k + c }; }
function ruleStr(d, c) { const dn = d === 1 ? "n" : `${d}n`; return c === 0 ? `Tn = ${dn}` : `Tn = ${dn} + ${c}`; }
function dedupeOpts(opts) { const seen = new Set(), out = []; for (const o of opts) if (!seen.has(o.label)) { seen.add(o.label); out.push(o); } return out; }
function genPatTerm() {
  const { d, c, T } = pattern();
  const seq = [1, 2, 3, 4].map(T).join("; ");
  const k = randInt(8, 15), ans = T(k);
  return calc(`Die ry begin ${code(seq + "; ...")} (reël ${code(ruleStr(d, c))}). Bepaal term ${code(k)}.`, ans, {
    hint: `Sit n = ${k} in die reël: ${d}×${k} + ${c}.`,
    solution: [{ s: `${d}(${k}) + ${c} = ${ans}`, r: "" }],
  });
}
function genPatPos() {
  const { d, c, T } = pattern();
  const pos = randInt(6, 20), val = T(pos);
  return calc(`Reël ${code(ruleStr(d, c))}. By watter posisie is die term ${code(val)}?`, pos, {
    hint: `Stel ${ruleStr(d, c)} = ${val} en los op vir n.`,
    solution: [{ s: `${d}n + ${c} = ${val}`, r: "" }, { s: `n = ${pos}`, r: "los op" }],
  });
}
function genPatRule() {
  const { d, c, T } = pattern();
  const seq = [1, 2, 3, 4].map(T).join("; ");
  const opts = dedupeOpts([
    { label: ruleStr(d, c), correct: true },
    { label: ruleStr(d, c + 1), correct: false },
    { label: ruleStr(d + 1, c), correct: false },
    { label: ruleStr(d + 1, c + 1), correct: false },
  ]);
  return mc(`Gee die reël vir ${code(seq + "; ...")} in die vorm ${code("Tn = dn + c")}.`, opts, {
    hint: "d = die verskil tussen terme. c = die eerste term min d.",
    answerLabel: ruleStr(d, c),
  });
}

export const CH2 = {
  v1: { skills: Array.from({ length: 5 }, () => ({ concept: "eenstap", gen: eqAddSub })) },
  v2: { skills: Array.from({ length: 5 }, () => ({ concept: "eenstap", gen: eqAddSub })) },
  v3: { skills: Array.from({ length: 5 }, () => ({ concept: "eenstap", gen: eqMul })) },
  v4: { skills: Array.from({ length: 5 }, () => ({ concept: "eenstap", gen: eqDiv })) },
  v5: { skills: Array.from({ length: 5 }, () => ({ concept: "eenstap", gen: eqMulDiv })) },
  v6: { skills: Array.from({ length: 5 }, () => ({ concept: "eenstap", gen: eqAll })) },
  v7: { skills: Array.from({ length: 5 }, () => ({ concept: "eenstap", gen: eqAll })) },
  v8: { skills: Array.from({ length: 5 }, () => ({ concept: "eenstap", gen: eqAll })) },
  v9: { skills: Array.from({ length: 5 }, () => ({ concept: "insetuitset", gen: genIO })) },
  v10: { skills: [
    { concept: "patrone", gen: genPatTerm }, { concept: "patrone", gen: genPatRule },
    { concept: "patrone", gen: genPatPos }, { concept: "patrone", gen: genPatTerm },
    { concept: "patrone", gen: genPatPos },
  ] },
};
