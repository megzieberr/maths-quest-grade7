/* Headless fuzz + correctness check for s13 "Eienskappe van vorms".
   ------------------------------------------------------------------
   CH4.s13.skills picks 5-of-6 shapes ONCE per module load (shuffled(QUADS)
   .slice(0,5), same pattern as s9b/s11/s12) so a wrong-answer retry always
   re-shows the SAME shape's question — this script re-imports the module
   fresh (cache-busted) many times to sample all 6 shapes across "gen runs",
   and separately checks that retrying one skill never changes its shape.

   Asserts:
   - every option's correct-flag matches the S_TRUTH matrix (re-derived
     here independently, not by importing S_TRUTH — a real check)
   - >= 10 options per question
   - 3-5 correct options per question
   - no duplicate option labels within one question
   - the figure SVG contains no tick/arrow/right-angle markup (clean figure)
   - each "gen run" (module load) yields exactly 5 DISTINCT shapes
   - retrying the same skill slot (as play.js does on a wrong answer)
     always re-shows the SAME shape, never a different one

   Run: node tools/fuzz-s13.mjs        (exit 1 on any mismatch) */
const MOD_URL = new URL("../js/quests/ch4-vorms.js", import.meta.url).href;
const RUNS = 400; // 400 runs x 5 skills = 2000+ questions, plus retry checks

// Independently-derived expectation (mirrors the brief's truth matrix,
// written fresh here rather than imported from ch4-vorms.js).
const EXPECT = {
  "Al 4 sye is ewe lank": { vierkant: true, reghoek: false, ruit: true, parallelogram: false, trapesium: false, vlieer: false },
  "Teenoorstaande sye is ewe lank": { reghoek: true, parallelogram: true, trapesium: false, vlieer: false }, // vierkant/ruit: excluded (redundant-true, never shown)
  "Twee pare AANGRENSENDE sye is ewe lank": { reghoek: false, parallelogram: false, trapesium: false, vlieer: true }, // vierkant/ruit excluded
  "Al 4 sye is verskillende lengtes": { vierkant: false, reghoek: false, ruit: false, parallelogram: false, trapesium: true, vlieer: false },
  "Teenoorstaande sye is parallel": { vierkant: true, reghoek: true, ruit: true, parallelogram: true, trapesium: false, vlieer: false },
  "Net EEN paar sye is parallel": { vierkant: false, reghoek: false, ruit: false, parallelogram: false, trapesium: true, vlieer: false },
  "Geen paar sye is parallel nie": { vierkant: false, reghoek: false, ruit: false, parallelogram: false, trapesium: false, vlieer: true },
  "Al 4 hoeke is 90°": { vierkant: true, reghoek: true, ruit: false, parallelogram: false, trapesium: false, vlieer: false },
  "Net twee van die hoeke is 90°": { vierkant: false, reghoek: false, ruit: false, parallelogram: false, trapesium: false, vlieer: false },
  "Geen hoek is 90° nie": { vierkant: false, reghoek: false, ruit: true, parallelogram: true, trapesium: true, vlieer: true },
  "Die hoeklyne is ewe lank": { vierkant: true, reghoek: true, ruit: false, parallelogram: false, trapesium: false, vlieer: false },
  "Die hoeklyne is loodreg (90° by mekaar)": { reghoek: false, ruit: true, parallelogram: false, trapesium: false, vlieer: true }, // vierkant excluded (redundant-true)
  "Net EEN paar sye is ewe lank": { vierkant: false, reghoek: false, ruit: false, parallelogram: false, trapesium: false, vlieer: false },
};
const NAME_TO_KEY = { vierkant: "vierkant", reghoek: "reghoek", ruit: "ruit", parallelogram: "parallelogram", trapesium: "trapesium", vlieër: "vlieer" };

function shapeKeyOf(q) {
  const m = q.prompt.match(/<b>(.+?)<\/b>/);
  return m ? NAME_TO_KEY[m[1]] : null;
}
function checkQuestion(q, i, key, fails) {
  if (q.type !== "multi") { fails.push(`vraag ${i}: type is "${q.type}", verwag "multi"`); return; }
  if (q.chips.length < 10) fails.push(`vraag ${i} (${key}): net ${q.chips.length} opsies, verwag >=10`);
  const correctChips = q.chips.filter(c => c.correct);
  if (correctChips.length < 3 || correctChips.length > 5)
    fails.push(`vraag ${i} (${key}): ${correctChips.length} korrek, verwag 3-5`);
  const labels = q.chips.map(c => c.label);
  if (new Set(labels).size !== labels.length) fails.push(`vraag ${i} (${key}): duplicate opsie-etikette`);
  for (const c of q.chips) {
    const exp = EXPECT[c.label];
    if (!exp) { fails.push(`vraag ${i} (${key}): onbekende opsie-etiket "${c.label}"`); continue; }
    if (!(key in exp)) { fails.push(`vraag ${i} (${key}): opsie "${c.label}" behoort uitgesluit te wees vir ${key}, maar verskyn`); continue; }
    if (exp[key] !== c.correct) fails.push(`vraag ${i} (${key}): "${c.label}" gemerk ${c.correct}, verwag ${exp[key]}`);
  }
  const svg = q.figure || "";
  if (svg.includes("data-tap")) fails.push(`vraag ${i} (${key}): figuur bevat tikbare data-tap areas (nie skoon nie)`);
  if (svg.includes("›")) fails.push(`vraag ${i} (${key}): figuur bevat 'n parallel-pyltjie (›) — nie skoon nie`);
  if (/<line/.test(svg)) fails.push(`vraag ${i} (${key}): figuur bevat 'n <line> (sye-merkie/regtehoek-blokkie) — nie skoon nie`);
  if (/<polyline/.test(svg)) fails.push(`vraag ${i} (${key}): figuur bevat 'n <polyline> (regtehoek-blokkie) — nie skoon nie`);
  const polyCount = (svg.match(/<polygon/g) || []).length;
  if (polyCount !== 1) fails.push(`vraag ${i} (${key}): ${polyCount} <polygon> elemente, verwag presies 1 (net die vorm se buitelyn)`);
}

const fails = [];
let optionChecks = 0, diagramChecks = 0, questionCount = 0;
const shapesEverSeen = new Set();
const correctCountByShape = {};

for (let run = 0; run < RUNS; run++) {
  const mod = await import(`${MOD_URL}?run=${run}`);
  const skills = mod.CH4.s13.skills;
  if (skills.length !== 5) fails.push(`run ${run}: skills.length is ${skills.length}, verwag 5`);

  const runShapes = [];
  skills.forEach((skill, i) => {
    const q1 = skill.gen();
    questionCount++;
    const key = shapeKeyOf(q1);
    if (!key) { fails.push(`run ${run} skill ${i}: kon nie vorm uit prompt "${q1.prompt}" haal nie`); return; }
    runShapes.push(key);
    shapesEverSeen.add(key);
    correctCountByShape[key] = q1.chips.filter(c => c.correct).length;
    checkQuestion(q1, `${run}.${i}`, key, fails);
    optionChecks += q1.chips.length;
    diagramChecks++;

    // retry-consistency: play.js calls skill.gen() again on a wrong answer
    // (onSibling), same slot, no st.i advance — must stay the SAME shape.
    const q2 = skill.gen();
    const key2 = shapeKeyOf(q2);
    if (key2 !== key) fails.push(`run ${run} skill ${i}: herprobeer wissel vorm (${key} -> ${key2}), verwag dieselfde vorm`);
  });

  const distinct = new Set(runShapes).size;
  if (distinct !== 5) fails.push(`run ${run}: net ${distinct} unieke vorms uit 5 skills: ${runShapes.join(",")}`);
}

console.log(`${RUNS} "gen runs" (vars module-laai), ${questionCount} vrae gegenereer.`);
console.log(`Vorms ooit gesien oor al die runs: ${[...shapesEverSeen].sort().join(", ")} (${shapesEverSeen.size}/6).`);
console.log("Korrek-telling per vorm (laaste gesiene waarde):", correctCountByShape);
console.log(`${optionChecks} opsie-korrektheid-toetse, ${diagramChecks} skoon-figuur-toetse.`);

if (fails.length) {
  console.error(`\n✗ ${fails.length} wanpassing(s):`);
  fails.slice(0, 60).forEach(f => console.error("  " + f));
  process.exit(1);
}
if (shapesEverSeen.size !== 6) {
  console.error(`\n✗ net ${shapesEverSeen.size}/6 vorms ooit gesien oor ${RUNS} runs — onwaarskynlik, gaan die skommel na.`);
  process.exit(1);
}
console.log(`\n✓ ALMAL REG — ${questionCount} vrae, 6/6 vorms gesien, geen wanpassings, herprobeer bly altyd op dieselfde vorm.`);
