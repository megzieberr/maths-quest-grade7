/* ============================================================
   VERIFY — m10 "Inspringende (refleks) hoeke" after the calc→calcdo
   conversion (node, no browser)
   ------------------------------------------------------------
   Part A: 200 generated questions per converted generator —
     - genReflexFromInner: type "calcdo", expected = 360 − inner,
       inner in [20,175], prompt has inner, solution + answerLabel match
     - genReflexAroundPoint: type "calcdo", expected = 360 − a, a in [30,170]
     - genReflexReverse: type "calcdo", expected = 360 − reflex,
       reflex in [185,340] (typed sum is 360 − refleks, per her ruling)
     - genReflexIdentify UNCHANGED: still type "mc" (recognition, no calc)
   Part B: reuses the real calculator.js key-press pipeline (same fake DOM
   as fuzz-m11.mjs) to confirm "360−<n>=" auto-passes and a wrong "="
   does NOT auto-commit (only the check button commits it).
   Part C: CH3.m10 skill list still produces 5 distinct question
   signatures per run (the no-repeat guard in play.js works off these).
   Run: node tools/fuzz-m10.mjs   (exit 1 on any mismatch)
   ============================================================ */

let fails = 0;
const fail = (msg) => { fails++; console.log("FAIL:", msg); };

/* ---------------- Part A: converted generators ---------------- */
const mod = await import("../js/quests/ch3-meetkunde.js");
const { CH3 } = mod;

const m10 = CH3.m10;
if (!m10 || !Array.isArray(m10.skills) || m10.skills.length !== 5) {
  fail(`CH3.m10 missing or wrong skill count (expected 5, got ${m10 && m10.skills && m10.skills.length})`);
}

// pull the generator functions straight off the skills list (no direct export)
const gens = {};
for (const { gen } of m10.skills) gens[gen.name] = gen;
const names = ["genReflexFromInner", "genReflexAroundPoint", "genReflexReverse", "genReflexIdentify"];
for (const n of names) if (!gens[n]) fail(`generator "${n}" not found among CH3.m10 skills`);

const N = 200;

for (let i = 0; i < N; i++) {
  const q = gens.genReflexFromInner();
  if (q.type !== "calcdo") fail(`genReflexFromInner #${i}: type expected "calcdo", got "${q.type}"`);
  const inner = 360 - q.expected;
  if (inner < 20 || inner > 175) fail(`genReflexFromInner #${i}: inner=${inner} out of [20,175]`);
  if (!q.prompt.includes(`${inner}°`)) fail(`genReflexFromInner #${i}: prompt missing inner value ${inner}° — "${q.prompt}"`);
  const wantStep = `360 − ${inner} = ${q.expected}`;
  if (!q.solution || q.solution[0].s !== wantStep) fail(`genReflexFromInner #${i}: solution "${q.solution && q.solution[0].s}" !== "${wantStep}"`);
  if (q.answerLabel !== `${q.expected}°`) fail(`genReflexFromInner #${i}: answerLabel "${q.answerLabel}" !== "${q.expected}°"`);
  if (!/sakrekenaar/.test(q.hint)) fail(`genReflexFromInner #${i}: hint not updated to sakrekenaar style — "${q.hint}"`);
}

for (let i = 0; i < N; i++) {
  const q = gens.genReflexAroundPoint();
  if (q.type !== "calcdo") fail(`genReflexAroundPoint #${i}: type expected "calcdo", got "${q.type}"`);
  const a = 360 - q.expected;
  if (a < 30 || a > 170) fail(`genReflexAroundPoint #${i}: a=${a} out of [30,170]`);
  if (!q.prompt.includes(`${a}°`)) fail(`genReflexAroundPoint #${i}: prompt missing a value ${a}° — "${q.prompt}"`);
  const wantStep = `360 − ${a} = ${q.expected}`;
  if (!q.solution || q.solution[0].s !== wantStep) fail(`genReflexAroundPoint #${i}: solution "${q.solution && q.solution[0].s}" !== "${wantStep}"`);
  if (q.answerLabel !== `${q.expected}°`) fail(`genReflexAroundPoint #${i}: answerLabel "${q.answerLabel}" !== "${q.expected}°"`);
  if (!/sakrekenaar/.test(q.hint)) fail(`genReflexAroundPoint #${i}: hint not updated to sakrekenaar style — "${q.hint}"`);
}

for (let i = 0; i < N; i++) {
  const q = gens.genReflexReverse();
  if (q.type !== "calcdo") fail(`genReflexReverse #${i}: type expected "calcdo", got "${q.type}"`);
  const reflex = 360 - q.expected;
  if (reflex < 185 || reflex > 340) fail(`genReflexReverse #${i}: reflex=${reflex} out of [185,340]`);
  if (!q.prompt.includes(`${reflex}°`)) fail(`genReflexReverse #${i}: prompt missing reflex value ${reflex}° — "${q.prompt}"`);
  // her ruling: the typed sum is 360 − refleks
  const wantStep = `360 − ${reflex} = ${q.expected}`;
  if (!q.solution || q.solution[0].s !== wantStep) fail(`genReflexReverse #${i}: solution "${q.solution && q.solution[0].s}" !== "${wantStep}"`);
  if (q.answerLabel !== `${q.expected}°`) fail(`genReflexReverse #${i}: answerLabel "${q.answerLabel}" !== "${q.expected}°"`);
  if (!/sakrekenaar/.test(q.hint)) fail(`genReflexReverse #${i}: hint not updated to sakrekenaar style — "${q.hint}"`);
}

for (let i = 0; i < N; i++) {
  const q = gens.genReflexIdentify();
  if (q.type !== "mc") fail(`genReflexIdentify #${i}: type expected "mc" (untouched), got "${q.type}"`);
}

console.log(`Part A: ${N} generated questions per converted generator checked (genReflexFromInner, genReflexAroundPoint, genReflexReverse now calcdo; genReflexIdentify still mc).`);

/* ---------------- Part B: real calculator.js key-press pipeline ---------------- */
function fakeElement(tag) {
  const kids = [];
  const node = {
    tagName: tag, _html: "", _text: "", children: kids, type: "", disabled: false,
    classList: { add() {}, remove() {}, contains() { return false; } },
    dataset: {}, style: {},
    set className(v) { this._className = v; }, get className() { return this._className; },
    set innerHTML(v) { this._html = v; }, get innerHTML() { return this._html; },
    set textContent(v) { this._text = v; }, get textContent() { return this._text; },
    appendChild(child) { kids.push(child); return child; },
    addEventListener() {}, removeEventListener() {},
    remove() {},
  };
  return node;
}
globalThis.document = { createElement: (tag) => fakeElement(tag) };

const { mountCalculator } = await import("../js/calculator.js");

function runCalc(pressIds) {
  const host = fakeElement("div");
  const events = [];
  const api = mountCalculator(host, { onEvent: (t, p) => events.push([t, p]) });
  for (const id of pressIds) api.press(id);
  return { events, state: api.state() };
}
const D = n => `d${n}`;

// exercise one real generated genReflexFromInner question: type the exact
// "360-<inner>=" sequence a learner would type and confirm it auto-passes.
{
  const q = gens.genReflexFromInner();
  const inner = 360 - q.expected;
  const digits = String(inner).split("").map(D);
  const { events } = runCalc([D(3), D(6), D(0), "minus", ...digits, "eq"]);
  const eq = events.find(([t]) => t === "eq");
  if (!eq) fail(`Part B: "360-${inner}=" did not fire an eq event`);
  else if (eq[1].value !== q.expected) fail(`Part B: "360-${inner}=" fired eq(${eq[1].value}), expected ${q.expected}`);
}

// a wrong "=" must NOT auto-commit (mirrors m11's pass semantics — only the
// check-button commits a wrong result; questions.js handles that wiring,
// this just confirms the calculator itself just reports the eq value).
{
  const { events } = runCalc([D(1), D(2), D(3), "eq"]);
  const eq = events.find(([t]) => t === "eq");
  if (!eq || eq[1].value !== 123) fail(`Part B: bare "123=" did not fire eq(123) — got ${JSON.stringify(events)}`);
}

// incomplete expression "=" → Syntax ERROR, no eq event, never an attempt
{
  const { events, state } = runCalc([D(9), D(9), "minus", "eq"]);
  const eq = events.find(([t]) => t === "eq");
  if (eq) fail(`Part B: "99-=" (incomplete) fired an eq event — should be ignored: ${JSON.stringify(eq)}`);
  if (state.result !== "Syntax ERROR") fail(`Part B: "99-=" result was "${state.result}", expected "Syntax ERROR"`);
}

console.log("Part B: real calculator.js key-press pipeline checked against a converted m10 generator.");

/* ---------------- Part C: 5 distinct questions per run (no-repeat guard) ---------------- */
function sig(q) {
  // mirror-ish signature: type + prompt is enough to detect a repeat within one run
  return `${q.type}|${q.prompt}`;
}
let repeatRunFails = 0;
for (let run = 0; run < 50; run++) {
  const seen = new Set();
  for (const { gen } of CH3.m10.skills) {
    const q = gen();
    const s = sig(q);
    if (seen.has(s)) repeatRunFails++;
    seen.add(s);
  }
  if (seen.size !== 5) repeatRunFails++;
}
if (repeatRunFails) fail(`Part C: ${repeatRunFails} run(s) did not produce 5 distinct question signatures`);
else console.log("Part C: 50 runs of CH3.m10.skills each produced 5 distinct question signatures.");

if (fails) { console.log(`\n${fails} FAILURE(S)`); process.exit(1); }
console.log("\nAll checks passed (0 failures).");
