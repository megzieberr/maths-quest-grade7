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
  view.appendChild(struggleSection(data.struggles || []));
  view.appendChild(learnerSection(data.rows || [], data.inactiveDays || 7));
}
const reload = () => dashboard();

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
  const csv = el("button", "btn ghost small", "Export CSV");
  csv.addEventListener("click", () => exportCsv(rows));
  head.appendChild(csv);
  sec.appendChild(head);

  sec.appendChild(el("p", "muted small", "Learners sign themselves up. You never see their passwords — reset a forgotten one (they set a new one next login, progress kept) or remove a learner."));

  const table = el("table", "adm-table");
  table.innerHTML = `<thead><tr><th>Name</th><th>Username</th><th>Password</th><th>XP</th><th>Mastered</th><th>Last active</th><th></th></tr></thead>`;
  const tb = el("tbody");
  rows.forEach(r => {
    const passed = Object.entries(r.quests || {}).filter(([, p]) => p.passed).length;
    const inactive = r.lastActive && daysSince(r.lastActive) >= inactiveDays;
    const tr = el("tr");
    tr.innerHTML = `
      <td>${r.name}</td>
      <td class="mono">${r.username}</td>
      <td>${r.hasPassword ? '<span class="pwset">•••• set</span>' : '<span class="pwreset">reset — awaiting new</span>'}</td>
      <td class="mono">${r.totalXp || 0}</td>
      <td class="mono">${passed} / ${questCount}</td>
      <td class="${inactive ? "adm-inactive" : ""}">${fmtDate(r.lastActive)}${inactive ? " ⚠" : ""}</td>`;
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
  const lines = [["Name", "Username", "Total XP", "Last active", "Mastered quests"].join(",")];
  rows.forEach(r => {
    const passed = Object.entries(r.quests || {}).filter(([, p]) => p.passed).map(([q]) => q).join(" ");
    const cells = [r.name, r.username, r.totalXp || 0, r.lastActive ? new Date(r.lastActive).toISOString() : "", passed];
    lines.push(cells.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","));
  });
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "wiskunde-avontuur-leerders.csv"; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
