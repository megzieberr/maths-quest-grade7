-- ============================================================
--  MIGRATION — NUWE RONDTES (los toevoegings, een op 'n slag)
--  ------------------------------------------------------------
--  Run this ONCE in the Supabase SQL editor (Homework Hub,
--  ref wjkhedepwnwrqcpxmkds). Safe to re-run — ADDITIVE, uses
--  ON CONFLICT DO NOTHING, so it never touches an existing row
--  or any learner data.
--
--  Seeds new quest ids into public.quests (created by
--  migration-teacher-dashboard.sql) as they get built. Unlike
--  migration-deel2.sql, rows here are seeded is_open = FALSE —
--  these are BRAND NEW content (not a revision round for
--  already-taught material), so the teacher opens each one
--  deliberately once she's ready to teach it. This differs
--  from Deel 2's open-seeding on purpose.
--
--  • m1c  (Hoofstuk 3 Reguitlyn Meetkunde — "Lees die gradeboog
--          — ander kant": arm A on the left, reads the outer row)
--  • m11  (Hoofstuk 3 Reguitlyn Meetkunde — "Refleks-hoeke met die
--          sakrekenaar": reflex figure + in-app Casio calcdo round)
-- ============================================================

insert into public.quests (quest_id, chapter, is_open, sort) values
  ('m1c','meetkunde',false,351)
on conflict (quest_id) do nothing;

insert into public.quests (quest_id, chapter, is_open, sort) values
  ('m11','meetkunde',false,352)
on conflict (quest_id) do nothing;
