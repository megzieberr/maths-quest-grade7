/* ============================================================
   DICE QUEST 🎲 — 'n "gooi"-kaart BINNE elke hoofstuk se eie
   bladsy (bo-aan sy rondte-rooster, nie op die hub nie): 10 vrae,
   EWEREDIG versprei oor DIÉ hoofstuk se juffrou-OOP rondtes,
   geskommel. Speel deur dieselfde GEWONE speel-skerm as elke ander
   rondte (renderPlay in play.js), met 'n sintetiese "hoofstuk" vir
   accent/ikoon — presies die Daaglikse Quest se patroon (daily.js),
   net 'n ander bron-poel (hierdie hoofstuk se eie rondtes i.p.v. die
   "🗓️ Hersiening"-lys) EN 'n ander XP-pad: Dice Quest betaal ELKE
   speel (nie net eerste-keer-slaag nie) — sien play.js se dice-tak
   + supabase/migration-dice.sql.

   Hoofstuk 6 "Meetkunde Stellings": die poel is ALLEEN die Gemeng-
   rondtes (st28–st32) — 'n enkel-stelling-rondte se leidraad noem
   sy stelling se naam, en sou die antwoord in 'n gemengde deel
   weglek. Die kaart verskyn eers sodra die leerder se ketting st28
   ontsluit het (dieselfde slot as die rondte-rooster self).

   GRACEFUL: 'n leë poel (alles toe, of — by hoofstuk 6 — st28 nog
   gesluit) gee eenvoudig geen kaart terug nie — geen fout nie.
   ============================================================ */
import { el } from "./ui.js";
import { dealMixed } from "./deal.js";
import { questDef } from "./quests/index.js";
import { openSetOf, isOpen, isChainLocked } from "./chain.js";

/* hoofstuk-id → dobbelsteen-poel-kode (gebruik in die quest-id "dice-<kode>"). */
const POOL_CODE = { meetkunde: "m", vorms: "s", transformasies: "t", stellings: "st" };
const STELLINGS_GEMENG_IDS = ["st28", "st29", "st30", "st31", "st32"];

export function diceQuestId(code) { return `dice-${code}`; }
export function poolFromDiceId(questId) { return String(questId).startsWith("dice-") ? questId.slice(5) : null; }

/* die rondte-id-poel vir 'n hoofstuk se dobbelsteen — net juffrou-OOP
   rondtes (m1c/m11-styl geslote rondtes val outomaties uit). Hoofstuk 6:
   ALLEEN die Gemeng-rondtes. */
export function dicePoolIds(app, chapter) {
  if (!chapter || !POOL_CODE[chapter.id]) return [];
  const openSet = openSetOf(app);
  if (chapter.id === "stellings") {
    return STELLINGS_GEMENG_IDS.filter(id => isOpen(openSet, id));
  }
  return (chapter.quests || []).filter(q => q.built && isOpen(openSet, q.id)).map(q => q.id);
}

/* die sintetiese { skills } def vir hierdie hoofstuk se gooi — null as
   die poel leeg is (self-omit, sien lêerkop). */
export function buildDiceDef(app, chapter) {
  const ids = dicePoolIds(app, chapter);
  return dealMixed(ids.map(id => questDef(id)));
}

/* true wanneer die dobbelsteen-kaart vir hierdie hoofstuk nie mag wys nie —
   ALLEEN hoofstuk 6, ALLEEN terwyl die leerder se ketting st28 nog nie
   ontsluit het nie (dieselfde reël as die rondte-rooster se eie teël-slot,
   chain.js). Uitgevoer (nie net inline in diceTile nie) sodat
   tools/fuzz-dice.mjs dit sonder 'n DOM kan toets. */
export function isDiceChainLocked(app, chapter) {
  return !!(chapter && chapter.id === "stellings" && isChainLocked(app, chapter, "st28"));
}

/* die kaart — bo-aan 'n hoofstuk se rondte-rooster (renderChapter in
   screens.js). */
export function diceTile(app, chapter) {
  const code = chapter && POOL_CODE[chapter.id];
  if (!code) return null;
  if (isDiceChainLocked(app, chapter)) return null;
  const def = buildDiceDef(app, chapter);
  if (!def) return null;

  const card = el("div", "ch-card dice-card");
  card.style.setProperty("--accent", chapter.signature);
  card.innerHTML = `
    <div class="ico">🎲</div>
    <h2>Dice Quest</h2>
    <div class="sub">10 gemengde vrae uit hierdie hoofstuk — elke keer splinternuut!</div>`;
  card.addEventListener("click", () => {
    // sintetiese "hoofstuk" vir accent/ikoon, MAAR met die REGTE hoofstuk-id
    // (nie 'n los "dice"-id soos daily.js se "daily" nie) — die uitslae-skerm
    // se "🎲 Gooi weer" moet die regte poel kan heropbou (screens.js).
    const synthChapter = { id: chapter.id, icon: "🎲", name: "Dice Quest", signature: chapter.signature };
    const quest = { id: diceQuestId(code), title: "Dice Quest" };
    app.go("play", { chapter: synthChapter, quest, def, accent: chapter.signature });
  });
  return card;
}
