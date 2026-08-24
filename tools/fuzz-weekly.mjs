/* ============================================================
   FUZZ — 🏆 Weekly Winners local-backend mirror (node, no browser)
   ------------------------------------------------------------
   Imports the REAL js/local-backend.js (a localStorage shim stands in
   for the browser) and drives it through synthetic students + XP
   events, checking the same guarantees supabase/migration-weekly.sql
   makes on the server:

     (a) star = top weekly XP
     (b) most-improved excludes the star even when the star also has
         the biggest delta
     (c) on-fire excludes both star and most-improved, and counts
         DISTINCT days, not events
     (d) perfectWeek lists everyone at 7/7 and nobody at 6
     (e) a mid-week weeklyAnchor reset (her ↺ Reset weekly button)
         zeroes the live "Hierdie week" board but does NOT change last
         week's already-settled crown
     (f) a learner ranked 12th on the live board still gets a correct
         myWeekly.rank

   Run: node tools/fuzz-weekly.mjs   (exit 1 on any mismatch)
   ============================================================ */

let fails = 0;
const fail = (msg) => { fails++; console.log("FAIL:", msg); };
const ok = (cond, msg) => { if (!cond) fail(msg); };
const eq = (a, b, msg) => { if (a !== b) fail(`${msg} — expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); };

/* ---------- localStorage shim (local-backend.js just needs get/set/removeItem) ---------- */
class LocalStorageShim {
  constructor() { this.store = {}; }
  getItem(k) { return Object.prototype.hasOwnProperty.call(this.store, k) ? this.store[k] : null; }
  setItem(k, v) { this.store[k] = String(v); }
  removeItem(k) { delete this.store[k]; }
  clear() { this.store = {}; }
}
globalThis.localStorage = new LocalStorageShim();

const { LocalBackend } = await import("../js/local-backend.js");

/* ---------- same time helpers as local-backend.js (device-local calendar) ---------- */
function startOfWeek(ts = Date.now()) {
  const d = new Date(ts);
  const day = (d.getDay() + 6) % 7;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d.getTime();
}
const DAY = 864e5;
const thisWeekStart = startOfWeek();
const lastWeekStart = thisWeekStart - 7 * DAY;
const weekBeforeStart = thisWeekStart - 14 * DAY;

/* ---------- localStorage write helpers matching local-backend.js's LS keys ---------- */
const K = { students: "g7.students", progress: "g7.progress", meta: "g7.meta", xpevents: "g7.xpevents" };
const put = (k, v) => localStorage.setItem(k, JSON.stringify(v));
function resetStore() { localStorage.clear(); }

let nextId = 1;
function mkStudent(students, name) {
  const id = "s" + (nextId++);
  students[id] = { id, username: name.toLowerCase().replace(/\s+/g, ""), display_name: name, password: "pw", last_active_at: Date.now() };
  return id;
}
function addEvent(events, id, ts, xp, quest_id) {
  (events[id] || (events[id] = [])).push({ ts, xp, quest_id });
}

/* ============================================================
   (a) star = top weekly XP; (b) most-improved excludes the star even
   when the star also has the biggest delta.
   ============================================================ */
{
  resetStore();
  const students = {}, events = {};

  // S — star: highest last-week XP, AND (deliberately) the biggest raw
  // delta too, to prove mostImproved must skip past them regardless.
  const S = mkStudent(students, "Sanele");
  addEvent(events, S, lastWeekStart + 1 * DAY, 100, "u1");   // lw = 100
  addEvent(events, S, weekBeforeStart + 1 * DAY, 5, "u2");   // pw = 5   -> delta 95 (biggest)

  // T — second-highest lw, smaller delta than S, but the biggest delta
  // AMONG NON-STAR candidates -> must win Most Improved.
  const T = mkStudent(students, "Thandi");
  addEvent(events, T, lastWeekStart + 2 * DAY, 80, "v1");    // lw = 80
  addEvent(events, T, weekBeforeStart + 2 * DAY, 0, "v2");   // pw = 0   -> delta 80

  put(K.students, students);
  put(K.progress, {});
  put(K.meta, { adminPassword: "admin", weeklyAnchor: 0 });
  put(K.xpevents, events);

  const r = await LocalBackend.weeklyResults(students[S].username, "pw");
  ok(r.ok, "(a-b) weeklyResults should succeed");

  // (a) star = top weekly XP
  eq(r.star && r.star.name, "Sanele", "(a) star should be the top last-week XP earner");
  eq(r.star && r.star.xp, 100, "(a) star xp should be 100");

  // (b) most-improved excludes the star even though the star had the biggest delta
  eq(r.mostImproved && r.mostImproved.name, "Thandi", "(b) mostImproved should skip the star and pick the next-biggest delta");
  eq(r.mostImproved && r.mostImproved.delta, 80, "(b) mostImproved delta should be Thandi's 80, not Sanele's 95");

  console.log("(a)-(b) star / mostImproved mutual exclusion: checked.");
}

/* ============================================================
   (c) on-fire excludes star + most-improved, counts DISTINCT days
   not events. Star/mostImproved candidates here earn NON-daily XP
   only (days = 0), so they're automatically ineligible for onFire on
   top of the explicit id-exclusion — keeps this block from colliding
   with the on-fire day-count comparison itself.
   ============================================================ */
{
  resetStore();
  const students = {}, events = {};

  const S = mkStudent(students, "Sipho");           // star (non-daily xp only)
  addEvent(events, S, lastWeekStart + 1 * DAY, 200, "u1");

  const T = mkStudent(students, "Tumi");             // most-improved (non-daily xp only)
  addEvent(events, T, lastWeekStart + 2 * DAY, 60, "v1");
  addEvent(events, T, weekBeforeStart + 2 * DAY, 0, "v2");

  // U — on-fire winner: 4 events across 3 distinct days (one day
  // doubled) must count as 3 days, not 4.
  const U = mkStudent(students, "Unathi");
  addEvent(events, U, lastWeekStart + 0.2 * DAY, 5, "daily-d1");
  addEvent(events, U, lastWeekStart + 0.3 * DAY, 5, "daily-d1"); // same day, second event
  addEvent(events, U, lastWeekStart + 1.2 * DAY, 5, "daily-d2");
  addEvent(events, U, lastWeekStart + 2.2 * DAY, 5, "daily-d3");

  // V — fewer distinct days (1) — must lose to U on day-count.
  const V = mkStudent(students, "Vuyo");
  addEvent(events, V, lastWeekStart + 3 * DAY, 5, "daily-d4");

  put(K.students, students);
  put(K.progress, {});
  put(K.meta, { adminPassword: "admin", weeklyAnchor: 0 });
  put(K.xpevents, events);

  const r = await LocalBackend.weeklyResults(students[S].username, "pw");
  ok(r.ok, "(c) weeklyResults should succeed");
  eq(r.star && r.star.name, "Sipho", "(c) sanity: Sipho should still be star");
  eq(r.mostImproved && r.mostImproved.name, "Tumi", "(c) sanity: Tumi should still be mostImproved");
  eq(r.onFire && r.onFire.name, "Unathi", "(c) onFire should pick Unathi (3 distinct days) over Vuyo (1 day)");
  eq(r.onFire && r.onFire.days, 3, "(c) onFire days should be 3 distinct days, not 4 events");

  console.log("(c) onFire distinct-day counting + exclusion: checked.");
}

/* ============================================================
   (d) perfectWeek lists everyone at 7/7 and nobody at 6/7.
   ============================================================ */
{
  resetStore();
  const students = {}, events = {};

  const W = mkStudent(students, "Wandile");          // 7/7 — perfect week
  for (let i = 0; i < 7; i++) addEvent(events, W, lastWeekStart + i * DAY + 3600e3, 10, `daily-w${i}`);

  const X = mkStudent(students, "Xolani");            // 6/7 — one day short
  for (let i = 0; i < 6; i++) addEvent(events, X, lastWeekStart + i * DAY + 3600e3, 10, `daily-x${i}`);

  put(K.students, students);
  put(K.progress, {});
  put(K.meta, { adminPassword: "admin", weeklyAnchor: 0 });
  put(K.xpevents, events);

  const r = await LocalBackend.weeklyResults(students[W].username, "pw");
  ok(r.ok, "(d) weeklyResults should succeed");
  ok(Array.isArray(r.perfectWeek) && r.perfectWeek.includes("Wandile"), "(d) perfectWeek should include the 7/7 learner");
  ok(Array.isArray(r.perfectWeek) && !r.perfectWeek.includes("Xolani"), "(d) perfectWeek should exclude the 6/7 learner");

  console.log("(d) perfectWeek 7/7 vs 6/7: checked.");
}

/* ============================================================
   (e) mid-week weeklyAnchor reset zeroes the LIVE board but does NOT
   touch last week's already-settled crown.
   ============================================================ */
{
  resetStore();
  const students = {}, events = {};

  // Last week's star — must stay the crown winner no matter what
  // happens to this week's live board / weeklyAnchor.
  const A = mkStudent(students, "Amahle");
  addEvent(events, A, lastWeekStart + 1 * DAY, 100, "u1");

  // A live-board entry earned THIS week, before "now" (the reset moment).
  const B = mkStudent(students, "Bandile");
  const earlyThisWeekTs = thisWeekStart + 1 * 3600e3; // 1 hour into this week
  addEvent(events, B, earlyThisWeekTs, 40, "v1");

  put(K.students, students);
  put(K.progress, {});
  // simulate her pressing ↺ Reset weekly AFTER Bandile's play (anchor = now)
  const resetAt = Date.now();
  put(K.meta, { adminPassword: "admin", weeklyAnchor: resetAt });
  put(K.xpevents, events);

  const lb = await LocalBackend.leaderboard(students[B].username, "pw");
  ok(lb.ok, "(e) leaderboard should succeed");
  eq(lb.weekly.length, 0, "(e) live weekly board should be empty right after a mid-week reset (Bandile's XP predates the anchor)");
  eq((lb.myWeekly && lb.myWeekly.xp) || 0, 0, "(e) Bandile's own live weekly xp should read 0 after the reset");

  const wr = await LocalBackend.weeklyResults(students[A].username, "pw");
  ok(wr.ok, "(e) weeklyResults should succeed");
  eq(wr.star && wr.star.name, "Amahle", "(e) last week's crown (star) must be untouched by this week's weeklyAnchor reset");
  eq(wr.star && wr.star.xp, 100, "(e) last week's crown xp must be untouched by the reset");

  console.log("(e) mid-week weeklyAnchor reset zeroes live board, crown unaffected: checked.");
}

/* ============================================================
   (f) a learner ranked 12th on the live board gets a correct
   myWeekly.rank.
   ============================================================ */
{
  resetStore();
  const students = {}, events = {};
  const names = [];
  // 15 learners, distinct XP amounts 150..10 (descending by 10s) — rank
  // is purely by XP with no ties, so the 12th-highest earner must land
  // exactly on rank 12.
  const ids = [];
  for (let i = 0; i < 15; i++) {
    const name = "Learner" + (i + 1);
    const id = mkStudent(students, name);
    ids.push(id); names.push(name);
    const xp = 150 - i * 10; // 150,140,...,10
    addEvent(events, id, thisWeekStart + 1 * 3600e3, xp, "u1");
  }
  put(K.students, students);
  put(K.progress, {});
  put(K.meta, { adminPassword: "admin", weeklyAnchor: 0 });
  put(K.xpevents, events);

  const twelfth = ids[11]; // 0-indexed 11th entry = 12th-highest XP (30 xp)
  const lb = await LocalBackend.leaderboard(students[twelfth].username, "pw");
  ok(lb.ok, "(f) leaderboard should succeed");
  eq(lb.weekly.length, 15, "(f) all 15 learners should appear on the weekly board (all xp > 0)");
  eq(lb.myWeekly && lb.myWeekly.rank, 12, "(f) the 12th-highest earner's myWeekly.rank should be 12");
  eq(lb.myWeekly && lb.myWeekly.xp, 40, "(f) the 12th-highest earner's xp should be 40 (150 - 11*10)");
  // cross-check against the board itself
  const boardRow = lb.weekly.find(r => r.rank === 12);
  ok(boardRow && boardRow.name === "Learner12", "(f) board row at rank 12 should be Learner12");

  console.log("(f) rank-12 myWeekly.rank correctness: checked.");
}

if (fails) {
  console.log(`\n${fails} FAILURE(S).`);
  process.exit(1);
} else {
  console.log("\nAll checks passed (0 failures).");
}
