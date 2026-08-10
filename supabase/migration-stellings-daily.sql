-- ============================================================
--  MIGRATION — MEETKUNDE STELLINGS + 2D DRILLS SEEDING, + DAILY
--  QUEST "IN HERSIENING" TICK-LIST
--  ------------------------------------------------------------
--  Run this ONCE in the Supabase SQL editor (Homework Hub, ref
--  wjkhedepwnwrqcpxmkds). Safe to re-run. ADDITIVE — never touches
--  learner accounts or progress, so no data is lost.
--
--  ⚠️ DO NOT RUN FROM A BUILD SESSION. This file is written by
--  Session 6 of the 2026-08-10 run plan but the SQL itself only
--  runs from the Fable foreman session, after Megan's explicit
--  go-ahead. Until it runs, new rounds render "Binnekort" (missing
--  quests-table rows are treated as not-open) and the daily-quest
--  tile never appears (g7_get_state won't return `revision` yet) —
--  that's the safe, expected state.
--
--  This single file does THREE things:
--   1. Seeds st1–st32 (chapter 'stellings') + s11/s12 (chapter
--      'vorms') into public.quests, CLOSED (her ruling — new
--      content starts closed; she opens each round as she teaches
--      it, same as every other round has worked since gating
--      arrived).
--   2. Adds the `in_revision` tick-list to public.quests — a
--      SEPARATE flag from is_open (a round can be open AND ticked
--      for revision at the same time) — and updates g7_admin_data /
--      g7_get_state to carry it, plus a new admin RPC to flip it.
--   3. No new tables. The daily quest itself has no seed row here —
--      its quest_id is the dynamic "daily-YYYY-MM-DD" string,
--      submitted through the existing g7_submit_quest exactly like
--      any other round (no gating check happens at submit time —
--      see g7_submit_quest below — so it never needs a quests row).
--
--  Column-grant check (per the project's standing gotcha about new
--  columns needing their own grants): this project revokes ALL
--  direct table access from anon/authenticated and only exposes
--  reads/writes through SECURITY DEFINER RPCs (no column-level
--  grants anywhere in schema.sql). So `in_revision` needs no grant
--  of its own — it just needs the RPCs below (already covered by
--  the final `grant execute` block) to read/write it.
-- ============================================================

-- ---------- 1. seed st1–st32 + s11/s12, CLOSED ----------
insert into public.quests (quest_id, chapter, is_open, sort) values
  ('st1','stellings',false,200),('st2','stellings',false,201),('st3','stellings',false,202),
  ('st4','stellings',false,203),('st5','stellings',false,204),('st6','stellings',false,205),
  ('st7','stellings',false,206),('st8','stellings',false,207),('st9','stellings',false,208),
  ('st10','stellings',false,209),('st11','stellings',false,210),('st12','stellings',false,211),
  ('st13','stellings',false,212),('st14','stellings',false,213),('st15','stellings',false,214),
  ('st16','stellings',false,215),('st17','stellings',false,216),('st18','stellings',false,217),
  ('st19','stellings',false,218),('st20','stellings',false,219),('st21','stellings',false,220),
  ('st22','stellings',false,221),('st23','stellings',false,222),('st24','stellings',false,223),
  ('st25','stellings',false,224),('st26','stellings',false,225),('st27','stellings',false,226),
  ('st28','stellings',false,227),('st29','stellings',false,228),('st30','stellings',false,229),
  ('st31','stellings',false,230),('st32','stellings',false,231),
  ('s11','vorms',false,241),('s12','vorms',false,242)
on conflict (quest_id) do nothing;

-- ---------- 2. in_revision tick-list (separate from is_open) ----------
alter table public.quests add column if not exists in_revision boolean not null default false;

-- ---------- 3. g7_admin_data: now also carries in_revision per quest ----------
create or replace function public.g7_admin_data(p_admin_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare ws timestamptz; rows jsonb; strug jsonb; qs jsonb;
begin
  if not public._g7_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  ws := public._g7_week_start();

  with totals as (
    select s.id, s.display_name as name, s.username, (s.password is not null) as has_pw, s.last_active_at,
           coalesce(sum(e.xp) filter (where e.created_at >= ws), 0) as wk,
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

  select coalesce(jsonb_agg(jsonb_build_object(
            'quest_id', quest_id, 'chapter', chapter, 'is_open', is_open, 'in_revision', in_revision
          ) order by sort), '[]'::jsonb)
    into qs from public.quests;

  return jsonb_build_object('ok', true, 'rows', rows, 'struggles', strug, 'quests', qs, 'inactiveDays', 7);
end; $$;

-- ---------- 4. g7_get_state: now also returns `revision` (in-hersiening quest ids) ----------
create or replace function public.g7_get_state(p_username text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare sid uuid; prog jsonb; total int; open_q jsonb; rev_q jsonb; nm text;
begin
  sid := public._g7_auth(p_username, p_password);
  if sid is null then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  update public.students set last_active_at = now() where id = sid;
  select display_name into nm from public.students where id = sid;

  select coalesce(jsonb_object_agg(quest_id, jsonb_build_object(
            'best_score', best_score, 'attempts', attempts, 'total_xp', total_xp,
            'passed', passed, 'last_played_at', last_played_at)), '{}'::jsonb)
    into prog from public.progress where student_id = sid;
  select coalesce(sum(total_xp), 0) into total from public.progress where student_id = sid;
  select coalesce(jsonb_agg(quest_id order by sort), '[]'::jsonb) into open_q
    from public.quests where is_open;
  select coalesce(jsonb_agg(quest_id order by sort), '[]'::jsonb) into rev_q
    from public.quests where in_revision;

  return jsonb_build_object('ok', true,
    'student', jsonb_build_object('id', sid, 'name', nm, 'username', lower(p_username)),
    'progress', prog, 'totalXp', total, 'openQuests', open_q, 'revision', rev_q);
end; $$;

-- ---------- 5. new admin RPC: flip the hersiening tick for one round ----------
create or replace function public.g7_admin_set_revision(p_admin_password text, p_quest text, p_flag boolean)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public._g7_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  update public.quests set in_revision = p_flag where quest_id = p_quest;
  return jsonb_build_object('ok', true);
end; $$;

grant execute on function
  public.g7_admin_data(text),
  public.g7_get_state(text, text),
  public.g7_admin_set_revision(text, text, boolean)
to anon, authenticated;
