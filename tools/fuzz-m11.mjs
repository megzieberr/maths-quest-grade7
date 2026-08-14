/* ============================================================
   VERIFY — m11 "Refleks-hoeke met die sakrekenaar" (node, no browser)
   ------------------------------------------------------------
   Part A: 500 generated CH3.m11 questions — asserts
     - expected === 360 − small, small in [25,150] step 5
     - prompt contains the small value
     - solution step matches "360 − small = expected"
     - figure is a reflex SVG: small angle labelled, "?" present on the
       long (reflex) arc, in the orange ASK colour
   Part B: exercises the ported calculator.js (real mountCalculator +
   api.press key sequence, via a minimal fake DOM) — the pure COMP
   arithmetic (evalArith) is reached exactly as a learner's keypresses
   would reach it. Confirms:
     - "360−50=" and "310=" both fire an "eq" event with value 310
     - comma-decimal arithmetic evaluates correctly
     - an incomplete expression's "=" fires NO "eq" event (Syntax ERROR,
       never counts as an attempt)
   Run: node tools/fuzz-m11.mjs   (exit 1 on any mismatch)
   ============================================================ */

let fails = 0;
const fail = (msg) => { fails++; console.log("FAIL:", msg); };

/* ---------------- Part A: question generator ---------------- */
const { CH3 } = await import("../js/quests/ch3-meetkunde.js");

const m11 = CH3.m11;
if (!m11 || !Array.isArray(m11.skills) || m11.skills.length !== 5) {
  fail(`CH3.m11 missing or wrong skill count (expected 5, got ${m11 && m11.skills && m11.skills.length})`);
}
if (m11 && m11.shuffleSkills) fail("m11.shuffleSkills should be unset — answer isn't skill-entry-determined");

const N = 500;
for (let i = 0; i < N; i++) {
  const skill = m11.skills[i % m11.skills.length];
  const q = skill.gen();

  if (q.type !== "calcdo") fail(`#${i}: type expected "calcdo", got "${q.type}"`);
  const small = 360 - q.expected;
  if (small < 25 || small > 150 || small % 5 !== 0) fail(`#${i}: small=${small} out of [25,150] step 5`);
  if (q.expected !== 360 - small) fail(`#${i}: expected mismatch (${q.expected} vs ${360 - small})`);
  if (!q.prompt.includes(`${small}°`)) fail(`#${i}: prompt missing small value ${small}° — "${q.prompt}"`);
  const wantStep = `360 − ${small} = ${q.expected}`;
  if (!q.solution || q.solution[0].s !== wantStep) fail(`#${i}: solution step "${q.solution && q.solution[0].s}" !== "${wantStep}"`);
  if (q.answerLabel !== `${q.expected}°`) fail(`#${i}: answerLabel "${q.answerLabel}" !== "${q.expected}°"`);

  if (!q.figure || !q.figure.includes("<svg")) fail(`#${i}: no figure SVG`);
  else {
    if (!q.figure.includes(`${small}°`)) fail(`#${i}: figure missing small-angle label ${small}°`);
    if (!q.figure.includes(">?<")) fail(`#${i}: figure missing "?" on the reflex arc`);
    if (!q.figure.includes("#f59e0b") && !q.figure.includes("#d97706")) fail(`#${i}: "?" not drawn in the orange ASK colour`);
  }
}
console.log(`Part A: ${N} generated m11 questions checked.`);

/* ---------------- Part B: ported calculator.js ---------------- */
/* minimal fake DOM — just enough for el()/mountCalculator's scaffold
   (createElement, className, innerHTML, appendChild, classList, textContent) */
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
const D = n => `d${n}`;   // digit key ids

// "360−50=" → eq fires with value 310
{
  const { events } = runCalc([D(3), D(6), D(0), "minus", D(5), D(0), "eq"]);
  const eq = events.find(([t]) => t === "eq");
  if (!eq) fail('calc "360−50=" did not fire an eq event');
  else if (eq[1].value !== 310) fail(`calc "360−50=" fired eq with value ${eq[1].value}, expected 310`);
  else if (eq[1].expr !== "360−50") fail(`calc "360−50=" eq.expr was "${eq[1].expr}", expected "360−50"`);
}

// bare answer "310=" → eq fires with value 310 (typing method not policed)
{
  const { events } = runCalc([D(3), D(1), D(0), "eq"]);
  const eq = events.find(([t]) => t === "eq");
  if (!eq || eq[1].value !== 310) fail(`calc "310=" did not fire eq(310) — got ${JSON.stringify(events)}`);
}

// comma-decimal: "1,5+2,5=" → eq fires with value 4
{
  const { events } = runCalc([D(1), "dot", D(5), "plus", D(2), "dot", D(5), "eq"]);
  const eq = events.find(([t]) => t === "eq");
  if (!eq || eq[1].value !== 4) fail(`calc "1,5+2,5=" did not fire eq(4) — got ${JSON.stringify(events)}`);
}

// mid-expression "=" (incomplete, "50+") → Syntax ERROR, NO eq event, never an attempt
{
  const { events, state } = runCalc([D(5), D(0), "plus", "eq"]);
  const eq = events.find(([t]) => t === "eq");
  if (eq) fail(`calc "50+=" (incomplete) fired an eq event — should be ignored: ${JSON.stringify(eq)}`);
  if (state.result !== "Syntax ERROR") fail(`calc "50+=" result was "${state.result}", expected "Syntax ERROR"`);
}

// "=" pressed on totally empty line → no eq, no crash
{
  const { events } = runCalc(["eq"]);
  if (events.some(([t]) => t === "eq")) fail('calc empty "=" fired an eq event unexpectedly');
}

console.log("Part B: ported calculator.js (evalArith via real key-press pipeline) checked.");

if (fails) { console.log(`\n${fails} FAILURE(S)`); process.exit(1); }
console.log("\nAll checks passed (0 failures).");
