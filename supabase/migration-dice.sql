-- ============================================================
--  MIGRATION — 🎲 DICE QUEST XP RPC
--  ------------------------------------------------------------
--  Run this ONCE in the Supabase SQL editor (Homework Hub, ref
--  wjkhedepwnwrqcpxmkds). Safe to re-run. ADDITIVE — never touches
--  learner accounts, progress or struggles, so no data is lost.
--
--  ⚠️ DO NOT RUN FROM A BUILD SESSION. Written 2026-08-21 by the
--  Dice Quest build session, run only from the Fable foreman
--  session after Megan's explicit go-ahead. Until it runs, Dice
--  Quest stays fully playable client-side (learners see the card,
--  play a full round, get the results screen) — the XP submission
--  just fails silently (SupabaseBackend.submitDice's rpc() throws,
--  play.js's finish() already swallows that exactly like it does
--  for every other quest when offline) — no error, no crash, XP
--  simply doesn't bank until this runs. That's the safe, expected
--  state (same GRACEFUL pattern as migration-stellings-daily.sql).
--
--  WHY A NEW RPC (not the existing g7_submit_quest):
--   g7_submit_quest only pays XP the FIRST time a given quest_id is
--   passed for a student (`was_passed` gate — see schema.sql /
--   migration-teacher-dashboard.sql). Megan's ruling for Dice Quest
--   is the opposite: it is NEVER locked and pays XP on EVERY play,
--   full — a deliberate "replay for more practice, replay for more
--   XP" loop. Reusing g7_submit_quest with a static "dice-m"-style
--   id would pay once, ever, then go to 0 forever. So this is a
--   dedicated RPC, g7_submit_dice, without the was_passed gate.
--
--  WHY THE XP AMOUNT IS COMPUTED HERE, NOT PASSED IN:
--   g7_submit_quest trusts a client-supplied p_xp (clamped 0–1000) —
--   fine for a quest a learner can only pass-for-XP once. Dice Quest
--   is infinitely repeatable BY DESIGN, so a client-named amount
--   would turn "replay for practice" into "replay for infinite XP".
--   Here the award is fixed server-side: 10 XP per correct answer
--   (matches config.js XP.perCorrect), capped at the fixed 10-question
--   deal → max 100 XP per play. p_correct is still client-reported
--   (like p_correct in g7_submit_quest already is) but the AMOUNT
--   is never up to the client to name.
--
--  WHERE THE XP LANDS:
--   Same two tables g7_submit_quest already uses — public.progress
--   (quest_id = 'dice-m' / 'dice-s' / 'dice-t' / 'dice-st', one row
--   per student per chapter's dice pool, accumulating total_xp so
--   it naturally counts toward the learner's ★ total via the
--   UNCHANGED g7_get_state) and public.xp_events (so it counts
--   toward the weekly board via the UNCHANGED g7_admin_data). `passed`
--   is set to false and left false forever — Dice Quest has no
--   "mastered" badge, and dice-* ids are NOT in the client's
--   ROUND_LIST (js/admin.js / js/config.js) — the teacher dashboard's
--   per-round chip grid and CSV only ever look up known round ids,
--   so a dice-* row in `progress` can never leak into either. Only
--   the aggregate Weekly/All-time XP totals move — which is the
--   entire point of "XP pays every play". No dashboard code touched.
--
--  Column/table access: this project revokes ALL direct table access
--  from anon/authenticated and only exposes reads/writes through
--  SECURITY DEFINER RPCs — no column-level grants needed here either,
--  same as every prior migration.
-- ============================================================

create or replace function public.g7_submit_dice(
  p_username text, p_password text, p_pool text,
  p_score numeric, p_total int, p_correct int)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare sid uuid; qid text; correct_clamped int; xp_award int;
begin
  sid := public._g7_auth(p_username, p_password);
  if sid is null then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  if p_pool not in ('m', 's', 't', 'st') then return jsonb_build_object('ok', false, 'error', 'bad_pool'); end if;
  qid := 'dice-' || p_pool;

  -- server-besluite XP — sien lêerkop "WHY THE XP AMOUNT IS COMPUTED HERE".
  correct_clamped := greatest(0, least(coalesce(p_correct, 0), 10));
  xp_award := correct_clamped * 10;

  insert into public.progress (student_id, quest_id, best_score, attempts, total_xp, passed, last_played_at)
  values (sid, qid, coalesce(p_score, 0), 1, xp_award, false, now())
  on conflict (student_id, quest_id) do update set
    best_score = greatest(public.progress.best_score, excluded.best_score),
    attempts   = public.progress.attempts + 1,
    total_xp   = public.progress.total_xp + excluded.total_xp,
    last_played_at = now();
    -- 'passed' word doelbewus NOOIT op true gesit nie (geen kenteken vir
    -- Dice Quest nie) — dit hou dice-* ry's veilig buite elke "gemeester"-
    -- telling wat op progress.passed staatmaak.

  if xp_award > 0 then
    insert into public.xp_events (student_id, quest_id, xp, score) values (sid, qid, xp_award, p_score);
  end if;
  update public.students set last_active_at = now() where id = sid;

  return jsonb_build_object('ok', true, 'xpAwarded', xp_award);
end; $$;

grant execute on function
  public.g7_submit_dice(text, text, text, numeric, int, int)
to anon, authenticated;
