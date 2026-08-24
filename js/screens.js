/* Hub (hoofstuk-kaarte), hoofstuk (quest-kaart) en uitslae.
   Vordering kom van app.state (deur die api gelaai). */
import { CHAPTERS, chapterById, questAccent, PASS } from "./config.js";
import { questDef } from "./quests/index.js";
import { el } from "./ui.js";
import { installEntryButton } from "./install.js";
import { dailyTile, markDailyDone } from "./daily.js";
import { diceTile, buildDiceDef } from "./dice.js";
import { openSetOf, isOpen, progressOf, isChainLocked, nextPlayableQuest } from "./chain.js";
import { maybeShowWeekly } from "./weekly.js";

function setAccent(host, accent) { if (accent) host.style.setProperty("--accent", accent); }

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
  const dt = dailyTile(app);
  if (dt) cards.appendChild(dt);
  cards.appendChild(leaderboardTile(app));
  CHAPTERS.filter(ch => !ch.archived).forEach(ch => {
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

  const install = installEntryButton();
  if (install) {
    const row = el("div", "install-row");
    row.appendChild(install);
    host.appendChild(row);
  }

  // Star of the Week / rally popups — Fri–Sun rally, Mon–Tue crown, or
  // forced via ?wk=rally|crown. No-ops off-day, already-seen, or empty
  // board (incl. before migration-weekly.sql has run). Never let a popup
  // glitch blank the hub.
  try { maybeShowWeekly(app); } catch { /* non-critical */ }
}

/* 🏆 Leaderboard hub tile — a permanent entry point (unlike the Daaglikse
   Quest tile, this never self-omits: the board's own empty state lives
   inside the screen, not here). */
const LB_ACCENT = "#f5b50a";   // var(--star) gold, distinct from every chapter colour
function leaderboardTile(app) {
  const card = el("div", "ch-card lb-card");
  card.style.setProperty("--accent", LB_ACCENT);
  card.innerHTML = `
    <div class="ico">🏆</div>
    <h2>Leaderboard</h2>
    <div class="sub">Sien wie hierdie week vooruit is.</div>`;
  card.addEventListener("click", () => app.go("leaderboard"));
  return card;
}

/* ---------------- HOOFSTUK · quest-kaart ---------------- */
export function renderChapter(app, host, params) {
  const ch = chapterById(params.chapterId);
  /* geargiveerde hoofstukke (bv. Uitdrukkings, Vergelykings) is glad nie meer
     leerder-sigbaar nie — 'n verouderde teël of diep skakel stuur net terug hub toe,
     dieselfde patroon as 'n onbekende chapterId. */
  if (!ch || ch.archived) return app.go("hub");

  const head = el("div", "chap-head");
  head.style.setProperty("--accent", ch.signature);
  head.innerHTML = `<div><span class="eyebrow">${ch.icon} Afdeling ${ch.n}</span><h1>${ch.name}</h1></div>
    <button class="link-btn back" aria-label="Terug">←</button>`;
  head.querySelector(".back").addEventListener("click", () => app.go("hub"));
  host.appendChild(head);

  // 🎲 Dice Quest — bo-aan hierdie hoofstuk se rondte-rooster (dice.js);
  // gee eenvoudig geen kaart terug (self-omit) as die poel leeg is.
  const dt = diceTile(app, ch);
  if (dt) host.appendChild(dt);

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
    /* Sekwensiële slot (chapter 6 "Meetkunde Stellings" ALLEEN) — dieselfde
       reël as die speel-skerm se navigasie-wag (chain.js), sodat 'n teël en
       'n diep skakel altyd dieselfde ding sê. */
    const chainLocked = playable && isChainLocked(app, ch, q.id);
    const prog = progressOf(app, q.id);
    const card = el("div", "quest" + (playable && !chainLocked ? "" : " locked"));
    card.style.setProperty("--qc", accent);
    const state = !playable ? "Binnekort" : chainLocked ? "Gesluit" : prog.passed ? "Gemeester" : prog.attempts ? "Aan die gang" : "Oop";
    card.innerHTML = `
      <div class="qn">${q.n}</div>
      ${prog.passed ? '<div class="qcheck">✓</div>' : chainLocked ? '<div class="qcheck qlock">🔒</div>' : ""}
      <h3>${q.title}</h3>
      <p>${chainLocked ? "Voltooi eers die vorige rondte." : (q.blurb || "")}</p>
      <div class="qstate"><span class="led"></span>${state}</div>`;
    if (playable && !chainLocked) {
      card.addEventListener("click", () => app.go("play", { chapter: ch, quest: q, def, accent }));
    } else if (chainLocked) {
      // sag "nee" — tik doen niks, net 'n klein wiggle, geen navigasie nie.
      card.addEventListener("click", () => {
        card.classList.remove("wiggle");
        void card.offsetWidth; // herstart die animasie as dit al geloop het
        card.classList.add("wiggle");
      });
    }
    grid.appendChild(card);
  });
  host.appendChild(grid);
}

/* ---------------- UITSLAE ---------------- */
export function renderResults(app, host, params) {
  const { chapter, quest, def, accent, score, xp, firstTry, total, badgeEarned, alreadyPassed, xpAwarded } = params;
  const pct = Math.round(score * 100);
  const passed = score >= PASS;
  if (passed && String(quest.id).startsWith("daily-")) markDailyDone();
  /* 🎲 Dice Quest wys die BEDIENER se uitbetaling — die getal op die skerm
     moet die getal wees wat werklik by die leerder se ★ bygetel word, nie die
     kliënt se strook-XP nie. Val terug op presies die RPC se formule (10 per
     eerste-keer-reg) solank die agterkant (nog) nie geantwoord het nie. */
  const isDice = String(quest.id).startsWith("dice-");
  const shownXp = isDice ? (typeof xpAwarded === "number" ? xpAwarded : firstTry * 10) : xp;

  const screen = el("div", "results");
  setAccent(screen, accent);
  const card = el("div", "result-card");
  card.innerHTML = `
    <div class="result-emoji">${passed ? "🎉" : "💪"}</div>
    <h1>Quest klaar!</h1>
    <div class="big-score">${pct}%</div>
    <p class="muted">${firstTry} / ${total} reg met die eerste probeerslag · <span class="num">★ +${shownXp} XP</span></p>
    <div class="result-msg ${passed ? "good" : "warn"}">${isDice
      ? (passed ? "Geslaag! Elke gooi verdien XP." : "Amper! Gooi weer — elke gooi verdien XP.")
      : (passed ? "Geslaag — kenteken verdien!" : "Amper! Kry 80% eerste-keer reg vir die kenteken.")}</div>
    ${badgeEarned ? `<div class="badge-pop"><span class="bi">${chapter.icon}</span>${quest.title} gemeester</div>` : ""}
    ${alreadyPassed ? `<div class="result-msg warn">Oefenrondte — reeds gemeester, dus geen nuwe XP nie.</div>` : ""}
    <div class="result-actions"></div>`;
  const actions = card.querySelector(".result-actions");
  const mk = (label, primary, fn) => { const b = el("button", "btn " + (primary ? "primary big" : "ghost big"), label); b.addEventListener("click", fn); actions.appendChild(b); };
  const replay = () => app.go("play", { chapter, quest, def: questDef(quest.id) || def, accent });
  const toChapter = () => app.go(chapter.id === "daily" ? "hub" : "chapter", { chapterId: chapter.id });
  /* Feature 1 (2026-08-10): "Volgende rondte →" — net op 'n GESLAAGDE,
     nie-daaglikse quest, en net wanneer daar regtig 'n volgende
     speelbare rondte in dieselfde hoofstuk is (chain.js dra dieselfde
     "juffrou-oop + geketting"-reël wat die hoofstuk-rooster gebruik,
     sodat hierdie knoppie nooit 'n geslote of gesluite rondte oopmaak). */
  const isDaily = chapter.id === "daily" || String(quest.id).startsWith("daily-");
  const next = passed && !isDaily && !isDice ? nextPlayableQuest(app, chapter, quest.id) : null;
  if (isDice) {
    // 🎲 Gooi weer — 'n HEELTEMAL vars gooi (nuwe deel, nuwe getalle), nie
    // net 'n herspeel van dieselfde 10 vaardighede nie. dice.js se
    // sintetiese "hoofstuk" dra steeds die REGTE hoofstuk-id, so ons kan
    // die poel herbou; het dit intussen leeg geword (juffrou het toegemaak,
    // of — hoofstuk 6 — die ketting is nie meer oop nie), val ons sag terug
    // hoofstuk toe — nooit 'n fout nie (dieselfde GRACEFUL-patroon as orals).
    const rethrow = () => {
      const realChapter = chapterById(chapter.id);
      const freshDef = realChapter && buildDiceDef(app, realChapter);
      if (!freshDef) { app.go("chapter", { chapterId: chapter.id }); return; }
      app.go("play", { chapter, quest, def: freshDef, accent });
    };
    mk("🎲 Gooi weer", true, rethrow);
    mk("Terug na quests", false, toChapter);
  } else if (passed && next) {
    const builtTotal = (chapter.quests || []).filter(q => q.built).length;
    const nextAccent = questAccent(chapter, next.n, builtTotal);
    const goNext = () => app.go("play", { chapter, quest: next, def: questDef(next.id), accent: nextAccent });
    mk("Volgende rondte →", true, goNext);
    mk("Terug na quests", false, toChapter);
    mk("Speel weer", false, replay);
  } else if (passed) { mk("Terug na quests", true, toChapter); mk("Speel weer", false, replay); }
  else { mk("Probeer weer", true, replay); mk("Terug na quests", false, toChapter); }
  screen.appendChild(card);
  host.appendChild(screen);
}
