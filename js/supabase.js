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
  async logStruggle(username, password, concept) { return rpc("g7_log_struggle", { p_username: username, p_password: password, p_concept: concept }); },

  // ---- admin ----
  async adminLogin(pw) { return rpc("g7_admin_login", { p_admin_password: pw }); },
  async adminData(pw) { return rpc("g7_admin_data", { p_admin_password: pw }); },
  async adminResetPassword(pw, id) { return rpc("g7_admin_reset_password", { p_admin_password: pw, p_id: id }); },
  async adminRemoveStudent(pw, id) { return rpc("g7_admin_remove_student", { p_admin_password: pw, p_id: id }); },
  async adminResetProgress(pw, id) { return rpc("g7_admin_reset_progress", { p_admin_password: pw, p_id: id }); },
  async adminResolveStruggle(pw, concept) { return rpc("g7_admin_resolve_struggle", { p_admin_password: pw, p_concept: concept }); },
  async adminSetQuestOpen(pw, quest, open) { return rpc("g7_admin_set_quest_open", { p_admin_password: pw, p_quest: quest, p_open: open }); },
  async adminSetChapterOpen(pw, chapter, open) { return rpc("g7_admin_set_chapter_open", { p_admin_password: pw, p_chapter: chapter, p_open: open }); },
};
