/* verify-stellings.html se toets, uitvoerbaar vanaf die terminaal.
   ------------------------------------------------------------------
   diagrams.js bou SVG as 'n STRING en raak nooit die DOM aan nie, so
   die hele "figure lieg nie" toets loop in node — belangrik omdat die
   Browser pane in hierdie projek nooit rAF/IntersectionObserver vuur
   nie en skermskote uitloop, so hierdie skrip is die vinnige manier.
   verify-stellings.html bly die visuele galery; hierdie is die toets.

   Run: node tools/verify-stellings.mjs        (exit 1 by enige wanpassing) */
import { CH6 } from "../js/quests/ch6-stellings.js";
import { runSuite } from "./verify-stellings-core.mjs";

const ROUNDS = Array.from({ length: 32 }, (_, i) => `st${i + 1}`);
const TRIES = 60;

const { diagrams, angleChecks, labelChecks, collisionChecks, fails, perRound } = runSuite(CH6, ROUNDS, TRIES);

console.log("Per rondte:");
for (const id of ROUNDS) {
  const r = perRound[id];
  if (!r) continue;
  console.log(`  ${id}: ${r.diagrams} diagramme, ${r.fails} wanpassing(s)`);
}

if (fails.length) {
  console.error(`\n✗ ${fails.length} wanpassing(s) oor ${diagrams} diagramme (${angleChecks} hoeke, ${labelChecks} etikette, ${collisionChecks} pare getoets):`);
  fails.slice(0, 100).forEach(f => console.error("  " + f));
  process.exit(1);
}
console.log(`\n✓ ALMAL OP SKAAL — ${diagrams} diagramme, ${angleChecks} hoeke, ${labelChecks} etikette getoets (${collisionChecks} etiket-pare, almal ≥18px), 0 wanpassings.`);
