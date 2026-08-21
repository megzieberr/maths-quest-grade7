/* ============================================================
   PLAASLIKE AGTERKANT — localStorage, dieselfde koppelvlak as
   SupabaseBackend. Self-registrasie-model. Gebruik vir vanlyn-speel
   en ?local=1 toetsing. (Wagwoorde bly net plaaslik.)
   ============================================================ */
import { CHAPTERS } from "./config.js";

const LS = { students: "g7.students", progress: "g7.progress", struggles: "g7.struggles", meta: "g7.meta", quests: "g7.quests", xpevents: "g7.xpevents" };
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

/* die volledige lys rondtes (id + hoofstuk), in volgorde */
const ALL_QUESTS = CHAPTERS.flatMap(ch => (ch.quests || []).filter(q => q.built).map(q => ({ id: q.id, chapter: ch.id })));

function seed() {
  if (!read(LS.students, null)) write(LS.students, {});
  if (!read(LS.progress, null)) write(LS.progress, {});
  if (!read(LS.struggles, null)) write(LS.struggles, {});
  if (!read(LS.meta, null)) write(LS.meta, { adminPassword: "admin" });
  if (!read(LS.xpevents, null)) write(LS.xpevents, {});
  const m = read(LS.meta, {}); if (m.weeklyAnchor == null) { m.weeklyAnchor = 0; write(LS.meta, m); }
  // verseker elke rondte het 'n inskrywing (verstek: oop, nie in hersiening nie)
  const q = read(LS.quests, {}); let changed = false;
  ALL_QUESTS.forEach((it, i) => {
    if (!q[it.id]) { q[it.id] = { is_open: true, in_revision: false, chapter: it.chapter, sort: i + 1 }; changed = true; }
    else if (q[it.id].in_revision == null) { q[it.id].in_revision = false; changed = true; }
  });
  if (changed) write(LS.quests, q);
}
const openQuests = () => { const q = read(LS.quests, {}); return ALL_QUESTS.filter(it => q[it.id] && q[it.id].is_open).map(it => it.id); };
const revisionQuests = () => { const q = read(LS.quests, {}); return ALL_QUESTS.filter(it => q[it.id] && q[it.id].in_revision).map(it => it.id); };
const findByUser = u => Object.values(read(LS.students, {})).find(s => s.username === String(u).toLowerCase()) || null;
function verify(u, pw) { const s = findByUser(u); return (s && s.password != null && s.password === pw) ? s : null; }
function touch(id) { const st = read(LS.students, {}); if (st[id]) { st[id].last_active_at = Date.now(); write(LS.students, st); } }

export const LocalBackend = {
  async signup(username, name, password) {
    seed();
    const u = String(username).trim().toLowerCase();
    if (u.length < 3) return { ok: false, error: "username_short" };
    if (!/^[a-z0-9_.]+$/.test(u)) return { ok: false, error: "username_chars" };
    if ((password || "").length < 4) return { ok: false, error: "too_short" };
    if (!String(name).trim()) return { ok: false, error: "no_name" };
    if (findByUser(u)) return { ok: false, error: "username_taken" };
    const st = read(LS.students, {});
    const id = "s" + (Math.max(0, ...Object.keys(st).map(k => +k.slice(1) || 0)) + 1);
    st[id] = { id, username: u, display_name: String(name).trim(), password, last_active_at: Date.now() };
    write(LS.students, st);
    return { ok: true };
  },
  async login(username, password) {
    seed();
    const s = findByUser(username);
    if (!s) return { ok: false, error: "no_such_user" };
    if (s.password == null) return { ok: false, needsReset: true };
    if (s.password !== password) return { ok: false, error: "wrong_password" };
    touch(s.id); return { ok: true };
  },
  async setPassword(username, password) {
    seed();
    if ((password || "").length < 4) return { ok: false, error: "too_short" };
    const st = read(LS.students, {});
    const s = Object.values(st).find(x => x.username === String(username).toLowerCase());
    if (!s) return { ok: false, error: "no_such_user" };
    if (s.password != null) return { ok: false, error: "already_set" };
    s.password = password; s.last_active_at = Date.now(); write(LS.students, st);
    return { ok: true };
  },
  async getState(username, password) {
    seed();
    const s = verify(username, password);
    if (!s) return { ok: false, error: "auth" };
    touch(s.id);
    const progress = read(LS.progress, {})[s.id] || {};
    const totalXp = Object.values(progress).reduce((a, p) => a + (p.total_xp || 0), 0);
    return { ok: true, student: { id: s.id, name: s.display_name, username: s.username }, progress, totalXp, openQuests: openQuests(), revision: revisionQuests() };
  },
  async submitQuest(username, password, quest, { score, xp }) {
    const s = verify(username, password);
    if (!s) return { ok: false, error: "auth" };
    const all = read(LS.progress, {});
    const p = all[s.id] || {};
    const prev = p[quest] || { best_score: 0, attempts: 0, total_xp: 0, passed: false };
    const wasPassed = prev.passed, passed = score >= 0.8;
    const award = wasPassed ? 0 : Math.max(0, Math.min(Math.round(xp) || 0, 1000));
    p[quest] = { best_score: Math.max(prev.best_score, score), attempts: prev.attempts + 1, total_xp: prev.total_xp + award, passed: prev.passed || passed, last_played_at: Date.now() };
    all[s.id] = p; write(LS.progress, all); touch(s.id);
    if (award > 0) { const ev = read(LS.xpevents, {}); (ev[s.id] || (ev[s.id] = [])).push({ ts: Date.now(), xp: award }); write(LS.xpevents, ev); }
    return { ok: true, passed, badgeEarned: passed && !wasPassed, xpAwarded: award, alreadyPassed: wasPassed };
  },
  /* 🎲 Dice Quest — APARTE pad van submitQuest: betaal ELKE speel, nie net
     eerste-keer-slaag nie (haar ruling). Die XP-bedrag word HIER bereken
     (10 per korrekte item, tot 10 items) — nooit deur die kliënt genoem
     nie, anders sou onbeperkte herspeel onbeperkte XP kon "aanvra". Skryf
     in dieselfde progress-tabel onder 'n "dice-<pool>"-id sodat dit
     natuurlik saamtel in totalXp/weeklyXp — maar "passed" bly ALTYD false
     (geen kenteken vir Dice Quest nie), so hierdie id lek nooit in die
     admin-rooster in nie (dié bou net oor die bekende ROUND_LIST). */
  async submitDice(username, password, pool, { score, correct }) {
    const s = verify(username, password);
    if (!s) return { ok: false, error: "auth" };
    const qid = `dice-${pool}`;
    const all = read(LS.progress, {});
    const p = all[s.id] || {};
    const prev = p[qid] || { best_score: 0, attempts: 0, total_xp: 0, passed: false };
    const correctClamped = Math.max(0, Math.min(Math.round(correct) || 0, 10));
    const award = correctClamped * 10;
    p[qid] = { best_score: Math.max(prev.best_score, score || 0), attempts: prev.attempts + 1,
      total_xp: prev.total_xp + award, passed: false, last_played_at: Date.now() };
    all[s.id] = p; write(LS.progress, all); touch(s.id);
    if (award > 0) { const ev = read(LS.xpevents, {}); (ev[s.id] || (ev[s.id] = [])).push({ ts: Date.now(), xp: award }); write(LS.xpevents, ev); }
    return { ok: true, xpAwarded: award };
  },
  async logStruggle(username, password, concept) {
    const s = verify(username, password);
    if (!s) return { ok: false, error: "auth" };
    const all = read(LS.struggles, {});
    const g = all[s.id] || (all[s.id] = {});
    g[concept] = { count: ((g[concept] && g[concept].count) || 0) + 1, last_ts: Date.now() };
    write(LS.struggles, all);
    return { ok: true };
  },

  // ---- admin ----
  async adminLogin(pw) { seed(); return { ok: read(LS.meta, {}).adminPassword === pw }; },
  async adminData(pw) {
    seed();
    if (read(LS.meta, {}).adminPassword !== pw) return { ok: false, error: "auth" };
    const students = read(LS.students, {}), progress = read(LS.progress, {}), struggles = read(LS.struggles, {});
    const events = read(LS.xpevents, {}); const anchor = read(LS.meta, {}).weeklyAnchor || 0;
    const rows = Object.values(students).map(s => ({
      id: s.id, name: s.display_name, username: s.username, hasPassword: s.password != null, lastActive: s.last_active_at,
      totalXp: Object.values(progress[s.id] || {}).reduce((a, p) => a + (p.total_xp || 0), 0),
      weeklyXp: (events[s.id] || []).filter(e => e.ts >= anchor).reduce((a, e) => a + (e.xp || 0), 0),
      quests: progress[s.id] || {},
    })).sort((a, b) => (b.totalXp - a.totalXp) || a.name.localeCompare(b.name));
    const cByConcept = {};
    Object.values(struggles).forEach(byC => Object.entries(byC).forEach(([c, v]) => {
      const g = cByConcept[c] || (cByConcept[c] = { concept: c, count: 0, students: 0 });
      g.count += v.count; g.students += 1;
    }));
    const qmap = read(LS.quests, {});
    const quests = ALL_QUESTS.map(it => ({
      quest_id: it.id, chapter: it.chapter,
      is_open: !!(qmap[it.id] && qmap[it.id].is_open),
      in_revision: !!(qmap[it.id] && qmap[it.id].in_revision),
    }));
    return { ok: true, rows, struggles: Object.values(cByConcept).sort((a, b) => b.count - a.count), quests, inactiveDays: 7 };
  },
  async adminSetQuestOpen(pw, quest, open) {
    if (read(LS.meta, {}).adminPassword !== pw) return { ok: false, error: "auth" };
    const q = read(LS.quests, {}); if (q[quest]) { q[quest].is_open = !!open; write(LS.quests, q); } return { ok: true };
  },
  async adminSetRevision(pw, quest, flag) {
    if (read(LS.meta, {}).adminPassword !== pw) return { ok: false, error: "auth" };
    const q = read(LS.quests, {}); if (q[quest]) { q[quest].in_revision = !!flag; write(LS.quests, q); } return { ok: true };
  },
  async adminSetChapterOpen(pw, chapter, open) {
    if (read(LS.meta, {}).adminPassword !== pw) return { ok: false, error: "auth" };
    const q = read(LS.quests, {});
    ALL_QUESTS.filter(it => it.chapter === chapter).forEach(it => { if (q[it.id]) q[it.id].is_open = !!open; });
    write(LS.quests, q); return { ok: true };
  },
  async adminResetWeekly(pw) {
    if (read(LS.meta, {}).adminPassword !== pw) return { ok: false, error: "auth" };
    const m = read(LS.meta, {}); m.weeklyAnchor = Date.now(); write(LS.meta, m); return { ok: true };
  },
  async adminResetPassword(pw, id) {
    if (read(LS.meta, {}).adminPassword !== pw) return { ok: false, error: "auth" };
    const st = read(LS.students, {}); if (st[id]) { st[id].password = null; write(LS.students, st); } return { ok: true };
  },
  async adminRemoveStudent(pw, id) {
    if (read(LS.meta, {}).adminPassword !== pw) return { ok: false, error: "auth" };
    const st = read(LS.students, {}); delete st[id]; write(LS.students, st); return { ok: true };
  },
  async adminResetProgress(pw, id) {
    if (read(LS.meta, {}).adminPassword !== pw) return { ok: false, error: "auth" };
    const pr = read(LS.progress, {}); delete pr[id]; write(LS.progress, pr);
    const sg = read(LS.struggles, {}); delete sg[id]; write(LS.struggles, sg);
    return { ok: true };
  },
  async adminResolveStruggle(pw, concept) {
    if (read(LS.meta, {}).adminPassword !== pw) return { ok: false, error: "auth" };
    const all = read(LS.struggles, {}); Object.values(all).forEach(byC => delete byC[concept]); write(LS.struggles, all); return { ok: true };
  },
};
