/* Hub (hoofstuk-kaarte), hoofstuk (quest-kaart) en uitslae.
   Vordering kom van app.state (deur die api gelaai). */
import { CHAPTERS, chapterById, questAccent, PASS } from "./config.js";
import { questDef } from "./quests/index.js";
import { el } from "./ui.js";

const progressOf = (app, id) => (app.state && app.state.progress && app.state.progress[id]) || { best_score: 0, attempts: 0, passed: false, total_xp: 0 };
function setAccent(host, accent) { if (accent) host.style.setProperty("--accent", accent); }

/* Quest-hek: app.state.openQuests is 'n lys oop rondte-id's. As dit ontbreek
   (bv. agterkant nog nie opgedateer nie) → behandel ALLES as oop (null). */
const openSetOf = app => { const oq = app.state && app.state.openQuests; return Array.isArray(oq) ? new Set(oq) : null; };
const isOpen = (set, id) => set === null || set.has(id);

/* ---------------- HUB ---------------- */
export function renderHub(app, host) {
  const name = ((app.state && app.state.student && app.state.student.name) || "").split(" ")[0];
  const head = el("div", "hub-head");
  head.innerHTML = `<span class="eyebrow">Graad 7 · Kwartaal 3</span>
    <h1>Hi, ${name || "daar"}! 👋</h1>
    <p>Kies 'n afdeling om te oefen.</p>`;
  host.appendChild(head);

  const openSet = openSetOf(app);
  const cards = el("div", "chapter-cards");
  CHAPTERS.forEach(ch => {
    const openQ = (ch.quests || []).filter(q => q.built && isOpen(openSet, q.id));
    const live = ch.open && openQ.length > 0;
    const card = el("div", "ch-card" + (live ? "" : " locked"));
    card.style.setProperty("--accent", ch.signature);
    if (live) {
      const total = openQ.length;
      const done = openQ.filter(q => progressOf(app, q.id).passed).length;
      const pct = total ? Math.round(done / total * 100) : 0;
      const allDone = total && done === total;
      card.innerHTML = `
        <div class="ico">${ch.icon}</div>
        <h2>${ch.name} ${allDone ? '<span class="pill done">Klaar ✓</span>' : '<span class="pill open">Oop</span>'}</h2>
        <div class="sub">${ch.blurb || ""}</div>
        <div class="ch-meta"><span>${total} quest${total > 1 ? "s" : ""} oop</span><span class="num">${done} / ${total} gemeester</span></div>
        <div class="ch-prog" style="--p:${pct}%"><i></i></div>`;
      card.addEventListener("click", () => app.go("chapter", { chapterId: ch.id }));
    } else {
      card.innerHTML = `<div class="ico">${ch.icon}</div>
        <h2>${ch.name} <span class="pill soon">Binnekort</span></h2>
        <div class="sub">Oop sodra ons dit in die klas gedoen het.</div>`;
    }
    cards.appendChild(card);
  });
  host.appendChild(cards);
}

/* ---------------- HOOFSTUK · quest-kaart ---------------- */
export function renderChapter(app, host, params) {
  const ch = chapterById(params.chapterId);
  if (!ch) return app.go("hub");

  const head = el("div", "chap-head");
  head.style.setProperty("--accent", ch.signature);
  head.innerHTML = `<div><span class="eyebrow">${ch.icon} Afdeling ${ch.n}</span><h1>${ch.name}</h1></div>
    <button class="link-btn back" aria-label="Terug">←</button>`;
  head.querySelector(".back").addEventListener("click", () => app.go("hub"));
  host.appendChild(head);

  const openSet = openSetOf(app);
  const builtTotal = (ch.quests || []).filter(q => q.built).length;
  const quests = (ch.quests || []).filter(q => q.built && isOpen(openSet, q.id));
  if (!quests.length) {
    host.appendChild(el("div", "card", `<p class="muted center" style="padding:22px 4px">Nog geen rondtes hier oop nie — jou juffrou maak elke rondte oop sodra julle dit in die klas gedoen het. Kom kyk gou weer! 🙂</p>`));
    return;
  }
  const grid = el("div", "quest-grid");
  quests.forEach(q => {
    const accent = questAccent(ch, q.n, builtTotal);
    const def = questDef(q.id);
    const playable = q.built && !!def;
    const prog = progressOf(app, q.id);
    const card = el("div", "quest" + (playable ? "" : " locked"));
    card.style.setProperty("--qc", accent);
    const state = !playable ? "Binnekort" : prog.passed ? "Gemeester" : prog.attempts ? "Aan die gang" : "Oop";
    card.innerHTML = `
      <div class="qn">${q.n}</div>
      ${prog.passed ? '<div class="qcheck">✓</div>' : ""}
      <h3>${q.title}</h3>
      <p>${q.blurb || ""}</p>
      <div class="qstate"><span class="led"></span>${state}</div>`;
    if (playable) card.addEventListener("click", () => app.go("play", { chapter: ch, quest: q, def, accent }));
    grid.appendChild(card);
  });
  host.appendChild(grid);
}

/* ---------------- UITSLAE ---------------- */
export function renderResults(app, host, params) {
  const { chapter, quest, accent, score, xp, firstTry, total, badgeEarned, alreadyPassed } = params;
  const pct = Math.round(score * 100);
  const passed = score >= PASS;

  const screen = el("div", "results");
  setAccent(screen, accent);
  const card = el("div", "result-card");
  card.innerHTML = `
    <div class="result-emoji">${passed ? "🎉" : "💪"}</div>
    <h1>Quest klaar!</h1>
    <div class="big-score">${pct}%</div>
    <p class="muted">${firstTry} / ${total} reg met die eerste probeerslag · <span class="num">★ +${xp} XP</span></p>
    <div class="result-msg ${passed ? "good" : "warn"}">${passed ? "Geslaag — kenteken verdien!" : "Amper! Kry 80% eerste-keer reg vir die kenteken."}</div>
    ${badgeEarned ? `<div class="badge-pop"><span class="bi">${chapter.icon}</span>${quest.title} gemeester</div>` : ""}
    ${alreadyPassed ? `<div class="result-msg warn">Oefenrondte — reeds gemeester, dus geen nuwe XP nie.</div>` : ""}
    <div class="result-actions"></div>`;
  const actions = card.querySelector(".result-actions");
  const mk = (label, primary, fn) => { const b = el("button", "btn " + (primary ? "primary big" : "ghost big"), label); b.addEventListener("click", fn); actions.appendChild(b); };
  const replay = () => app.go("play", { chapter, quest, def: questDef(quest.id), accent });
  const toChapter = () => app.go("chapter", { chapterId: chapter.id });
  if (passed) { mk("Terug na quests", true, toChapter); mk("Speel weer", false, replay); }
  else { mk("Probeer weer", true, replay); mk("Terug na quests", false, toChapter); }
  screen.appendChild(card);
  host.appendChild(screen);
}
