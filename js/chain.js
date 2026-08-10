/* ============================================================
   SEKWENSIËLE ONTSLUITING — Hoofstuk 6 "Meetkunde Stellings" ALLEEN.
   ------------------------------------------------------------
   Een reël, herbruik deur die hoofstuk-rooster (teël-slot-styl) EN
   die speel-skerm se navigasie-wag, sodat 'n verouderde skerm of
   diep skakel nooit die slot kan omseil nie.

   Reël: neem die hoofstuk se GEBOU rondtes, filtreer na die juffrou-
   OOP lys (app.state.openQuests — dieselfde "null = alles oop"
   terugval wat orals elders gebruik word, sien screens.js). Dié
   gefiltreerde lys is "die ketting". Die EERSTE oop rondte is altyd
   speelbaar. Elke latere oop rondte is net speelbaar wanneer die
   VORIGE oop rondte in die ketting geslaag is (progress[id].passed
   — dieselfde bron as die teëls se "gemeester"-styl).
   ============================================================ */
import { chapterById } from "./config.js";
import { questDef } from "./quests/index.js";

/* Quest-hek helpers — enigste bron van waarheid, herbruik deur screens.js. */
export const openSetOf = app => { const oq = app.state && app.state.openQuests; return Array.isArray(oq) ? new Set(oq) : null; };
export const isOpen = (set, id) => set === null || set.has(id);
export const progressOf = (app, id) => (app.state && app.state.progress && app.state.progress[id]) || { best_score: 0, attempts: 0, passed: false, total_xp: 0 };

/* hoofstukke waar die sekwensiële slot geld — chapter 6 ALLEEN (haar reël). */
const CHAIN_CHAPTERS = new Set(["stellings"]);

/* die "kandidaat-lys" wat beide die ketting-reël EN die "volgende rondte"-
   knoppie loop: gebou + juffrou-oop + het regtig 'n geregistreerde def
   (dieselfde "playable" toets as die hoofstuk-rooster). */
function playableList(app, ch) {
  if (!ch) return [];
  const openSet = openSetOf(app);
  return (ch.quests || []).filter(q => q.built && isOpen(openSet, q.id) && !!questDef(q.id));
}

function resolveChapter(chapterOrId) {
  return typeof chapterOrId === "string" ? chapterById(chapterOrId) : chapterOrId;
}

/* die ketting vir 'n hoofstuk — null as die hoofstuk nie geketting is nie. */
export function chainFor(app, chapterOrId) {
  const ch = resolveChapter(chapterOrId);
  if (!ch || !CHAIN_CHAPTERS.has(ch.id)) return null;
  return playableList(app, ch);
}

/* true wanneer questId deur die ketting-reël gesluit is. Altyd false
   buite CHAIN_CHAPTERS, false vir die eerste rondte in die ketting, EN
   false sodra die rondte self reeds geslaag is (herspeel bly altyd toe). */
export function isChainLocked(app, chapterOrId, questId) {
  const chain = chainFor(app, chapterOrId);
  if (!chain) return false;
  const idx = chain.findIndex(q => q.id === questId);
  if (idx <= 0) return false;
  if (progressOf(app, questId).passed) return false;
  return !progressOf(app, chain[idx - 1].id).passed;
}

/* die volgende speelbare rondte in DIESELFDE hoofstuk ná questId (vir die
   "Volgende rondte →" knoppie). Werk vir ALLE hoofstukke — buite
   CHAIN_CHAPTERS is dit net "die volgende gebou+oop rondte"; binne 'n
   geketting-hoofstuk word dieselfde ketting-reël hierbo toegepas. */
export function nextPlayableQuest(app, chapterOrId, questId) {
  const ch = resolveChapter(chapterOrId);
  if (!ch) return null;
  const list = playableList(app, ch);
  const idx = list.findIndex(q => q.id === questId);
  if (idx === -1 || idx + 1 >= list.length) return null;
  const next = list[idx + 1];
  return isChainLocked(app, ch, next.id) ? null : next;
}
