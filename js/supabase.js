/* ============================================================
   SUPABASE-AGTERKANT — roep die SECURITY DEFINER RPC-funksies.
   Self-registrasie: leerders skep hul eie rekening (gebruikersnaam
   + naam + wagwoord). Wagwoorde word op die bediener gehash; die
   onderwyser sien dit nooit. supabase-js laai lui vanaf 'n CDN.
   ============================================================ */
import { SUPABASE, hasSupabase as _has } from "./supabase-config.js";

export const hasSupabase = _has;

let _client = null;
async function client() {
  if (_client) return _client;
  const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
  _client = createClient(SUPABASE.url, SUPABASE.key, { auth: { persistSession: false, autoRefreshToken: false } });
  return _client;
}
async function rpc(fn, params) {
  const c = await client();
  const { data, error } = await c.rpc(fn, params || {});
  if (error) throw new Error(error.message || "rpc_error");
  return data;
}

export const SupabaseBackend = {
  async signup(username, name, password) { return rpc("g7_signup", { p_username: username, p_name: name, p_password: password }); },
  async login(username, password) { return rpc("g7_login", { p_username: username, p_password: password }); },
  async setPassword(username, password) { return rpc("g7_set_password", { p_username: username, p_password: password }); },
  async getState(username, password) { return rpc("g7_get_state", { p_username: username, p_password: password }); },
  async submitQuest(username, password, quest, { score, xp, total, correct }) {
    return rpc("g7_submit_quest", { p_username: username, p_password: password, p_quest: quest, p_score: score, p_xp: xp, p_total: total, p_correct: correct });
  },
  // 🎲 Dice Quest — nuwe RPC (supabase/migration-dice.sql, nog nie op live
  // gedraai nie). GRACEFUL: totdat dit loop, gooi rpc() 'n fout wat play.js
  // se finish() stilweg vang (presies dieselfde patroon as elders) — die
  // Dice Quest bly speelbaar, XP betaal net eers sodra sy die migrasie loop.
  async submitDice(username, password, pool, { score, total, correct }) {
    return rpc("g7_submit_dice", { p_username: username, p_password: password, p_pool: pool, p_score: score, p_total: total, p_correct: correct });
  },
  async logStruggle(username, password, concept) { return rpc("g7_log_struggle", { p_username: username, p_password: password, p_concept: concept }); },

  // 🏆 Weekly winners (supabase/migration-weekly.sql, not run on live yet).
  // GRACEFUL like submitDice above: until the migration runs, rpc() throws
  // "Could not find the function..." and the caller (js/weekly.js /
  // leaderboard.js, Session 2) shows its empty-board state, not an error.
  async leaderboard(username, password) { return rpc("g7_leaderboard", { p_username: username, p_password: password }); },
  async weeklyResults(username, password) { return rpc("g7_weekly_results", { p_username: username, p_password: password }); },
  async adminWeeklyResults(pw) { return rpc("g7_admin_weekly_results", { p_admin_password: pw }); },

  // ---- admin ----
  async adminLogin(pw) { return rpc("g7_admin_login", { p_admin_password: pw }); },
  async adminData(pw) { return rpc("g7_admin_data", { p_admin_password: pw }); },
  async adminResetPassword(pw, id) { return rpc("g7_admin_reset_password", { p_admin_password: pw, p_id: id }); },
  async adminRemoveStudent(pw, id) { return rpc("g7_admin_remove_student", { p_admin_password: pw, p_id: id }); },
  async adminResetProgress(pw, id) { return rpc("g7_admin_reset_progress", { p_admin_password: pw, p_id: id }); },
  async adminResolveStruggle(pw, concept) { return rpc("g7_admin_resolve_struggle", { p_admin_password: pw, p_concept: concept }); },
  async adminSetQuestOpen(pw, quest, open) { return rpc("g7_admin_set_quest_open", { p_admin_password: pw, p_quest: quest, p_open: open }); },
  async adminSetRevision(pw, quest, flag) { return rpc("g7_admin_set_revision", { p_admin_password: pw, p_quest: quest, p_flag: flag }); },
  async adminSetChapterOpen(pw, chapter, open) { return rpc("g7_admin_set_chapter_open", { p_admin_password: pw, p_chapter: chapter, p_open: open }); },
  async adminResetWeekly(pw) { return rpc("g7_admin_reset_weekly", { p_admin_password: pw }); },
};
