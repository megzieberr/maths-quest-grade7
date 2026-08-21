/* ============================================================
   FUZZ — 🎲 Dice Quest (node, no browser)
   ------------------------------------------------------------
   Part A: dealMixed (js/deal.js) — the raw dealing algorithm, on
     synthetic tagged pools of varying size, checks the "≥ min(pool,10)
     distinct source rounds" guarantee that both daily.js and dice.js
     rely on.
   Part B: dicePoolIds (js/dice.js) — pool membership per live chapter:
     open-only, m1c/m11 (closed) excluded, ch6 = ONLY the gemeng ids
     (st28-32) and NEVER a single-theorem id, archived chapters never
     produce a pool, an all-closed chapter produces an empty pool.
   Part C: isDiceChainLocked — ch6's dice card is gated on st28's
     chain-unlock, exactly like the round tile itself; every other
     chapter is never chain-gated.
   Part D: buildDiceDef graceful null on an empty pool.
   Part E: several hundred REAL dice deals per live chapter (meetkunde,
     vorms, transformasies, stellings-gemeng) — exactly 10 questions,
     drawn from >= min(poolSize,10) distinct rounds (proven via object-
     identity provenance against questDef(id).skills, no production
     code touched), every generated question has the fields its type
     needs, and — mirroring play.js's own freshQuestion no-repeat guard
     exactly — no unresolved duplicate signature within a deal.
   Run: node tools/fuzz-dice.mjs   (exit 1 on any mismatch)
   ============================================================ */

let fails = 0;
const fail = (msg) => { fails++; console.log("FAIL:", msg); };

const { CHAPTERS, chapterById } = await import("../js/config.js");
const { questDef } = await import("../js/quests/index.js");
const { dicePoolIds, buildDiceDef, isDiceChainLocked, diceQuestId, poolFromDiceId } = await import("../js/dice.js");
const { dealMixed, DEAL_TOTAL } = await import("../js/deal.js");

/* ---------------- test-app helpers ----------------
   chain.js: openSetOf(app) → app.state.openQuests; null/non-array = "alles
   oop" (the real fallback used everywhere else). progressOf(app,id) →
   app.state.progress[id]. */
const appAllOpen = (progress = {}) => ({ state: { openQuests: null, progress } });
const appOpenSet = (ids, progress = {}) => ({ state: { openQuests: ids, progress } });
const ST27_PASSED = { st27: { passed: true } };   // unlocks st28 via chain.js (only the PRECEDING quest matters)

/* ---------------- Part A: dealMixed — generic distinct-source guarantee ---------------- */
{
  let bad = 0;
  for (let n = 1; n <= 15; n++) {
    const defs = Array.from({ length: n }, (_, i) => ({
      skills: Array.from({ length: 3 }, (_, k) => ({ src: i, gen: () => ({ type: "mc", prompt: `q${i}-${k}`, options: [{ label: "a", correct: true }] }) })),
    }));
    for (let run = 0; run < 20; run++) {
      const def = dealMixed(defs, DEAL_TOTAL);
      if (!def || def.skills.length !== DEAL_TOTAL) { bad++; continue; }
      const distinctSrc = new Set(def.skills.map(s => s.src)).size;
      const want = Math.min(n, DEAL_TOTAL);
      if (distinctSrc !== want) bad++;
    }
  }
  if (bad) fail(`Part A: dealMixed distinct-source guarantee broke ${bad} time(s) across pool sizes 1..15`);
  else console.log("Part A: dealMixed always draws exactly min(poolSize,10) distinct source rounds, 20 runs x 15 pool sizes.");
}
// empty pool → null, never a throw/error
if (dealMixed([]) !== null) fail("Part A: dealMixed([]) should return null");
if (dealMixed([{ skills: [] }, null, undefined]) !== null) fail("Part A: dealMixed of all-unusable defs should return null");

/* ---------------- Part B: dicePoolIds ---------------- */
const CH3 = chapterById("meetkunde"), CH4 = chapterById("vorms"), CH5 = chapterById("transformasies"), CH6 = chapterById("stellings");
const CH1 = chapterById("uitdrukkings"), CH2 = chapterById("vergelykings"); // archived

// all-open: pool === every built id in that chapter (m/s/t); ch6 === exactly the 5 gemeng ids
{
  const app = appAllOpen();
  const builtIds = ch => (ch.quests || []).filter(q => q.built).map(q => q.id);
  for (const ch of [CH3, CH4, CH5]) {
    const pool = dicePoolIds(app, ch);
    const want = builtIds(ch);
    if (pool.length !== want.length || !want.every(id => pool.includes(id))) {
      fail(`Part B: ${ch.id} all-open pool mismatch — got ${JSON.stringify(pool)}, want ${JSON.stringify(want)}`);
    }
  }
  const st = dicePoolIds(app, CH6);
  const wantSt = ["st28", "st29", "st30", "st31", "st32"];
  if (st.length !== 5 || !wantSt.every(id => st.includes(id))) fail(`Part B: stellings all-open pool !== gemeng-only — got ${JSON.stringify(st)}`);
  const singleTheoremLeak = st.filter(id => !wantSt.includes(id));
  if (singleTheoremLeak.length) fail(`Part B: single-theorem id(s) leaked into the ch6 pool: ${JSON.stringify(singleTheoremLeak)}`);
}

// m1c / m11 seeded CLOSED — must never appear, rest of meetkunde still does
{
  const allBuilt = CH3.quests.filter(q => q.built).map(q => q.id);
  const openMinusClosed = allBuilt.filter(id => id !== "m1c" && id !== "m11");
  const app = appOpenSet(openMinusClosed);
  const pool = dicePoolIds(app, CH3);
  if (pool.includes("m1c") || pool.includes("m11")) fail(`Part B: closed m1c/m11 leaked into meetkunde pool — got ${JSON.stringify(pool)}`);
  if (pool.length !== openMinusClosed.length) fail(`Part B: meetkunde pool should be every OTHER built round — got ${pool.length}, want ${openMinusClosed.length}`);
}

// ch6: st28 individually closed, st29-32 open → pool is the remaining 4, still non-empty
{
  const app = appOpenSet(["st29", "st30", "st31", "st32"]);
  const pool = dicePoolIds(app, CH6);
  if (pool.includes("st28")) fail("Part B: closed st28 leaked into ch6 pool");
  if (pool.length !== 4 || !["st29", "st30", "st31", "st32"].every(id => pool.includes(id))) fail(`Part B: ch6 partial-closure pool wrong — got ${JSON.stringify(pool)}`);
}

// fully-closed chapter → empty pool, never a throw
{
  const app = appOpenSet([]);
  for (const ch of [CH3, CH4, CH5, CH6]) {
    const pool = dicePoolIds(app, ch);
    if (pool.length !== 0) fail(`Part B: ${ch.id} should have an empty pool when everything is closed — got ${JSON.stringify(pool)}`);
  }
}

// archived chapters never produce a pool, regardless of openQuests
{
  const app = appAllOpen();
  for (const ch of [CH1, CH2]) {
    const pool = dicePoolIds(app, ch);
    if (pool.length !== 0) fail(`Part B: archived chapter ${ch.id} should never have a dice pool — got ${JSON.stringify(pool)}`);
  }
}
console.log("Part B: dicePoolIds — open-only, m1c/m11 excluded, ch6 = gemeng-only, archived/all-closed = empty. All checked.");

/* ---------------- Part C: isDiceChainLocked ---------------- */
{
  if (!isDiceChainLocked(appAllOpen(), CH6)) fail("Part C: ch6 dice should be chain-locked before st27 is passed");
  if (isDiceChainLocked(appAllOpen(ST27_PASSED), CH6)) fail("Part C: ch6 dice should UNLOCK once st27 is passed");
  for (const ch of [CH3, CH4, CH5]) {
    if (isDiceChainLocked(appAllOpen(), ch)) fail(`Part C: ${ch.id} dice should never be chain-locked (only ch6 is a chain chapter)`);
  }
  console.log("Part C: isDiceChainLocked — ch6 gated on st28's unlock, every other chapter never gated.");
}

/* ---------------- Part D: buildDiceDef graceful null ---------------- */
{
  const closedApp = appOpenSet([]);
  for (const ch of [CH3, CH4, CH5, CH6]) {
    if (buildDiceDef(closedApp, ch) !== null) fail(`Part D: buildDiceDef should be null for ${ch.id} when its pool is empty`);
  }
  const openApp = appAllOpen(ST27_PASSED);
  for (const ch of [CH3, CH4, CH5, CH6]) {
    const def = buildDiceDef(openApp, ch);
    if (!def || !Array.isArray(def.skills) || def.skills.length !== DEAL_TOTAL) fail(`Part D: buildDiceDef(${ch.id}) should return exactly ${DEAL_TOTAL} skills — got ${def && def.skills && def.skills.length}`);
  }
  console.log(`Part D: buildDiceDef — null on an empty pool, exactly ${DEAL_TOTAL} skills otherwise.`);
}

/* ---------------- Part E: several hundred real deals per live chapter ---------------- */
// mirrors play.js's own freshQuestion no-repeat guard EXACTLY (same signature,
// same 25-attempt retry) — proves the guard actually converges on a dice deal.
const sig = (q) => [q.type, q.prompt || "", q.answerLabel ?? "", q.expected != null ? JSON.stringify(q.expected) : "", q.angle ?? ""].join("¦");
function freshQuestion(skill, seen) {
  let q = skill.gen(), guard = 0;
  while (guard++ < 25 && seen.has(sig(q))) q = skill.gen();
  seen.add(sig(q));
  return q;
}

function validateQuestion(q, where) {
  if (!q || typeof q !== "object") { fail(`${where}: generated question is not an object`); return; }
  if (typeof q.prompt !== "string" || !q.prompt.length) fail(`${where}: missing/empty prompt (type ${q.type})`);
  switch (q.type) {
    case "mc":
      if (!Array.isArray(q.options) || !q.options.length || !q.options.some(o => o.correct)) fail(`${where}: mc missing a correct option`);
      break;
    case "tf":
      if (typeof q.yes !== "boolean") fail(`${where}: tf missing boolean yes`);
      break;
    case "calc":
      if (typeof q.expected !== "number" || !Number.isFinite(q.expected)) fail(`${where}: calc missing numeric expected`);
      break;
    case "protractor":
      if (typeof q.angle !== "number") fail(`${where}: protractor missing numeric angle`);
      break;
    case "calcdo":
      if (typeof q.expected !== "number" || !Number.isFinite(q.expected)) fail(`${where}: calcdo missing numeric expected`);
      break;
    case "multi":
      if (!Array.isArray(q.chips) || !q.chips.length || !q.chips.some(c => c.correct)) fail(`${where}: multi missing a correct chip`);
      break;
    case "coord":
      if (!q.expected || typeof q.expected.x !== "number" || typeof q.expected.y !== "number") fail(`${where}: coord missing expected {x,y}`);
      break;
    case "tap":
      if (q.target == null || typeof q.figure !== "string" || !q.figure.length) fail(`${where}: tap missing target/figure`);
      break;
    case "reason":
      if (!Array.isArray(q.options) || !q.options.length || !q.options.some(o => o.correct) || !q.correctCode) fail(`${where}: reason missing options/correctCode`);
      break;
    case "calcReason":
      if (typeof q.expected !== "number" || !q.correctCode || !Array.isArray(q.options) || !q.options.some(o => o.correct)) fail(`${where}: calcReason missing expected/correctCode/options`);
      break;
    default:
      fail(`${where}: unrecognised question type "${q.type}"`);
  }
}

/* provenance-by-object-identity: which pool round did this exact skill
   object come from? pick() in deal.js hands back a literal element of
   questDef(id).skills, so reference equality is reliable — no production
   code touched to get this. */
function roundOfSkill(skill, poolIds) {
  for (const id of poolIds) {
    const d = questDef(id);
    if (d && Array.isArray(d.skills) && d.skills.includes(skill)) return id;
  }
  return null;
}

function runDeals(label, app, chapter, runs, excludedIds = []) {
  const poolIds = dicePoolIds(app, chapter);
  if (!poolIds.length) { fail(`Part E (${label}): pool is unexpectedly empty, cannot fuzz`); return; }
  const wantDistinct = Math.min(poolIds.length, DEAL_TOTAL);
  // hoofstuk 6 se poel-INVARIANT geld ALTYD, ongeag watter st28-32 juis oop is
  // in hierdie toets-scenario — 'n st-id BUITE die gemeng-vyf mag NOOIT gedeel word.
  const alwaysExcluded = chapter.id === "stellings"
    ? ["st1","st2","st3","st4","st5","st6","st7","st8","st9","st10","st11","st12","st13","st14","st15","st16","st17","st18","st19","st20","st21","st22","st23","st24","st25","st26","st27"]
    : [];
  const watchIds = [...new Set([...excludedIds, ...alwaysExcluded])];
  let sizeFails = 0, distinctFails = 0, repeatFails = 0, closedLeakFails = 0;
  for (let i = 0; i < runs; i++) {
    const def = buildDiceDef(app, chapter);
    if (!def) { fail(`Part E (${label}) run #${i}: buildDiceDef returned null with a non-empty pool`); continue; }
    if (def.skills.length !== DEAL_TOTAL) { sizeFails++; continue; }

    const sources = def.skills.map(s => roundOfSkill(s, poolIds));
    if (sources.some(s => s == null)) { fail(`Part E (${label}) run #${i}: a dealt skill couldn't be traced back to any pool round`); continue; }
    if (new Set(sources).size !== wantDistinct) distinctFails++;
    if (watchIds.length && sources.some(id => watchIds.includes(id))) closedLeakFails++;

    const seen = new Set();
    const generated = def.skills.map(s => freshQuestion(s, seen));
    if (seen.size !== DEAL_TOTAL) repeatFails++;
    generated.forEach(q => validateQuestion(q, `Part E (${label}) run #${i}`));
  }
  if (sizeFails) fail(`Part E (${label}): ${sizeFails}/${runs} deal(s) did not have exactly ${DEAL_TOTAL} questions`);
  if (distinctFails) fail(`Part E (${label}): ${distinctFails}/${runs} deal(s) did not draw from exactly ${wantDistinct} distinct round(s)`);
  if (repeatFails) fail(`Part E (${label}): ${repeatFails}/${runs} deal(s) had an unresolved duplicate signature after the freshQuestion guard`);
  if (closedLeakFails) fail(`Part E (${label}): ${closedLeakFails}/${runs} deal(s) drew from a closed/off-pool round`);
  if (!sizeFails && !distinctFails && !repeatFails && !closedLeakFails) {
    console.log(`Part E (${label}): ${runs} deals — always ${DEAL_TOTAL} questions, always ${wantDistinct} distinct round(s), no unresolved repeats, no closed-round leaks, every question's fields checked.`);
  }
}

const RUNS = 300;
runDeals("meetkunde, all open", appAllOpen(), CH3, RUNS);
runDeals("vorms, all open", appAllOpen(), CH4, RUNS);
runDeals("transformasies, all open", appAllOpen(), CH5, RUNS);
runDeals("stellings, gemeng open + chain unlocked", appAllOpen(ST27_PASSED), CH6, RUNS);
// meetkunde with m1c/m11 explicitly closed — the realistic "seeded closed" state
{
  const allBuilt = CH3.quests.filter(q => q.built).map(q => q.id);
  const openMinusClosed = allBuilt.filter(id => id !== "m1c" && id !== "m11");
  runDeals("meetkunde, m1c/m11 closed (realistic seed)", appOpenSet(openMinusClosed), CH3, RUNS, ["m1c", "m11"]);
}

/* ---------------- id helpers sanity ---------------- */
if (diceQuestId("m") !== "dice-m") fail('diceQuestId("m") !== "dice-m"');
if (poolFromDiceId("dice-st") !== "st") fail('poolFromDiceId("dice-st") !== "st"');
if (poolFromDiceId("m1") !== null) fail('poolFromDiceId("m1") should be null (not a dice id)');

if (fails) { console.log(`\n${fails} FAILURE(S)`); process.exit(1); }
console.log("\nAll checks passed (0 failures).");
