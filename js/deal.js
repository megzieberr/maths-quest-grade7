/* ============================================================
   MENG-DEEL — gedeelde "N vrae eweredig oor 'n poel rondtes"
   logika. Gebruik deur die Daaglikse Quest (daily.js) ÉN die
   Dice Quest (dice.js) — presies dieselfde meganika, net 'n
   ander poel rondtes en 'n ander snellervoorwaarde by die
   oproepers. NIKS hier is hoofstuk- of skerm-spesifiek nie.
   ============================================================ */
import { pick, shuffled } from "./quests/_shared.js";

export const DEAL_TOTAL = 10;

/* bou 'n sintetiese { skills } quest-def: `total` vrae, EWEREDIG versprei
   oor `defs` (elk 'n reeds-opgesoekte { skills:[...] } quest-def) se eie
   vaardigheid-lyste, dan geskommel. 'n def sonder speelbare (built) skills
   word oorgeslaan; null kom terug as niks oorbly nie (nooit 'n fout nie —
   die oproeper (dailyTile/diceTile) laat dan eenvoudig geen kaart wys nie). */
export function dealMixed(defs, total = DEAL_TOTAL) {
  const usable = (defs || []).filter(d => d && Array.isArray(d.skills) && d.skills.length);
  if (!usable.length) return null;
  const n = usable.length, picked = [];
  for (let i = 0; i < total; i++) picked.push(pick(usable[i % n].skills));
  return { skills: shuffled(picked) };
}
