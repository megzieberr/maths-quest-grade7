-- ============================================================
--  MIGRATION — WEEKLY WINNERS (Circle Quest pattern, ported)
--  ------------------------------------------------------------
--  Run this ONCE in the Supabase SQL editor (Homework Hub). Safe to
--  re-run. ADDITIVE — never touches learner accounts, progress, or
--  any existing table, and never drops anything. Do NOT run this
--  from a build session — it is the ship step's job.
--
--  Adds:
--   1. g7_leaderboard(p_username, p_password) — the "🏆 Leaderboard"
--      screen: Hierdie week + Altyd boards, plus the caller's own
--      rank on each (myWeekly / myAllTime), even when they're
--      outside the visible top rows.
--   2. g7_weekly_results(p_username, p_password) — the Monday/Tuesday
--      "crown" popup: last week's settled board + three DIFFERENT
--      award winners (star / most-improved / on-fire, each excludes
--      the ones before it) + perfectWeek (everyone who hit 7/7 daily
--      quests) + the caller's own finish, movement and best-ever week.
--      Direct port of Circle Quest's phase9.sql cgg_weekly_results,
--      minus champion/nicknames/perfectWeekRoster (Gr7 doesn't have
--      that layer).
--   3. g7_admin_weekly_results(p_admin_password) — the same crown
--      numbers, admin-password gated, no learner-personal fields, for
--      the teacher dashboard's weekly-winners preview panel. Port of
--      Circle Quest's phase9.sql admin variant (the one that already
--      carries the distinct-SA-day fix and perfectWeek — the plan
--      brief calls this "phase8.sql's admin variant" but phase8's own
--      body was superseded by phase9's before Circle Quest shipped).
--   4. g7_admin_data — re-declared with ONE change from the version in
--      migration-teacher-dashboard.sql: the Weekly XP column now uses
--      the SAME window as the learner board (greatest(weekly_anchor,
--      this Monday)), so the teacher dashboard and the learner
--      leaderboard never disagree. Nothing else about the function
--      changes.
--
--  HOW THE TWO WEEK WINDOWS DIFFER (both computed server-side so every
--  device agrees):
--   • g7_leaderboard's "Hierdie week" AND g7_admin_data's Weekly XP use
--     greatest(date_trunc('week', now()), _g7_week_start()) — the
--     LATER of this Monday and her manual "↺ Reset weekly" anchor. So
--     the board auto-resets every Monday 00:00 AND her reset button
--     still zeroes it mid-week.
--   • g7_weekly_results / g7_admin_weekly_results (the crown) use PURE
--     calendar weeks (date_trunc('week', now()) - 7 days), same as
--     Circle Quest. weekly_anchor does NOT apply to the crown — last
--     week's winners stay last week's winners even if she resets the
--     live board on Wednesday.
--
--  SAFE to run on the live database, even while learners play:
--    • Only CREATES three new functions and REPLACES g7_admin_data's
--      body (additive column-filter change only). No tables touched.
--    • Idempotent ("or replace").
--    • Same security model as every other Gr7 RPC: SECURITY DEFINER,
--      search_path pinned, server-side password checks via _g7_auth /
--      _g7_admin_ok. No direct table grants — anon/authenticated still
--      cannot touch students/progress/xp_events directly.
--
--  Rollback notes are at the bottom.
-- ============================================================

-- ------------------------------------------------------------
-- 1. g7_leaderboard — weekly + all-time boards, plus the caller's own
--    rank on each. Weekly rows/allTime rows only include xp > 0 (kids
--    with no XP yet don't clutter the board); myWeekly/myAllTime are
--    still returned even for a caller with 0 XP, using the SAME rank()
--    computed over every learner (so "you'd be tied-last" is honest).
--    All-time XP = sum(progress.total_xp) — the complete history —
--    NOT a sum over xp_events, which only exists since the teacher-
--    dashboard migration and would understate anyone who played
--    before it ran.
-- ------------------------------------------------------------
create or replace function public.g7_leaderboard(p_username text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  sid uuid;
  ws  timestamptz := greatest(date_trunc('week', now()), public._g7_week_start());
  weekly jsonb; alltime jsonb; my_w jsonb; my_a jsonb;
begin
  sid := public._g7_auth(p_username, p_password);
  if sid is null then return jsonb_build_object('ok', false, 'error', 'auth'); end if;

  with totals as (
    select s.id, s.display_name as name,
           coalesce((select sum(e.xp) from public.xp_events e
                     where e.student_id = s.id and e.created_at >= ws), 0) as wk,
           coalesce((select sum(p.total_xp) from public.progress p
                     where p.student_id = s.id), 0) as al
    from public.students s
  ),
  wrank as (select *, rank() over (order by wk desc) r from totals),
  arank as (select *, rank() over (order by al desc) r from totals)
  select
    (select jsonb_agg(jsonb_build_object('name', name, 'xp', wk, 'rank', r) order by r, name)
       from wrank where wk > 0),
    (select jsonb_agg(jsonb_build_object('name', name, 'xp', al, 'rank', r) order by r, name)
       from arank where al > 0),
    (select jsonb_build_object('xp', wk, 'rank', r) from wrank where id = sid),
    (select jsonb_build_object('xp', al, 'rank', r) from arank where id = sid)
  into weekly, alltime, my_w, my_a;

  return jsonb_build_object('ok', true,
    'weekly', coalesce(weekly, '[]'::jsonb), 'allTime', coalesce(alltime, '[]'::jsonb),
    'myWeekly', my_w, 'myAllTime', my_a);
end; $$;

-- ------------------------------------------------------------
-- 2. g7_weekly_results — the learner crown popup. Direct port of
--    Circle Quest's phase9.sql cgg_weekly_results:
--      • daily counts = distinct Africa/Johannesburg days with a
--        quest_id like 'daily-%' event, within last week's SA Mon-Sun
--        (Gr7's daily quest ids are 'daily-YYYY-MM-DD', not a fixed
--        round_id, so 'like' replaces the '=' comparison)
--      • On-Fire tie-break: earliest finisher, then name
--      • star / mostImproved / onFire are mutually exclusive (each
--        excludes everyone already picked)
--      • 'perfectWeek': plain array of names of EVERYONE who hit 7/7
--        (not winner-take-all) — no perfectWeekRoster, no champion,
--        no nicknames (Gr7 doesn't have that layer)
--      • weekStart is epoch-ms of last week's Monday (UTC)
-- ------------------------------------------------------------
create or replace function public.g7_weekly_results(p_username text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  sid      uuid;
  lw_start timestamptz := date_trunc('week', now()) - interval '7 days';   -- last week's Monday (UTC, XP sums)
  lw_end   timestamptz := date_trunc('week', now());                       -- this week's Monday (exclusive)
  pw_start timestamptz := date_trunc('week', now()) - interval '14 days';  -- week-before Monday
  lw_sa    date := (date_trunc('week', now() at time zone 'Africa/Johannesburg'))::date - 7;  -- last SA Monday (daily counts)
  result   jsonb;
begin
  sid := public._g7_auth(p_username, p_password);
  if sid is null then return jsonb_build_object('ok', false, 'error', 'auth'); end if;

  with weekly as (
    select s.id, s.display_name as name,
      coalesce(sum(e.xp) filter (where e.created_at >= lw_start and e.created_at < lw_end), 0) as lw,
      coalesce(sum(e.xp) filter (where e.created_at >= pw_start and e.created_at < lw_start), 0) as pw,
      coalesce(count(distinct (e.created_at at time zone 'Africa/Johannesburg')::date)
               filter (where e.quest_id like 'daily-%'
                         and (e.created_at at time zone 'Africa/Johannesburg')::date
                             between lw_sa and lw_sa + 6), 0) as daily_days,
      max(e.created_at) filter (where e.quest_id like 'daily-%'
                         and (e.created_at at time zone 'Africa/Johannesburg')::date
                             between lw_sa and lw_sa + 6) as last_daily
    from public.students s
    left join public.xp_events e on e.student_id = s.id
    group by s.id, s.display_name
  ),
  ranked as (
    select *, rank() over (order by lw desc) as lr, rank() over (order by pw desc) as pr
    from weekly
  ),
  star as (
    select id, name, lw from ranked where lw > 0 order by lw desc, name limit 1
  ),
  imp as (
    select id, name, (lw - pw) as delta from ranked
    where (lw - pw) > 0 and id is distinct from (select id from star)
    order by (lw - pw) desc, name limit 1
  ),
  fire as (
    select id, name, daily_days as days from ranked
    where daily_days > 0
      and id is distinct from (select id from star)
      and id is distinct from (select id from imp)
    order by daily_days desc, last_daily asc, name limit 1
  ),
  perfect as (
    select jsonb_agg(name order by name) j from ranked where daily_days >= 7
  ),
  board as (
    select jsonb_agg(jsonb_build_object('name', name, 'xp', lw, 'rank', lr) order by lr) j
    from ranked where lw > 0
  )
  select jsonb_build_object(
    'ok', true,
    'weekStart', (extract(epoch from lw_start) * 1000)::bigint,
    'board', coalesce((select j from board), '[]'::jsonb),
    'star',  (select jsonb_build_object('name', name, 'xp', lw) from star),
    'mostImproved', (select jsonb_build_object('name', name, 'delta', delta) from imp),
    'onFire', (select jsonb_build_object('name', name, 'days', days) from fire),
    'perfectWeek', coalesce((select j from perfect), '[]'::jsonb),
    'me', (select jsonb_build_object('xp', lw, 'rank', lr) from ranked where id = sid),
    'prevRank', (select case when pw > 0 then pr else null end from ranked where id = sid),
    'bestPrevXp', coalesce((
        select max(wk_sum) from (
          select sum(xp) as wk_sum
          from public.xp_events
          where student_id = sid and created_at < lw_start
          group by date_trunc('week', created_at)
        ) t), 0)
  ) into result;

  return result;
end; $$;

-- ------------------------------------------------------------
-- 3. g7_admin_weekly_results — the teacher dashboard's admin view of
--    the exact same crown numbers, admin-password gated, no learner-
--    personal fields (me / prevRank / bestPrevXp — there is no "me").
--    Same computation as g7_weekly_results so the two never disagree.
-- ------------------------------------------------------------
create or replace function public.g7_admin_weekly_results(p_admin_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  lw_start timestamptz := date_trunc('week', now()) - interval '7 days';
  lw_end   timestamptz := date_trunc('week', now());
  pw_start timestamptz := date_trunc('week', now()) - interval '14 days';
  lw_sa    date := (date_trunc('week', now() at time zone 'Africa/Johannesburg'))::date - 7;
  result   jsonb;
begin
  if not public._g7_admin_ok(p_admin_password) then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  with weekly as (
    select s.id, s.display_name as name,
      coalesce(sum(e.xp) filter (where e.created_at >= lw_start and e.created_at < lw_end), 0) as lw,
      coalesce(sum(e.xp) filter (where e.created_at >= pw_start and e.created_at < lw_start), 0) as pw,
      coalesce(count(distinct (e.created_at at time zone 'Africa/Johannesburg')::date)
               filter (where e.quest_id like 'daily-%'
                         and (e.created_at at time zone 'Africa/Johannesburg')::date
                             between lw_sa and lw_sa + 6), 0) as daily_days,
      max(e.created_at) filter (where e.quest_id like 'daily-%'
                         and (e.created_at at time zone 'Africa/Johannesburg')::date
                             between lw_sa and lw_sa + 6) as last_daily
    from public.students s
    left join public.xp_events e on e.student_id = s.id
    group by s.id, s.display_name
  ),
  ranked as (
    select *, rank() over (order by lw desc) as lr
    from weekly
  ),
  star as (
    select id, name, lw from ranked where lw > 0 order by lw desc, name limit 1
  ),
  imp as (
    select id, name, (lw - pw) as delta from ranked
    where (lw - pw) > 0 and id is distinct from (select id from star)
    order by (lw - pw) desc, name limit 1
  ),
  fire as (
    select id, name, daily_days as days from ranked
    where daily_days > 0
      and id is distinct from (select id from star)
      and id is distinct from (select id from imp)
    order by daily_days desc, last_daily asc, name limit 1
  ),
  perfect as (
    select jsonb_agg(name order by name) j from ranked where daily_days >= 7
  ),
  board as (
    select jsonb_agg(jsonb_build_object('name', name, 'xp', lw, 'rank', lr) order by lr) j
    from ranked where lw > 0
  )
  select jsonb_build_object(
    'ok', true,
    'weekStart', (extract(epoch from lw_start) * 1000)::bigint,
    'board', coalesce((select j from board), '[]'::jsonb),
    'star',  (select jsonb_build_object('name', name, 'xp', lw) from star),
    'mostImproved', (select jsonb_build_object('name', name, 'delta', delta) from imp),
    'onFire', (select jsonb_build_object('name', name, 'days', days) from fire),
    'perfectWeek', coalesce((select j from perfect), '[]'::jsonb)
  ) into result;

  return result;
end; $$;

-- ------------------------------------------------------------
-- 4. g7_admin_data — re-declared, IDENTICAL to the body in
--    migration-teacher-dashboard.sql, except the Weekly XP column's
--    filter now matches g7_leaderboard's live window instead of only
--    _g7_week_start(), so the teacher never sees a Weekly XP number
--    that disagrees with what the kids see on their own board.
-- ------------------------------------------------------------
create or replace function public.g7_admin_data(p_admin_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare ws timestamptz; rows jsonb; strug jsonb; qs jsonb;
begin
  if not public._g7_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  ws := public._g7_week_start();

  with totals as (
    select s.id, s.display_name as name, s.username, (s.password is not null) as has_pw, s.last_active_at,
           coalesce(sum(e.xp) filter (where e.created_at >= greatest(ws, date_trunc('week', now()))), 0) as wk,
           coalesce((select sum(total_xp) from public.progress p where p.student_id = s.id), 0) as al
    from public.students s left join public.xp_events e on e.student_id = s.id
    group by s.id, s.display_name, s.username, s.password, s.last_active_at
  )
  select coalesce(jsonb_agg(jsonb_build_object(
      'id', id, 'name', name, 'username', username, 'hasPassword', has_pw,
      'weeklyXp', wk, 'totalXp', al, 'lastActive', last_active_at,
      'quests', coalesce((select jsonb_object_agg(quest_id, jsonb_build_object(
                    'best_score', best_score, 'attempts', attempts, 'passed', passed,
                    'last_played_at', last_played_at)) from public.progress p where p.student_id = totals.id), '{}'::jsonb)
    ) order by al desc, name), '[]'::jsonb)
  into rows from totals;

  select coalesce(jsonb_agg(j order by (j->>'count')::int desc), '[]'::jsonb) into strug
  from (select jsonb_build_object('concept', concept, 'count', sum(count), 'students', count(distinct student_id)) j
        from public.struggles group by concept) t;

  select coalesce(jsonb_agg(jsonb_build_object('quest_id', quest_id, 'chapter', chapter, 'is_open', is_open) order by sort), '[]'::jsonb)
    into qs from public.quests;

  return jsonb_build_object('ok', true, 'rows', rows, 'struggles', strug, 'quests', qs, 'inactiveDays', 7);
end; $$;

-- ============================================================
--  PART 5 — GRANTS (every function this file creates or replaces)
-- ============================================================
grant execute on function
  public.g7_leaderboard(text, text),
  public.g7_weekly_results(text, text),
  public.g7_admin_weekly_results(text),
  public.g7_admin_data(text)
to anon, authenticated;

-- ============================================================
--  ROLLBACK — to undo:
--    drop function if exists public.g7_leaderboard(text, text);
--    drop function if exists public.g7_weekly_results(text, text);
--    drop function if exists public.g7_admin_weekly_results(text);
--  g7_admin_data cannot simply be dropped (other code depends on it) —
--  re-declare it with migration-teacher-dashboard.sql's body instead
--  (section 5 of that file), which restores the old
--  'e.created_at >= ws' weekly filter.
-- ============================================================
