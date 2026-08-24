/* ============================================================
   WEEKLY HYPE — rally + crown announcements. Port of Circle Quest's
   js/weekly.js, adapted for Gr7 (see PLAN-weekly-winners.md):
     - no i18n module — Afrikaans strings hardcoded here
     - no nickname/avatar/champion layer — names come straight off
       each row's `name`
     - no WEEKLY_START/CHAMPION_REVEAL date gating — empty-board
       guards do that job instead (no popup on an empty board)
     - award names are Megan's exact 2026-08-24 rulings: 🌟 Ster van
       die Week · 📈 Grootste Sprong · 🔥 Aan die Brand · 🎯 Perfekte Week

   Two once-a-week dopamine moments, gated to one show per learner
   per week (localStorage flags) and to the right weekday:
     • Fri–Sun  RALLY  — live standings, "you're #N, only X XP behind
                         #N-1". Reads app.state.weekly (loaded by
                         app.js's refresh() alongside getState()).
     • Mon–Tue  CROWN  — last week's settled results, fetched fresh
                         from the server (api.weeklyResults) so every
                         device agrees.
   ============================================================ */
import { el } from "./ui.js";
import { api } from "./api.js";
import { getSession } from "./session.js";

const escapeHtml = s => String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

const RALLY_DAYS = new Set([5, 6, 0]);   // Fri, Sat, Sun (Date.getDay)
const CROWN_DAYS = new Set([1, 2]);      // Mon, Tue (grace day after results day)
const CHASE_XP   = 60;                    // "only N XP behind" chase line only under this gap

/* Monday-00:00 anchor of the week containing `d` (mirrors local-backend's startOfWeek). */
function startOfWeekTs(d = new Date()) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;       // 0 = Monday
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - day);
  return x.getTime();
}

/* per-learner "seen this week" flags */
const keyFor = app => `g7.weekly.${(app && app.state && app.state.student && app.state.student.id) || "anon"}`;
const DEFAULT = { rallyAnchor: 0, crownAnchor: 0 };
function read(app) { try { return { ...DEFAULT, ...(JSON.parse(localStorage.getItem(keyFor(app))) || {}) }; } catch { return { ...DEFAULT }; } }
function write(app, st) { try { localStorage.setItem(keyFor(app), JSON.stringify(st)); } catch { /* ignore */ } }

const daysWord = n => n === 1 ? "dag" : "dae";
const spotsWord = n => n === 1 ? "plek" : "plekke";

let crownBusy = false;   // guards the async crown fetch against re-render double-fires

/* ============================================================
   ORCHESTRATOR — call at the end of renderHub. No-ops unless it's
   the right day and this week's popup is unseen (or the board is
   empty — the "GRACEFUL before migration runs" guard).
   ============================================================ */
export function maybeShowWeekly(app) {
  const st = read(app);
  const now = new Date();
  const force = (() => { try { return new URLSearchParams(location.search).get("wk"); } catch { return null; } })();
  const nowAnchor = startOfWeekTs();
  const lastWeekId = nowAnchor - 7 * 864e5;   // stable per-week id for the crown "seen" guard

  const board = app && app.state && app.state.weekly;
  const me = app && app.state && app.state.myWeekly;

  // preview/teacher override (?wk=rally|crown): force exactly one popup,
  // bypassing the day + seen + empty-board gates so it can be checked any day.
  if (force === "crown") { fetchAndShowCrown(app, lastWeekId, true); return; }
  if (force === "rally") { showWeeklyModal(app, buildRally(board || [], me)); return; }

  // genuine path
  const day = now.getDay();

  // CROWN (Mon/Tue) — authoritative server results. Rally days (Fri–Sun) are
  // disjoint, so the two never compete on a real calendar.
  if (CROWN_DAYS.has(day) && st.crownAnchor !== lastWeekId) {
    fetchAndShowCrown(app, lastWeekId, false);
    return;
  }
  // RALLY (Fri–Sun) — live standings, only when the board actually has rows.
  if (RALLY_DAYS.has(day) && Array.isArray(board) && board.length && st.rallyAnchor !== nowAnchor) {
    showWeeklyModal(app, buildRally(board, me));
    st.rallyAnchor = nowAnchor; write(app, st);
  }
}

async function fetchAndShowCrown(app, lastWeekId, force) {
  if (crownBusy) return;
  crownBusy = true;
  try {
    const s = getSession();
    if (!s) return;
    const res = await api.weeklyResults(s.username, s.password);
    if (!res || !res.ok || !Array.isArray(res.board) || !res.board.length || !res.star) return;
    if (!force) { const st = read(app); st.crownAnchor = lastWeekId; write(app, st); }   // mark seen
    showWeeklyModal(app, buildCrown(res, app));
  } catch { /* offline, or the RPC hasn't shipped yet — the crown just won't show */ }
  finally { crownBusy = false; }
}

/* ---------------- rally ---------------- */
function buildRally(board, me) {
  return {
    kind: "rally",
    emoji: "🔥",
    eyebrow: "Naweek-afsluiting",
    headline: "Die ranglys sluit binnekort!",
    personalHTML: rallyPersonal(board, me),
    subHTML: "Speel nog 'n rondte voor Maandag om jou plek styf te hou.",
    winners: null,
    primaryLabel: "Kom ons gaan!",
  };
}

function rallyPersonal(board, me) {
  if (!me || !me.xp) return "Jy het nog nie hierdie week gespeel nie — spring nou in!";
  if (me.rank === 1) return "Jy is heel bo! 🏆 Hou jou plek styf vas.";
  const above = board.find(r => r.rank === me.rank - 1);
  const gap = above ? (above.xp - me.xp) : 0;
  if (above && gap > 0 && gap <= CHASE_XP)
    return `Jy is #${me.rank} — net ${gap} XP agter #${me.rank - 1}!`;
  return `Jy is #${me.rank} — speel gou-gou nog 'n rondte om te klim.`;
}

/* ---------------- crown ---------------- */
function buildCrown(res, app) {
  const meName = (app && app.state && app.state.student) ? app.state.student.name : null;
  const winners = [];
  if (res.star) winners.push({ icon: "🌟", label: "Ster van die Week", name: res.star.name, value: `★ ${res.star.xp}` });
  if (res.mostImproved) winners.push({ icon: "📈", label: "Grootste Sprong", name: res.mostImproved.name, value: `+${res.mostImproved.delta} XP` });
  if (res.onFire) winners.push({ icon: "🔥", label: "Aan die Brand", name: res.onFire.name, value: `${res.onFire.days} ${daysWord(res.onFire.days)}` });
  winners.forEach(w => { w.me = !!(meName && w.name === meName); });   // highlight a chip the learner won
  // PERFEKTE WEEK is not winner-take-all: EVERYONE who did all 7 dailies is named.
  if (Array.isArray(res.perfectWeek) && res.perfectWeek.length) {
    winners.push({
      icon: "🎯", label: "Perfekte Week",
      name: res.perfectWeek.join(", "),
      value: "7/7",
      me: !!(meName && res.perfectWeek.includes(meName)),
    });
  }
  return {
    kind: "crown",
    emoji: "🌟",
    eyebrow: "Vorige week se wenners",
    headline: "Die kroon is uitgedeel!",
    winners,
    personalHTML: crownPersonal(res),
    subHTML: null,
    primaryLabel: "Verstaan!",
  };
}

function crownPersonal(res) {
  const r = res.me ? res.me.rank : null;
  const xp = res.me ? res.me.xp : 0;
  if (r === 1) return "Jy was Ster van die Week! 🌟";
  if (!xp) return "Jy het verlede week nie gespeel nie — spring hierdie week in!";
  let move;
  if (res.prevRank == null) move = "Jou eerste volle week!";
  else if (r < res.prevRank) { const up = res.prevRank - r; move = `${up} ${spotsWord(up)} opgeklim 🔼`; }
  else if (r > res.prevRank) move = "Kom terug volgende week!";
  else move = "Jy hou dieselfde plek styf vas.";
  const best = (res.prevRank != null && xp > (res.bestPrevXp || 0)) ? " · Jou beste week nog!" : "";
  return `Jy het #${r} verlede week geëindig — ${move}${best}`;
}

/* ============================================================
   TEACHER PREVIEWS — exported for the admin dashboard (Session 3)
   so the real announcements can be screenshotted for the class
   WhatsApp group, without wiring into admin.js here. Same markup +
   CSS as the learners' modal, with the learner-personal line swapped
   for a top-3 podium (rally) or omitted (crown — just the awards).
   ============================================================ */
export function showCrownPreview(res) {
  const cfg = buildCrown(res, null);
  cfg.personalHTML = null;               // no learner to personalise for
  showWeeklyModal(null, cfg);
}
export function showRallyPreview(board) {
  const cfg = buildRally(board, null);
  cfg.personalHTML = podiumHTML(board);
  showWeeklyModal(null, cfg);
}
const MEDALS = ["🥇", "🥈", "🥉"];
const podiumHTML = board => (board || []).slice(0, 3)
  .map((r, i) => `${MEDALS[i]} <b>${escapeHtml(r.name)}</b> — ${r.xp} XP`)
  .join("<br>");

/* ---------------- modal ---------------- */
function showWeeklyModal(app, cfg) {
  document.querySelectorAll(".wk-overlay").forEach(n => n.remove());   // never stack
  const ov = el("div", "wk-overlay");
  const m = el("div", "wk-modal card wk-" + cfg.kind);
  m.innerHTML = `
    <button class="wk-close" aria-label="Maak toe">✕</button>
    <div class="wk-emoji">${cfg.emoji}</div>
    <span class="eyebrow">${cfg.eyebrow}</span>
    <h1>${cfg.headline}</h1>`;

  if (cfg.winners && cfg.winners.length) {
    const strip = el("div", "wk-winners");
    cfg.winners.forEach(w => strip.appendChild(el("div", "wk-award" + (w.me ? " you" : ""), `
      <span class="wk-aw-icon">${w.icon}</span>
      <span class="wk-aw-body"><span class="wk-aw-label">${w.label}</span><span class="wk-aw-name">${escapeHtml(w.name)}${w.me ? ` <span class="tag-you">Jy</span>` : ""}</span></span>
      ${w.value ? `<span class="wk-aw-xp">${w.value}</span>` : ""}`)));
    m.appendChild(strip);
  }
  if (cfg.personalHTML) m.appendChild(el("div", "wk-personal", cfg.personalHTML));
  if (cfg.subHTML) m.appendChild(el("div", "wk-sub muted small", cfg.subHTML));

  const actions = el("div", "wk-actions");
  const close = () => { ov.classList.remove("show"); document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); setTimeout(() => ov.remove(), 200); };
  const onKey = e => { if (e.key === "Escape") close(); };
  const primary = el("button", "btn primary big", cfg.primaryLabel);
  primary.addEventListener("click", close);
  actions.appendChild(primary);
  if (app) {   // no leaderboard to jump to in the admin preview
    const seeBoard = el("button", "wk-seeboard", "Sien die Leaderboard");
    seeBoard.addEventListener("click", () => { close(); app.go("leaderboard"); });
    actions.appendChild(seeBoard);
  }
  m.appendChild(actions);

  m.querySelector(".wk-close").addEventListener("click", close);
  ov.addEventListener("click", e => { if (e.target === ov) close(); });
  document.addEventListener("keydown", onKey);

  ov.appendChild(m);
  document.body.appendChild(ov);
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => ov.classList.add("show"));
}
