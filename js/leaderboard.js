/* Leaderboard: weekly (resets) and all-time. Top ten, mobile-game style,
   and the learner always sees their own row even outside the top ten.
   Port of Circle Quest's js/leaderboard.js — no i18n module (strings
   hardcoded here, English UI chrome), no nickname/avatar layer (Gr7 has
   none — names come straight off each row's `name`), screen name is
   "Leaderboard" (her explicit ruling, not "Ranglys").

   GRACEFUL: on live, api.leaderboard() throws until migration-weekly.sql
   has run — caught below, friendly Afrikaans empty state, no console
   error. */
import { api } from "./api.js";
import { getSession } from "./session.js";
import { el, clear } from "./ui.js";

const escapeHtml = s => String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const OFFLINE_MSG = "Die ranglys laai nie nou nie — probeer later weer.";

export async function renderLeaderboard(app, host) {
  clear(host);
  const screen = el("div", "leaderboard");
  screen.innerHTML = `
    <div class="lb-head">
      <button class="link-btn back" aria-label="Terug">←</button>
      <h1>🏆 Leaderboard</h1>
    </div>
    <div class="lb-tabs">
      <button class="tab active" data-scope="weekly">Hierdie week</button>
      <button class="tab" data-scope="allTime">Altyd</button>
    </div>
    <div class="lb-list">Laai...</div>`;
  screen.querySelector(".back").addEventListener("click", () => app.go("hub"));
  host.appendChild(screen);

  const list = screen.querySelector(".lb-list");
  const sess = getSession();
  let data = null;
  try { data = await api.leaderboard(sess.username, sess.password); }
  catch { list.textContent = OFFLINE_MSG; return; }
  if (!data || !data.ok) { list.textContent = OFFLINE_MSG; return; }

  const myName = (app.state && app.state.student && app.state.student.name) || null;

  function row(r, isMe) {
    const medal = r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : r.rank === 3 ? "🥉" : `${r.rank}`;
    const d = el("div", "lb-row" + (isMe ? " me" : ""));
    d.innerHTML = `
      <span class="lb-rank">${medal}</span>
      <span class="lb-name">${escapeHtml(r.name)}${isMe ? ` <span class="tag-you">Jy</span>` : ""}</span>
      <span class="lb-xp">★ ${r.xp}</span>`;
    return d;
  }

  function draw(scope) {
    const rows = data[scope] || [];
    const me = scope === "weekly" ? data.myWeekly : data.myAllTime;
    clear(list);
    if (!rows.length) {
      list.appendChild(el("p", "muted center", "Nog geen tellings hier nie — begin speel om op die bord te kom!"));
      return;
    }
    const top = rows.slice(0, 10);
    top.forEach(r => list.appendChild(row(r, !!(myName && r.name === myName))));
    if (me && me.rank > 10) {
      list.appendChild(el("div", "lb-sep", "···"));
      list.appendChild(row({ name: myName, xp: me.xp, rank: me.rank }, true));
    }
  }

  screen.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      screen.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
      tab.classList.add("active");
      draw(tab.dataset.scope);
    });
  });
  draw("weekly");
}
