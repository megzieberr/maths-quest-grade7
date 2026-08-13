-- ============================================================
--  MIGRATION — DEEL 2 HERSIENING-RONDTES (m1b–m10b, s1b–s10b,
--  t1b–t10b) + s13 "Eienskappe van vorms"
--  ------------------------------------------------------------
--  Run this ONCE in the Supabase SQL editor (Homework Hub,
--  ref wjkhedepwnwrqcpxmkds). Safe to re-run — ADDITIVE, uses
--  ON CONFLICT DO NOTHING, so it never touches an existing row
--  or any learner data.
--
--  Seeds 31 new quest ids into public.quests (created by
--  migration-teacher-dashboard.sql):
--   • m1b–m10b  (Hoofstuk 3 Reguitlyn Meetkunde, Deel 2)
--   • s1b–s10b  (Hoofstuk 4 2D Vorms, Deel 2)
--   • s13       (Hoofstuk 4, NEW round "Eienskappe van vorms" —
--                 not a Deel 2 sibling, but seeded here too since
--                 it was added the same night and has no migration
--                 of its own yet)
--   • t1b–t10b  (Hoofstuk 5 Transformasies, Deel 2)
--
--  All rows are seeded is_open = TRUE (her 2026-08-10 ruling: Deel
--  2 rounds seed OPEN because the underlying content is already
--  taught — the class finished the Deel 1 game for that chapter).
--  Sort values use band 300+ so they always sort after every
--  existing Deel 1 id in that chapter, regardless of future
--  Deel 1 additions.
--
--  There are no u1b–u5b or v1b–v10b ids — chapters 1–2
--  (Uitdrukkings/Vergelykings) were archived 2026-08-11 and their
--  Deel 2 sessions were dropped (RUN-PLAN-2026-08-11.md).
-- ============================================================

insert into public.quests (quest_id, chapter, is_open, sort) values
  -- Hoofstuk 3 — Reguitlyn Meetkunde, Deel 2 (m1b–m10b)
  ('m1b','meetkunde',true,301),('m2b','meetkunde',true,302),('m3b','meetkunde',true,303),
  ('m4b','meetkunde',true,304),('m5b','meetkunde',true,305),('m6b','meetkunde',true,306),
  ('m7b','meetkunde',true,307),('m8b','meetkunde',true,308),('m9b','meetkunde',true,309),
  ('m10b','meetkunde',true,310),

  -- Hoofstuk 4 — 2D Vorms, Deel 2 (s1b–s10b) + s13 (new round, not a Deel 2 sibling)
  ('s1b','vorms',true,311),('s2b','vorms',true,312),('s3b','vorms',true,313),
  ('s4b','vorms',true,314),('s5b','vorms',true,315),('s6b','vorms',true,316),
  ('s7b','vorms',true,317),('s8b','vorms',true,318),('s9b','vorms',true,319),
  ('s10b','vorms',true,320),('s13','vorms',true,321),

  -- Hoofstuk 5 — Transformasies, Deel 2 (t1b–t10b)
  ('t1b','transformasies',true,331),('t2b','transformasies',true,332),('t3b','transformasies',true,333),
  ('t4b','transformasies',true,334),('t5b','transformasies',true,335),('t6b','transformasies',true,336),
  ('t7b','transformasies',true,337),('t8b','transformasies',true,338),('t9b','transformasies',true,339),
  ('t10b','transformasies',true,340)
on conflict (quest_id) do nothing;
