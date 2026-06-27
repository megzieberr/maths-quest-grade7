/* ============================================================
   API-LAAG — een async-koppelvlak, twee uitruilbare agterkante.
   Gebruik Supabase wanneer js/supabase-config.js sleutels het;
   andersins (of met ?local=1) die vanlyn LocalBackend. Dieselfde
   metode-handtekeninge, so niks anders in die app verander nie.
   ============================================================ */
import { SupabaseBackend, hasSupabase } from "./supabase.js";
import { LocalBackend } from "./local-backend.js";

function forceLocal() {
  try {
    if (new URLSearchParams(location.search).has("local")) { localStorage.setItem("g7.forceLocal", "1"); return true; }
    return localStorage.getItem("g7.forceLocal") === "1";
  } catch { return false; }
}

const useLocal = !hasSupabase || forceLocal();
export const api = useLocal ? LocalBackend : SupabaseBackend;
export const BACKEND = useLocal ? "local" : "supabase";
