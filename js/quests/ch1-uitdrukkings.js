/* ============================================================
   HOOFSTUK 1 — ALGEBRAÏESE UITDRUKKINGS
   ============================================================ */
import { mc, mcFrom, tf, calc, multi, randInt, pick, shuffled, distinct, code, fmt } from "./_shared.js";

const VARS = ["a", "b", "c", "d", "m", "n", "p", "k", "t", "h"];
const SUP = "²";

/* ----- klein algebra-helpers ----- */
function renderExpr(terms) {
  return terms.map((t, i) => {
    const mag = Math.abs(t.coef);
    const body = (t.vars && mag === 1) ? t.vars : `${mag}${t.vars}`;
    if (i === 0) return (t.coef < 0 ? "−" : "") + body;
    return (t.coef < 0 ? " − " : " + ") + body;
  }).join("");
}

/* ============ u1 · Dele van 'n uitdrukking ============ */
function genCount() {
  const n = randInt(2, 4);
  const vpool = shuffled(VARS);
  const terms = [];
  for (let i = 0; i < n; i++) {
    const coef = randInt(2, 9) * (Math.random() < 0.3 ? -1 : 1);
    let vars = (i === n - 1 && Math.random() < 0.45) ? "" : vpool[i];
    if (vars && Math.random() < 0.22) vars += SUP;
    terms.push({ coef, vars });
  }
  const expr = renderExpr(terms);
  return mcFrom(`Hoeveel terme is in ${code(expr)}?`, n, distinct(n, [n - 1, n + 1, n + 2, 1]), {
    hint: "Terme word deur 'n + of − geskei. Tel die los stukke.",
  });
}
function genCoef() {
  const n = randInt(3, 4);
  const vpool = shuffled(VARS);
  const terms = [];
  for (let i = 0; i < n; i++) {
    const coef = randInt(2, 9) * (Math.random() < 0.35 ? -1 : 1);
    const vars = (i === n - 1 && Math.random() < 0.4) ? "" : vpool[i];
    terms.push({ coef, vars });
  }
  const target = pick(terms.filter(t => t.vars));
  const expr = renderExpr(terms);
  return mcFrom(`Wat is die koëffisiënt van ${code(target.vars)} in ${code(expr)}?`, target.coef,
    distinct(target.coef, [-target.coef, Math.abs(target.coef), randInt(2, 9), randInt(2, 9)]), {
    hint: "Die koëffisiënt is die getal (met sy teken) vlak vóór die veranderlike.",
  });
}
function genConstant() {
  const n = randInt(3, 4);
  const vpool = shuffled(VARS);
  const terms = [];
  for (let i = 0; i < n - 1; i++) terms.push({ coef: randInt(2, 9) * (Math.random() < 0.3 ? -1 : 1), vars: vpool[i] });
  const cst = randInt(2, 12) * (Math.random() < 0.4 ? -1 : 1);
  terms.push({ coef: cst, vars: "" });
  const expr = renderExpr(shuffled(terms));
  return mcFrom(`Wat is die konstante in ${code(expr)}?`, cst,
    distinct(cst, [-cst, Math.abs(cst), terms[0].coef, randInt(2, 9)]), {
    hint: "Die konstante is die getal heeltemal op sy eie — sonder 'n veranderlike.",
  });
}

/* ============ u2 · Gelyksoortige terme ============ */
function genLike() {
  const v = pick(VARS);
  const sq = Math.random() < 0.5 ? SUP : "";
  const a = v + sq;                         // bv. "a²"
  const other = pick(VARS.filter(x => x !== v));
  // twee gelyksoortige (a) + 'n paar afleiers
  const c1 = randInt(2, 9), c2 = randInt(2, 9);
  const pool = [
    { label: `${c1}${a}`, correct: true },
    { label: `${c2}${a}`, correct: true },
    { label: `${randInt(2, 9)}${other}`, correct: false },
    { label: `${randInt(2, 9)}${v}${sq ? "" : SUP}`, correct: false }, // selfde letter, ander mag
  ];
  return multi(`Kies AL die terme wat gelyksoortig is met ${code(a)}.`, pool, {
    hint: "Gelyksoortig = presies dieselfde veranderlike(s) en magte. Net die getal mag verskil.",
    answerLabel: `${c1}${a} en ${c2}${a}`,
  });
}

/* ============ u3 · Vervang en bereken ============ */
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
  // 3 veranderlikes
  const a = randInt(2, 7), b = randInt(2, 7), c = randInt(2, 7);
  const ans = 3 * a + b - c;
  return calc(`As ${code("a = " + a)}, ${code("b = " + b)} en ${code("c = " + c)}, bereken ${code("3a + b − c")}.`, ans, {
    allowNeg: true,
    hint: `3×${a} + ${b} − ${c}.`,
    solution: [{ s: `3(${a}) + ${b} − ${c}`, r: "vervang" }, { s: `${3 * a} + ${b} − ${c} = ${ans}`, r: "" }],
  });
}

/* ============ u4 · Inset & uitset ============ */
function genIO() {
  const m = randInt(2, 6), c = randInt(1, 9);
  const forward = Math.random() < 0.6;
  if (forward) {
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

/* ============ u5 · Skryf uit woorde ============ */
function genWords() {
  const a = randInt(2, 9), b = randInt(2, 9);
  const v = pick(["x", "n", "y"]);
  const forms = [
    { words: `${woord(a)} keer ${code(v)} plus ${b}`, ans: `${a}${v} + ${b}`, distract: [`${a} + ${v} + ${b}`, `${v} + ${a + b}`, `${a}${v} − ${b}`] },
    { words: `${b} meer as ${woord(a)} keer ${code(v)}`, ans: `${a}${v} + ${b}`, distract: [`${a}${v} − ${b}`, `${b}${v} + ${a}`, `${a + b}${v}`] },
    { words: `${woord(a)} keer ${code(v)}, en trek dit van ${b} af`, ans: `${b} − ${a}${v}`, distract: [`${a}${v} − ${b}`, `${b}${v} − ${a}`, `${a}${v} + ${b}`] },
  ];
  const f = pick(forms);
  const opts = [{ label: f.ans, correct: true }, ...f.distract.map(d => ({ label: d, correct: false }))];
  return mc(`Skryf as 'n uitdrukking: ${f.words}.`, opts, {
    hint: "“keer” = maal (skryf sonder ×). Let op die volgorde by aftrek.",
    answerLabel: f.ans,
  });
}
function woord(n) { return ["nul", "een", "twee", "drie", "vier", "vyf", "ses", "sewe", "agt", "nege"][n] || String(n); }

/* ============ u6 · Getalpatrone ============ */
function pattern() {
  const d = randInt(2, 5) * (Math.random() < 0.25 ? -1 : 1);
  const c = randInt(-4, 6);
  const T = k => d * k + c;
  return { d, c, T };
}
function genPatTerm() {
  const { d, c, T } = pattern();
  const seq = [1, 2, 3, 4].map(T).join("; ");
  const k = randInt(8, 15), ans = T(k);
  return calc(`Die ry begin ${code(seq + "; ...")} (reël ${code(ruleStr(d, c))}). Bepaal term ${code(k)}.`, ans, {
    allowNeg: true,
    hint: `Sit n = ${k} in die reël: ${d}×${k} ${c < 0 ? "− " + (-c) : "+ " + c}.`,
    solution: [{ s: `${d}(${k}) ${c < 0 ? "− " + (-c) : "+ " + c} = ${ans}`, r: "" }],
  });
}
function genPatPos() {
  const { d, c, T } = pattern();
  const pos = randInt(6, 20), val = T(pos);
  return calc(`Reël ${code(ruleStr(d, c))}. By watter posisie is die term ${code(val)}?`, pos, {
    hint: `Stel ${ruleStr(d, c)} = ${val} en los op vir n.`,
    solution: [{ s: `${d}n ${c < 0 ? "− " + (-c) : "+ " + c} = ${val}`, r: "" }, { s: `n = ${pos}`, r: "los op" }],
  });
}
function genPatRule() {
  const { d, c, T } = pattern();
  const seq = [1, 2, 3, 4].map(T).join("; ");
  const opts = [
    { label: ruleStr(d, c), correct: true },
    { label: ruleStr(d, c + 1), correct: false },
    { label: ruleStr(d + 1, c), correct: false },
    { label: ruleStr(c === 0 ? d + 2 : d, -c), correct: false },
  ];
  return mc(`Gee die reël vir ${code(seq + "; ...")} in die vorm ${code("Tn = dn + c")}.`, dedupeOpts(opts), {
    hint: "d = die verskil tussen terme. c = die eerste term min d.",
    answerLabel: ruleStr(d, c),
  });
}
function ruleStr(d, c) {
  const dn = d === 1 ? "n" : (d === -1 ? "−n" : `${d}n`);
  if (c === 0) return `Tn = ${dn}`;
  return `Tn = ${dn} ${c < 0 ? "− " + (-c) : "+ " + c}`;
}
function dedupeOpts(opts) {
  const seen = new Set(); const out = [];
  for (const o of opts) { if (!seen.has(o.label)) { seen.add(o.label); out.push(o); } }
  return out;
}

export const CH1 = {
  u1: { skills: [
    { concept: "dele", gen: genCount },
    { concept: "dele", gen: genCoef },
    { concept: "dele", gen: genConstant },
    { concept: "dele", gen: genCoef },
    { concept: "dele", gen: genCount },
  ] },
  u2: { skills: Array.from({ length: 5 }, () => ({ concept: "gelyksoortig", gen: genLike })) },
  u3: { skills: [
    { concept: "vervang", gen: genSub }, { concept: "vervang", gen: genSub },
    { concept: "vervang", gen: genSub }, { concept: "vervang", gen: genSub },
    { concept: "vervang", gen: genSub },
  ] },
  u4: { skills: Array.from({ length: 5 }, () => ({ concept: "insetuitset", gen: genIO })) },
  u5: { skills: Array.from({ length: 5 }, () => ({ concept: "skryf", gen: genWords })) },
  u6: { skills: [
    { concept: "patrone", gen: genPatTerm }, { concept: "patrone", gen: genPatRule },
    { concept: "patrone", gen: genPatPos }, { concept: "patrone", gen: genPatTerm },
    { concept: "patrone", gen: genPatPos },
  ] },
};
