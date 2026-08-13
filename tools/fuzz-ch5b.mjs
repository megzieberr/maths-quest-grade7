/* Headless fuzz + correctness check for ch5 Deel 2 (t1b–t10b).
   ------------------------------------------------------------------
   None of these rounds draw a measurable angle-arc <polyline> (they use
   the rooster/point/shape SVG builders in engine/diagrams.js, not the
   arc-based angle diagrams ch3/ch4/ch6 use), so tools/verify-stellings.mjs
   has nothing to check here — this script is the dedicated replacement.
   It re-derives every round's transformation maths INDEPENDENTLY (never
   imports the generator's own formulas) and checks the marked answer
   against that independent recomputation, many times over.

   Covers:
   - t1b: mc answerLabel is one of translasie/refleksie/rotasie and matches
     exactly one correct option
   - t2b: dx = x2-x1, dy = y2-y1 (coord answer) matches the stated points
   - t3b: reflected coordinate re-derived from the prompt's own point+axis
     matches whether the tf claim is marked true/false
   - t4b: applying the SAME reflection formula to the answer (the claimed
     original A) reproduces the image point A' stated in the prompt
   - t5b: re-deriving the rotation from the stated A/A' pair picks the
     same option the question marks correct
   - t6b: two 180° rotations return the exact starting point
   - t7b: the symmetry-line count named in the prompt matches the SYM
     table entry for the option marked correct
   - t8b: the claimed rotation order in the prompt is compared against the
     SYM table's real order for that shape
   - t9b: reverse scale-factor arithmetic (old = new/k) and the
     vergroot/verklein classification both check out
   - t10b: every produced question type is one of the above and passes the
     same check as its dedicated round
   - cross-cutting: no hint or tip text contains the digits of the numeric
     answer (calc/coord rounds) — the "Wenk never reveals the answer" rule

   Run: node tools/fuzz-ch5b.mjs        (exit 1 on any mismatch) */
import { CH5 } from "../js/quests/ch5-transformasies.js";

const TRIES = 400;
const fails = [];
let questionCount = 0;

const SYM_ORDER = { vierkant: 4, "gelyksydige driehoek": 3, "reëlmatige seshoek": 6, reghoek: 2, "reëlmatige vyfhoek": 5 };
const SYM_LINES = { vierkant: 4, "gelyksydige driehoek": 3, "reëlmatige seshoek": 6, reghoek: 2, "reëlmatige vyfhoek": 5 };
// (this app's SYM list happens to give every shape a distinct lines AND
//  order count that are numerically equal to each other per shape — both
//  tables are written out independently here rather than assumed equal.)

function numsIn(s) { return (s || "").match(/-?\d+/g) || []; }
/* pull every "(x ; y)" coordinate pair out of a prompt, in order of
   appearance — robust to whatever wording surrounds them (unlike a
   full-sentence regex, which breaks the instant the prose changes). */
function extractPairs(text) {
  const re = /\((-?\d+)\s*;\s*(-?\d+)\)/g;
  const out = [];
  let m;
  while ((m = re.exec(text))) out.push([Number(m[1]), Number(m[2])]);
  return out;
}

function checkHintNoLeak(label, q) {
  if (q.type !== "calc" && q.type !== "coord") return;
  const forbidden = q.type === "calc" ? [String(q.expected)] : [String(q.expected.x), String(q.expected.y)];
  const hay = (q.hint || "") + (q.tip || "");
  for (const n of forbidden) {
    if (n.length && numsIn(hay).includes(n)) fails.push(`${label}: hint/tip contains the answer number "${n}"`);
  }
}

/* ---------- t1b ---------- */
function checkT1b(label, q) {
  if (q.type !== "mc") { fails.push(`${label}: type is "${q.type}", verwag mc`); return; }
  const correct = q.options.filter(o => o.correct);
  if (correct.length !== 1) fails.push(`${label}: ${correct.length} correct opsies, verwag 1`);
  if (!["translasie", "refleksie", "rotasie"].includes(correct[0]?.label))
    fails.push(`${label}: onverwagte antwoord-etiket "${correct[0]?.label}"`);
}

/* ---------- t2b ---------- */
function checkT2b(label, q) {
  if (q.type !== "coord") { fails.push(`${label}: type is "${q.type}", verwag coord`); return; }
  const pairs = extractPairs(q.prompt);
  if (pairs.length !== 2) { fails.push(`${label}: ${pairs.length} koördinaat-pare gevind, verwag 2: "${q.prompt}"`); return; }
  const [[x1, y1], [x2, y2]] = pairs;
  const dx = x2 - x1, dy = y2 - y1;
  if (q.expected.x !== dx || q.expected.y !== dy)
    fails.push(`${label}: expected (${q.expected.x};${q.expected.y}), herbereken (${dx};${dy})`);
}

/* ---------- t3b ---------- */
function checkT3b(label, q) {
  if (q.type !== "tf") { fails.push(`${label}: type is "${q.type}", verwag tf`); return; }
  const pairs = extractPairs(q.prompt);
  if (pairs.length !== 2) { fails.push(`${label}: ${pairs.length} koördinaat-pare gevind, verwag 2: "${q.prompt}"`); return; }
  const [[X, Y], [CX, CY]] = pairs;
  const axisTxt = q.prompt.toLowerCase().includes("die x-as") ? "die x-as" : "die y-as";
  const trueImg = axisTxt === "die x-as" ? { x: X, y: -Y } : { x: -X, y: Y };
  const claimTrue = trueImg.x === CX && trueImg.y === CY;
  if (q.yes !== claimTrue) fails.push(`${label}: q.yes=${q.yes} maar herberekende waarheid=${claimTrue}`);
}

/* ---------- t4b ---------- */
function checkT4b(label, q) {
  if (q.type !== "coord") { fails.push(`${label}: type is "${q.type}", verwag coord`); return; }
  const pairs = extractPairs(q.prompt);
  if (pairs.length !== 1) { fails.push(`${label}: ${pairs.length} koördinaat-pare gevind, verwag 1: "${q.prompt}"`); return; }
  const [IX, IY] = pairs[0];
  const axisTxt = q.prompt.toLowerCase().includes("die x-as") ? "die x-as" : "die y-as";
  // reflection is self-inverse: applying the SAME formula to the marked
  // answer must reproduce the stated image point exactly.
  const reimg = axisTxt === "die x-as" ? { x: q.expected.x, y: -q.expected.y } : { x: -q.expected.x, y: q.expected.y };
  if (reimg.x !== IX || reimg.y !== IY)
    fails.push(`${label}: antwoord (${q.expected.x};${q.expected.y}) herrefleksie gee (${reimg.x};${reimg.y}), verwag (${IX};${IY})`);
}

/* ---------- t5b ---------- */
function checkT5b(label, q) {
  if (q.type !== "mc") { fails.push(`${label}: type is "${q.type}", verwag mc`); return; }
  const pairs = extractPairs(q.prompt);
  if (pairs.length !== 2) { fails.push(`${label}: ${pairs.length} koördinaat-pare gevind, verwag 2: "${q.prompt}"`); return; }
  const [[x, y], [ix, iy]] = pairs;
  const imgs = { "180°": { x: -x, y: -y }, "90° anti-kloksgewys": { x: -y, y: x }, "90° kloksgewys": { x: y, y: -x } };
  const trueLabel = Object.keys(imgs).find(k => imgs[k].x === ix && imgs[k].y === iy);
  if (!trueLabel) { fails.push(`${label}: geen van die 3 rotasies gee (${ix};${iy}) vanaf (${x};${y}) nie`); return; }
  const correct = q.options.filter(o => o.correct);
  if (correct.length !== 1 || correct[0].label !== trueLabel)
    fails.push(`${label}: gemerk "${correct[0]?.label}", herbereken "${trueLabel}"`);
}

/* ---------- t6b ---------- */
function checkT6b(label, q) {
  if (q.type !== "coord") { fails.push(`${label}: type is "${q.type}", verwag coord`); return; }
  const pairs = extractPairs(q.prompt);
  if (pairs.length !== 1) { fails.push(`${label}: ${pairs.length} koördinaat-pare gevind, verwag 1: "${q.prompt}"`); return; }
  const [x, y] = pairs[0];
  if (q.expected.x !== x || q.expected.y !== y)
    fails.push(`${label}: dubbele 180°-draai moet by die oorspronklike punt (${x};${y}) eindig, expected is (${q.expected.x};${q.expected.y})`);
}

/* ---------- t7b ---------- */
const RE_T7B = /watter vorm het.*?(\d+) simmetrielyne/i;
function checkT7b(label, q) {
  if (q.type !== "mc") { fails.push(`${label}: type is "${q.type}", verwag mc`); return; }
  const m = q.prompt.toLowerCase().match(RE_T7B);
  if (!m) { fails.push(`${label}: kon nie telling uit prompt haal nie: "${q.prompt}"`); return; }
  const n = Number(m[1]);
  const correct = q.options.filter(o => o.correct);
  if (correct.length !== 1) { fails.push(`${label}: ${correct.length} correct opsies, verwag 1`); return; }
  const shapeLines = SYM_LINES[correct[0].label];
  if (shapeLines !== n) fails.push(`${label}: opsie "${correct[0].label}" het ${shapeLines} simmetrielyne, prompt vra vir ${n}`);
}

/* ---------- t8b ---------- */
const RE_T8B = /hierdie <code>(.+?)<\/code> het 'n rotasie-orde van (\d+)/i;
function checkT8b(label, q) {
  if (q.type !== "tf") { fails.push(`${label}: type is "${q.type}", verwag tf`); return; }
  const m = q.prompt.match(RE_T8B);
  if (!m) { fails.push(`${label}: kon nie bewering ontleed nie: "${q.prompt}"`); return; }
  const [, shapeName, claimed] = m;
  const realOrder = SYM_ORDER[shapeName];
  if (realOrder == null) { fails.push(`${label}: onbekende vormnaam "${shapeName}"`); return; }
  const claimTrue = realOrder === Number(claimed);
  if (q.yes !== claimTrue) fails.push(`${label}: q.yes=${q.yes} maar ${shapeName} se werklike orde ${realOrder} vs bewering ${claimed} gee ${claimTrue}`);
}

/* ---------- t9b ---------- */
const RE_T9B_SIDE = /skaalfaktor van.*?(\d+).*?vergroot na 'n nuwe sy van.*?(\d+) cm/i;
const RE_T9B_PER = /skaalfaktor van.*?(\d+).*?vergroot na 'n nuwe omtrek van.*?(\d+) cm/i;
const RE_T9B_GV = /verander van.*?(\d+) cm.*?na.*?(\d+) cm.*?vergroot of verklein/i;
function checkT9b(label, q) {
  const p = q.prompt.toLowerCase();
  let m;
  if ((m = p.match(RE_T9B_SIDE)) || (m = p.match(RE_T9B_PER))) {
    if (q.type !== "calc") { fails.push(`${label}: type is "${q.type}", verwag calc`); return; }
    const [, k, neu] = m.map(Number);
    if (neu % k !== 0) { fails.push(`${label}: nuwe waarde ${neu} nie deelbaar deur k=${k} nie`); return; }
    const old = neu / k;
    if (q.expected !== old) fails.push(`${label}: expected=${q.expected}, herbereken=${old} (${neu}÷${k})`);
    return;
  }
  if ((m = p.match(RE_T9B_GV))) {
    if (q.type !== "mc") { fails.push(`${label}: type is "${q.type}", verwag mc`); return; }
    const [, oldV, neuV] = m.map(Number);
    const grow = neuV > oldV;
    const correct = q.options.filter(o => o.correct);
    if (correct.length !== 1) { fails.push(`${label}: ${correct.length} correct opsies, verwag 1`); return; }
    const wantLabel = grow ? "vergroot" : "verklein";
    if (correct[0].label !== wantLabel) fails.push(`${label}: gemerk "${correct[0].label}", herbereken "${wantLabel}" (${oldV}→${neuV})`);
    return;
  }
  fails.push(`${label}: kon t9b-vraagvorm nie herken nie: "${q.prompt}"`);
}

/* ---------- dispatcher for t10b's mixed pool ---------- */
function checkMixed(label, q) {
  const p = q.prompt.toLowerCase();
  if (/watter soort transformasie is dit\?/.test(p)) return checkT1b(label, q);
  if (/wat was die translasie\?/.test(p)) return checkT2b(label, q);
  if (/wat was die oorspronklike punt a\?/.test(p)) return checkT4b(label, q);
  if (/deur hoeveel is dit gedraai\?/.test(p)) return checkT5b(label, q);
  if (/nog 'n keer 180° om o gedraai/.test(p)) return checkT6b(label, q);
  if (RE_T7B.test(p)) return checkT7b(label, q);
  if (RE_T9B_SIDE.test(p) || RE_T9B_PER.test(p) || RE_T9B_GV.test(p)) return checkT9b(label, q);
  fails.push(`${label}: t10b produced an unrecognised question shape: "${q.prompt}"`);
}

const CHECKERS = {
  t1b: checkT1b, t2b: checkT2b, t3b: checkT3b, t4b: checkT4b, t5b: checkT5b,
  t6b: checkT6b, t7b: checkT7b, t8b: checkT8b, t9b: checkT9b, t10b: checkMixed,
};

for (const id of Object.keys(CHECKERS)) {
  const def = CH5[id];
  if (!def) { fails.push(`${id}: ontbreek in CH5-register`); continue; }
  def.skills.forEach((skill, si) => {
    for (let t = 0; t < TRIES; t++) {
      const q = skill.gen();
      questionCount++;
      const label = `${id} skill${si + 1} probeer${t + 1}`;
      CHECKERS[id](label, q);
      checkHintNoLeak(label, q);
    }
  });
}

/* forced-mix rounds: t3b/t8b must carry shuffleSkills and an actual mix
   of true/false across their 5 skill slots (not all-true or all-false). */
for (const id of ["t3b", "t8b"]) {
  if (!CH5[id].shuffleSkills) fails.push(`${id}: shuffleSkills is not true (waar/onwaar round)`);
  const ys = CH5[id].skills.map(s => s.gen().yes);
  if (!ys.includes(true) || !ys.includes(false)) fails.push(`${id}: skills mix is not forced (${ys.join(",")})`);
}

console.log(`${questionCount} vrae getoets oor t1b–t10b (${TRIES} probeerslae per vaardigheid).`);
if (fails.length) {
  console.error(`\n✗ ${fails.length} wanpassing(s):`);
  fails.slice(0, 100).forEach(f => console.error("  " + f));
  process.exit(1);
}
console.log(`\n✓ ALMAL REG — t1b–t10b se transformasie-wiskunde onafhanklik herbereken, 0 wanpassings.`);
