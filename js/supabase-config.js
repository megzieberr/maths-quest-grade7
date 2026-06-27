/* ============================================================
   SUPABASE-KONFIGURASIE  (publiek-veilig)
   ------------------------------------------------------------
   Die publishable key is veilig om in die blaaier te gebruik —
   alle toegang loop deur RLS + SECURITY DEFINER RPC's (geen
   direkte tabel-toegang nie). Geen geheime sleutel hier nie.
   Projek: "Homework Hub" / grade-7-term-3
   ============================================================ */
export const SUPABASE = {
  url: "https://wjkhedepwnwrqcpxmkds.supabase.co",
  key: "sb_publishable_63QuIYf8xKgWAdT4fldqGg_ykCpYoNp",
};
export const hasSupabase = !!(SUPABASE.url && SUPABASE.key);
