/* ============================================================
   API-LAAG — een async-koppelvlak, twee uitruilbare agterkante.
   Gebruik Supabase wanneer js/supabase-config.js sleutels het;
   andersins (of met ?local=1) die vanlyn LocalBackend. Dieselfde
   metode-handtekeninge, so niks anders in die app verander nie.
   ============================================================ */
import { SupabaseBackend, hasSupabase } from "./supabase.js";
import { LocalBackend } from "./local-backend.js";
import { CHAPTERS } from "./config.js";

function forceLocal() {
  try {
    if (new URLSearchParams(location.search).has("local")) { localStorage.setItem("g7.forceLocal", "1"); return true; }
    return localStorage.getItem("g7.forceLocal") === "1";
  } catch { return false; }
}

/* ============================================================
   PREVIEW-AGTERKANT  (onderwyser "voorskou as leerder"-sandput)
   ------------------------------------------------------------
   Oopgemaak vanaf die admin-dashboard via ?preview=1 (Circle Quest se
   patroon). Elke GEBOU rondte uit config.js is ontsluit — nie net dié
   wat in die regte `quests`-tabel oop is nie — sodat sy elke nuwe
   rondte kan sien en speel voor dit ooit vir die klas oopgemaak word.
   Maar NIKS word ooit gestoor nie: elke skryf is 'n no-op wat sukses
   rapporteer, en geen g7.* leerder-localStorage-sleutel of Supabase-
   oproep word ooit aangeraak nie. Die sessie self bly ook net in
   geheue — sien setPreviewSession in session.js. */
function isPreview() {
  try { return new URLSearchParams(location.search).has("preview"); } catch { return false; }
}
const ALL_BUILT_QUEST_IDS = CHAPTERS.flatMap(ch => (ch.quests || []).filter(q => q.built).map(q => q.id));
const PreviewBackend = {
  async signup() { return { ok: true }; },
  async login() { return { ok: true }; },
  async setPassword() { return { ok: true }; },
  async getState() {
    // merk ELKE gebou rondte as geslaag → ontsluit dit op die hub/hoofstuk-
    // roosters EN omseil die hoofstuk-6-ketting (isChainLocked in chain.js
    // kyk net na progress[...].passed — presies dieselfde kunsie as Circle
    // Quest se PreviewBackend gebruik om al sy rondtes oop te maak).
    const progress = {};
    ALL_BUILT_QUEST_IDS.forEach(id => {
      progress[id] = { best_score: 1, attempts: 1, total_xp: 0, passed: true, last_played_at: null };
    });
    return {
      ok: true,
      student: { id: "preview", name: "Juffrou-voorskou", username: "preview" },
      progress,
      totalXp: 0,
      openQuests: ALL_BUILT_QUEST_IDS,   // "juffrou-oop" ongeag wat regtig in Supabase oop is
      revision: [],                      // leeg → Daaglikse Quest-teël verskyn eenvoudig nie (sy voorskou rondtes, nie die daaglikse nie)
    };
  },
  // elke skryf is 'n no-op wat sukses rapporteer — die speletjie voel normaal,
  // maar niks raak Supabase of localStorage se leerder-sleutels nie.
  async submitQuest() { return { ok: true, passed: true, badgeEarned: false, xpAwarded: 0, alreadyPassed: true }; },
  async submitDice() { return { ok: true }; },  // geen xpAwarded nie → uitslae-skerm wys die formule-bedrag
  async logStruggle() { return { ok: true }; },
};

const useLocal = !hasSupabase || forceLocal();
export const PREVIEW = isPreview();
export const api = PREVIEW ? PreviewBackend : (useLocal ? LocalBackend : SupabaseBackend);
export const BACKEND = PREVIEW ? "preview" : (useLocal ? "local" : "supabase");
