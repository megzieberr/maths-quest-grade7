/* verify-stellings.html se toets, uitvoerbaar vanaf die terminaal.
   ------------------------------------------------------------------
   diagrams.js bou SVG as 'n STRING en raak nooit die DOM aan nie, so
   die hele "figure lieg nie" toets loop in node — belangrik omdat die
   Browser pane in hierdie projek nooit rAF/IntersectionObserver vuur
   nie en skermskote uitloop, so hierdie skrip is die vinnige manier.
   verify-stellings.html bly die visuele galery; hierdie is die toets.

   Run: node tools/verify-stellings.mjs        (exit 1 by enige wanpassing) */
import { CH6 } from "../js/quests/ch6-stellings.js";
import { CH3 } from "../js/quests/ch3-meetkunde.js";
import { CH4 } from "../js/quests/ch4-vorms.js";
import { runSuite } from "./verify-stellings-core.mjs";

const ST_ROUNDS = Array.from({ length: 32 }, (_, i) => `st${i + 1}`);
/* Sessie 2 (2026-08-13): Deel-2-hersieningsrondtes vir hfst 3 (m1b–m10b) —
   dieselfde _chk-meganisme, ander registrasie-lêer (CH3, nie CH6 nie). */
const M_ROUNDS = Array.from({ length: 10 }, (_, i) => `m${i + 1}b`);
/* Sessie 3 (2026-08-13): Deel-2-hersieningsrondtes vir hfst 4 (s1b–s10b) —
   net s3b teken 'n egte meetbare hoekfiguur (die res het figure sonder
   getekende booghoeke, dus 0 diagram-toetse vir dié, en dis verwag). */
const S_ROUNDS = Array.from({ length: 10 }, (_, i) => `s${i + 1}b`);
const TRIES = 60;

const st = runSuite(CH6, ST_ROUNDS, TRIES);
const m = runSuite(CH3, M_ROUNDS, TRIES);
const s = runSuite(CH4, S_ROUNDS, TRIES);

const diagrams = st.diagrams + m.diagrams + s.diagrams;
const angleChecks = st.angleChecks + m.angleChecks + s.angleChecks;
const labelChecks = st.labelChecks + m.labelChecks + s.labelChecks;
const collisionChecks = st.collisionChecks + m.collisionChecks + s.collisionChecks;
const fails = [...st.fails, ...m.fails, ...s.fails];
const perRound = { ...st.perRound, ...m.perRound, ...s.perRound };

console.log("Per rondte (hfst 6 — st1–st32):");
for (const id of ST_ROUNDS) {
  const r = perRound[id];
  if (!r) continue;
  console.log(`  ${id}: ${r.diagrams} diagramme, ${r.fails} wanpassing(s)`);
}
console.log("Per rondte (hfst 3 Deel 2 — m1b–m10b):");
for (const id of M_ROUNDS) {
  const r = perRound[id];
  if (!r) continue;
  console.log(`  ${id}: ${r.diagrams} diagramme, ${r.fails} wanpassing(s)`);
}
console.log("Per rondte (hfst 4 Deel 2 — s1b–s10b):");
for (const id of S_ROUNDS) {
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
