/* ============================================================
   ADMIN-DASHBOARD  (onderwyser-aansig, agter die admin-wagwoord)
   Sien waar die klas vassit (sukkel-vlae per konsep) en bestuur
   leerders — herstel wagwoord, herstel tellings, verwyder, CSV.
   Gebruik dieselfde api-laag, so dit werk teen Supabase (regstreeks)
   of die plaaslike agterkant (?local=1).
   Leerderdata is in Afrikaans; die onderwyser-koppelvlak is Engels.
   ============================================================ */
import { api } from "./api.js";
import { CHAPTERS } from "./config.js";
import { CONCEPTS } from "./concepts.js";
import { el, clear } from "./ui.js";

const root = () => document.getElementById("admin");
let pw = null;

const questCount = CHAPTERS.reduce((n, ch) => n + (ch.quests || []).filter(q => q.built).length, 0);
const ACTIVE_CHAPTERS = CHAPTERS.filter(ch => !ch.archived);
const ARCHIVED_CHAPTERS = CHAPTERS.filter(ch => ch.archived);
/* every built round, grouped per hoofstuk (chapter) — the per-learner grid clusters
   by this instead of one flat 1..79 numbering, and each entry carries what a chip
   needs to render + its tooltip. */
const ROUND_LIST = (() => {
  const out = [];
  CHAPTERS.forEach(ch => (ch.quests || []).filter(q => q.built).forEach(q => {
    out.push({ id: q.id, title: q.title, ch: ch.name, chId: ch.id, chIcon: ch.icon, chColor: ch.signature, archived: !!ch.archived });
  }));
  return out;
})();
const ARCHIVED_IDS = new Set(ROUND_LIST.filter(rd => rd.archived).map(rd => rd.id));
const SHOW_STRUGGLES = false;
const conceptTitle = id => (CONCEPTS[id] && CONCEPTS[id].title) || id;
const fmtDate = v => { if (!v) return "nooit"; const d = new Date(v); return isNaN(d) ? "—" : d.toLocaleDateString(); };
const daysSince = v => { if (!v) return Infinity; const d = new Date(v); return isNaN(d) ? Infinity : (Date.now() - d.getTime()) / 864e5; };

boot();
function boot() { clear(root()); const view = el("main", "view"); root().appendChild(view); renderLogin(view); }

function renderLogin(host) {
  const card = el("div", "card", "<h2>Onderwyser-admin</h2><p class='muted small'>Tik jou admin-wagwoord in.</p>");
  const input = el("input", "login-input"); input.type = "password"; input.placeholder = "Admin-wagwoord";
  const err = el("p", "login-err"); err.hidden = true;
  const btn = el("button", "btn primary big", "Teken in");
  card.appendChild(input); card.appendChild(err); card.appendChild(btn);
  host.appendChild(card);
  async function submit() {
    btn.disabled = true; err.hidden = true;
    try { const r = await api.adminLogin(input.value); if (!r.ok) { err.hidden = false; err.textContent = "Verkeerde wagwoord."; btn.disabled = false; return; } }
    catch { err.hidden = false; err.textContent = "Kan nie die bediener bereik nie."; btn.disabled = false; return; }
    pw = input.value; dashboard();
  }
  btn.addEventListener("click", submit);
  input.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
}

async function dashboard() {
  clear(root());
  const view = el("main", "view adm");
  root().appendChild(view);
  view.appendChild(el("div", "adm-head", "<h1>Admin-dashboard</h1>"));
  const status = el("p", "muted small", "Laai…"); view.appendChild(status);
  let data;
  try { data = await api.adminData(pw); } catch { status.textContent = "Kan nie laai nie. Kontroleer jou verbinding."; return; }
  if (!data || !data.ok) { status.textContent = "Kon nie die dashboard laai nie."; return; }
  status.remove();
  view.appendChild(questGateSection(data.quests));
  // "Where the class is stuck" — hidden (her call, 2026-08-11): not in use right
  // now and cluttering the page. Section stays fully built, just not mounted —
  // flip SHOW_STRUGGLES back to true to bring it back.
  if (SHOW_STRUGGLES) view.appendChild(struggleSection(data.struggles || []));
  view.appendChild(learnerSection(data.rows || [], data.inactiveDays || 7));
}
const reload = () => dashboard();

/* ---------------- Rounds: open / close (teacher gating) ---------------- */
function questGateSection(quests) {
  const sec = el("div", "card adm-section");
  sec.appendChild(el("h2", "", "Rounds — open / close"));
  if (!quests || !quests.length) {
    sec.appendChild(el("p", "muted small", "Round control isn’t set up yet. Run supabase/migration-quest-gating.sql once in the Supabase SQL editor to enable opening and closing rounds."));
    return sec;
  }
  sec.appendChild(el("p", "muted small", "Learners only see rounds that are open. Everything starts open — close the ones you haven’t taught yet."));
  const openById = {}; quests.forEach(q => { openById[q.quest_id] = !!q.is_open; });
  // "🗓️ Hersiening" only exists once the daily-quest migration has run — the
  // dashboard payload carries an `in_revision` key per quest once it has.
  // Before that (current live), just don't render the column — no RPC call
  // that would fail, no error, nothing missing that was there before.
  const hasRevision = quests.some(q => Object.prototype.hasOwnProperty.call(q, "in_revision"));
  const revisionById = {}; quests.forEach(q => { revisionById[q.quest_id] = !!q.in_revision; });

  function buildChapterBlock(ch) {
    const built = (ch.quests || []).filter(q => q.built);
    if (!built.length) return null;
    const block = el("div", "adm-qchap");
    const openCount = built.filter(q => openById[q.id]).length;
    const head = el("div", "adm-qchead",
      `<span class="adm-qctitle">${ch.icon} ${ch.name}</span><span class="muted small adm-qcount">${openCount} / ${built.length} open</span>`);
    const btns = el("div", "adm-qcbtns");
    const openAll = el("button", "btn ghost small", "Open all");
    openAll.addEventListener("click", async () => { openAll.disabled = true; await api.adminSetChapterOpen(pw, ch.id, true); reload(); });
    const closeAll = el("button", "btn ghost small", "Close all");
    closeAll.addEventListener("click", async () => { closeAll.disabled = true; await api.adminSetChapterOpen(pw, ch.id, false); reload(); });
    btns.appendChild(openAll); btns.appendChild(closeAll);
    head.appendChild(btns);
    block.appendChild(head);

    const list = el("div", "adm-qlist");
    built.forEach(q => {
      const row = el("div", "adm-qrow" + (openById[q.id] ? " on" : ""));
      const openLabel = el("label", "adm-qopen");
      const cb = el("input"); cb.type = "checkbox"; cb.checked = !!openById[q.id];
      cb.addEventListener("change", async () => { cb.disabled = true; await api.adminSetQuestOpen(pw, q.id, cb.checked); reload(); });
      openLabel.appendChild(cb);
      openLabel.appendChild(el("span", "adm-qname", `${q.n}. ${q.title}`));
      row.appendChild(openLabel);
      if (hasRevision) {
        const revLabel = el("label", "adm-qrev" + (revisionById[q.id] ? " on" : ""));
        const rcb = el("input"); rcb.type = "checkbox"; rcb.checked = !!revisionById[q.id];
        rcb.addEventListener("change", async () => { rcb.disabled = true; await api.adminSetRevision(pw, q.id, rcb.checked); reload(); });
        revLabel.appendChild(rcb);
        revLabel.appendChild(el("span", "adm-qrevname", "🗓️ Hersiening"));
        row.appendChild(revLabel);
      }
      list.appendChild(row);
    });
    block.appendChild(list);
    return block;
  }

  ACTIVE_CHAPTERS.forEach(ch => { const block = buildChapterBlock(ch); if (block) sec.appendChild(block); });

  const archivedBlocks = ARCHIVED_CHAPTERS.map(buildChapterBlock).filter(Boolean);
  if (archivedBlocks.length) {
    const details = el("details", "adm-archive");
    details.innerHTML = `<summary>📦 Argief <span class="muted small">— nie meer sigbaar vir leerders nie, maar kan nog oop/toe gemaak word</span></summary>`;
    const body = el("div", "adm-archive-body");
    archivedBlocks.forEach(b => body.appendChild(b));
    details.appendChild(body);
    sec.appendChild(details);
  }
  return sec;
}

function struggleSection(struggles) {
  const sec = el("div", "card adm-section");
  sec.appendChild(el("h2", "", "Where the class is stuck"));
  if (!struggles.length) {
    sec.appendChild(el("p", "muted small", "No struggle flags yet. Repeated wrong answers and “I’m lost” presses show up here, grouped by concept."));
    return sec;
  }
  const list = el("div", "adm-strug");
  struggles.forEach(s => {
    const row = el("div", "adm-srow", `<div><b>${conceptTitle(s.concept)}</b><div class="muted small">${s.count} flag${s.count > 1 ? "s" : ""} · ${s.students} learner${s.students > 1 ? "s" : ""}</div></div>`);
    const btn = el("button", "btn ghost small", "Resolve");
    btn.addEventListener("click", async () => { btn.disabled = true; await api.adminResolveStruggle(pw, s.concept); reload(); });
    row.appendChild(btn);
    list.appendChild(row);
  });
  sec.appendChild(list);
  return sec;
}

function learnerSection(rows, inactiveDays) {
  const sec = el("div", "card adm-section");
  const head = el("div", "adm-lhead", `<h2>Learners (${rows.length})</h2>`);
  const btns = el("div", "adm-lbtns");
  const preview = el("button", "btn ghost small", "👁️ Voorskou as leerder");
  preview.title = "Open the game as a learner would see it, with every built round unlocked — nothing is saved";
  preview.addEventListener("click", () => window.open("index.html?preview=1", "_blank", "noopener"));
  const wk = el("button", "btn ghost small", "↺ Reset weekly");
  wk.addEventListener("click", async () => { if (!confirm("Reset the weekly board to zero for everyone? (All-time XP is kept.)")) return; wk.disabled = true; await api.adminResetWeekly(pw); reload(); });
  const csv = el("button", "btn ghost small", "Export CSV");
  csv.addEventListener("click", () => exportCsv(rows));
  btns.appendChild(preview); btns.appendChild(wk); btns.appendChild(csv);
  head.appendChild(btns);
  sec.appendChild(head);

  sec.appendChild(el("p", "muted small", "Sorted by all-time XP. Rounds are grouped by chapter — green = mastered (80%+ first try) · orange = tried · grey = not started. Hover a chip for the round, best score and when it was last played. You never see passwords — reset a forgotten one (progress kept)."));

  const table = el("table", "adm-table");
  table.innerHTML = `<thead><tr><th>#</th><th>Name</th><th>Password</th><th>Weekly</th><th>All-time</th><th>Last active</th><th>Rounds (by chapter)</th><th></th></tr></thead>`;
  const tb = el("tbody");
  rows.forEach((r, i) => {
    const inactive = r.lastActive && daysSince(r.lastActive) >= inactiveDays;
    const learnerQuests = r.quests || {};
    const chipFor = rd => {
      const p = learnerQuests[rd.id];
      const best = p ? Math.round((p.best_score || 0) * 100) : 0;
      const cls = p && p.passed ? "ok" : (p && p.attempts ? "try" : "none");
      const played = p && p.last_played_at ? fmtDate(p.last_played_at) : null;
      const tip = p
        ? `${rd.ch} · ${rd.title} — ${best}%${played ? ` — gespeel ${played}` : ""}`
        : `${rd.ch} · ${rd.title} — nog nie begin`;
      return `<span class="rchip ${cls}" title="${tip}">${rd.id}</span>`;
    };
    const clusterFor = ch => {
      const round = ROUND_LIST.filter(rd => rd.chId === ch.id);
      if (!round.length) return "";
      return `<div class="rcluster" style="--cc:${ch.signature}">
        <div class="rch-head"><span class="rch-ico">${ch.icon}</span><span class="rch-name">${ch.name}</span></div>
        <div class="rgrid">${round.map(chipFor).join("")}</div>
      </div>`;
    };
    const hasArchivedData = Object.keys(learnerQuests).some(id => ARCHIVED_IDS.has(id));
    const clusters = ACTIVE_CHAPTERS.map(clusterFor).join("")
      + (hasArchivedData
        ? `<div class="rcluster archived" style="--cc:var(--muted)">
            <div class="rch-head"><span class="rch-ico">📦</span><span class="rch-name">Argief</span></div>
            <div class="rgrid">${ROUND_LIST.filter(rd => rd.archived).map(chipFor).join("")}</div>
          </div>`
        : "");
    const tr = el("tr");
    tr.innerHTML = `
      <td class="mono">${i + 1}</td>
      <td><b>${r.name}</b><div class="muted small mono">${r.username}</div></td>
      <td>${r.hasPassword ? '<span class="pwset">✓ set</span>' : '<span class="pwreset">reset — awaiting</span>'}</td>
      <td class="num">${r.weeklyXp || 0}</td>
      <td class="num">${r.totalXp || 0}</td>
      <td class="${inactive ? "adm-inactive" : ""}">${fmtDate(r.lastActive)}${inactive ? " ⚠" : ""}</td>
      <td class="chips"><div class="rclusters">${clusters}</div></td>`;
    const act = el("td", "adm-actions");
    const rpw = el("button", "btn ghost small", "Reset pw");
    rpw.addEventListener("click", async () => { if (!confirm(`Reset ${r.name}'s password? They'll set a new one next login (progress kept).`)) return; await api.adminResetPassword(pw, r.id); reload(); });
    const rsc = el("button", "btn ghost small", "Reset scores");
    rsc.addEventListener("click", async () => { if (!confirm(`Reset ${r.name}'s scores? This clears their XP, mastered quests and struggle flags — the account stays, so they start fresh.`)) return; await api.adminResetProgress(pw, r.id); reload(); });
    const rm = el("button", "btn small danger", "Remove");
    rm.addEventListener("click", async () => { if (!confirm(`Remove ${r.name}? This deletes their account and progress.`)) return; await api.adminRemoveStudent(pw, r.id); reload(); });
    act.appendChild(rpw); act.appendChild(rsc); act.appendChild(rm);
    tr.appendChild(act);
    tb.appendChild(tr);
  });
  table.appendChild(tb);
  const wrap = el("div", "adm-tablewrap"); wrap.appendChild(table);
  sec.appendChild(wrap);
  return sec;
}

function exportCsv(rows) {
  const lines = [["Rank", "Name", "Username", "Password set", "Weekly XP", "All-time XP", "Last active", "Mastered", "Best per round", "Last played per round"].join(",")];
  rows.forEach((r, i) => {
    const q = r.quests || {};
    const mastered = ROUND_LIST.filter(rd => q[rd.id] && q[rd.id].passed).length;
    const best = ROUND_LIST.map(rd => { const p = q[rd.id]; return `${rd.id}:${p ? Math.round((p.best_score || 0) * 100) : 0}`; }).join(" ");
    const played = ROUND_LIST.map(rd => { const p = q[rd.id]; return `${rd.id}:${p && p.last_played_at ? new Date(p.last_played_at).toISOString().slice(0, 10) : ""}`; }).join(" ");
    const cells = [i + 1, r.name, r.username, r.hasPassword ? "yes" : "no", r.weeklyXp || 0, r.totalXp || 0,
      r.lastActive ? new Date(r.lastActive).toISOString() : "", `${mastered}/${questCount}`, best, played];
    lines.push(cells.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","));
  });
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "wiskunde-avontuur-leerders.csv"; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
