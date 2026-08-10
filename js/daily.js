/* ============================================================
   DAAGLIKSE QUEST — 'n klein "hersiening" rondte wat elke dag
   vars saamgestel word uit die rondtes wat die juffrou in die
   admin-dashboard as "🗓️ Hersiening" gemerk het (los van oop/toe).
   ------------------------------------------------------------
   Speel deur die GEWONE speel-skerm (renderPlay in play.js) — ons
   bou net 'n sintetiese { skills } def en 'n sintetiese "hoofstuk"
   (vir accent/ikoon) en stuur dit deur app.go("play", …), presies
   soos 'n regte rondte. Dit hergebruik play.js se vraag-verversing
   (freshQuestion) en die "nie herhaal nie"-wag heeltemal — daar is
   NIKS hier gedupliseer nie.

   GRACEFUL: as die agterkant (nog) nie `state.revision` stuur nie
   (ou live bediener voor die migrasie loop), gee revisionIds() net
   'n leë lys terug, dailyTile() gee null terug, en die MC-teël
   verskyn eenvoudig nie — geen fout, geen "Binnekort" niks nie.
   ============================================================ */
import { el } from "./ui.js";
import { pick, shuffled } from "./quests/_shared.js";
import { questDef } from "./quests/index.js";

const ACCENT = "#f59e0b";              // amber — hoort by geen bestaande hoofstuk-kleur nie
const FALLBACK_KEY = "g7.dailyDoneFallback";
const TOTAL_QUESTIONS = 10;

const pad2 = n => String(n).padStart(2, "0");
export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
export function dailyQuestId() { return `daily-${todayStr()}`; }

/* die lys rondte-id's wat tans "in hersiening" gemerk is (leeg as die
   agterkant die veld nog nie stuur nie — sien GRACEFUL hierbo). */
export function revisionIds(app) {
  const r = app && app.state && app.state.revision;
  return Array.isArray(r) ? r : [];
}

/* bou 'n sintetiese quest-def: 10 vrae, EWEREDIG versprei oor die
   gemerkte rondtes se eie vaardigheid-lyste (skills). 'n rondte met
   geen speelbare (built) def of leë skills word oorgeslaan. */
export function buildDailyDef(ids) {
  const defs = ids.map(id => questDef(id)).filter(d => d && Array.isArray(d.skills) && d.skills.length);
  if (!defs.length) return null;
  const n = defs.length, picked = [];
  for (let i = 0; i < TOTAL_QUESTIONS; i++) picked.push(pick(defs[i % n].skills));
  return { skills: shuffled(picked) };
}

/* "Klaar vir vandag!" — eers uit app.state.progress (die regte bron),
   met 'n plaaslike terugval (markDailyDone) vir die geval waar 'n
   opknapping/verversing dit nog nie raakgesien het nie. */
export function isDailyDoneToday(app) {
  const id = dailyQuestId();
  const prog = app && app.state && app.state.progress && app.state.progress[id];
  if (prog && prog.passed) return true;
  try {
    const fb = JSON.parse(localStorage.getItem(FALLBACK_KEY) || "null");
    return !!(fb && fb.date === todayStr() && fb.passed);
  } catch { return false; }
}
export function markDailyDone() {
  try { localStorage.setItem(FALLBACK_KEY, JSON.stringify({ date: todayStr(), passed: true })); } catch { /* plaaslike terugval is opsioneel */ }
}

/* die hub-teël. Gee null terug (dus niks gewys nie) as daar geen
   rondte in hersiening is nie, OF as geeneen van hulle 'n speelbare
   def het nie (bv. rondtes wat nog nie in hierdie kliënt gebou is nie). */
export function dailyTile(app) {
  const ids = revisionIds(app);
  if (!ids.length) return null;
  const def = buildDailyDef(ids);
  if (!def) return null;

  const done = isDailyDoneToday(app);
  const card = el("div", "ch-card daily-card");
  card.style.setProperty("--accent", ACCENT);
  card.innerHTML = `
    <div class="ico">🗓️</div>
    <h2>Daaglikse Quest ${done ? '<span class="pill done">Klaar ✓</span>' : '<span class="pill open">Oop</span>'}</h2>
    <div class="sub">${done ? "Klaar vir vandag! ⭐ Jy kan gerus weer speel vir oefening." : "10 vinnige vrae uit die rondtes wat jy nou hersien."}</div>`;
  card.addEventListener("click", () => {
    const chapter = { id: "daily", icon: "🗓️", name: "Daaglikse Quest", signature: ACCENT };
    const quest = { id: dailyQuestId(), title: "Daaglikse Quest" };
    app.go("play", { chapter, quest, def, accent: ACCENT });
  });
  return card;
}
