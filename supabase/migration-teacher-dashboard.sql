-- ============================================================
--  MIGRATION — RICH TEACHER DASHBOARD (+ round gating)
--  ------------------------------------------------------------
--  Run this ONCE in the Supabase SQL editor (Homework Hub).
--  Safe to re-run. ADDITIVE — never touches learner accounts or
--  progress, so no data is lost.
--
--  This single file sets up BOTH:
--   • round open/close gating (the `quests` table + admin RPCs)
--   • the rich dashboard: per-round best-% grid, plus Weekly and
--     All-time XP (with a "reset weekly board" button)
--
--  If you already ran migration-quest-gating.sql, this is still
--  safe — it just adds the dashboard pieces on top.
-- ============================================================

-- ---------- 1. round gating table (seeded all-open) ----------
create table if not exists public.quests (
  quest_id text primary key,
  chapter  text not null,
  is_open  boolean not null default true,
  sort     int not null default 0
);
alter table public.quests enable row level security;
revoke all on public.quests from anon, authenticated;

insert into public.quests (quest_id, chapter, is_open, sort) values
  ('u1','uitdrukkings',true,1),('u2','uitdrukkings',true,2),('u3','uitdrukkings',true,3),
  ('u4','uitdrukkings',true,4),('u5','uitdrukkings',true,5),
  ('v1','vergelykings',true,11),('v2','vergelykings',true,12),('v3','vergelykings',true,13),
  ('v4','vergelykings',true,14),('v5','vergelykings',true,15),('v6','vergelykings',true,16),
  ('v7','vergelykings',true,17),('v8','vergelykings',true,18),('v9','vergelykings',true,19),
  ('v10','vergelykings',true,20),
  ('m1','meetkunde',true,21),('m2','meetkunde',true,22),('m3','meetkunde',true,23),
  ('m4','meetkunde',true,24),('m5','meetkunde',true,25),('m6','meetkunde',true,26),
  ('m7','meetkunde',true,27),('m8','meetkunde',true,28),('m9','meetkunde',true,29),
  ('m10','meetkunde',true,30),
  ('s1','vorms',true,31),('s2','vorms',true,32),('s3','vorms',true,33),('s4','vorms',true,34),
  ('s5','vorms',true,35),('s6','vorms',true,36),('s7','vorms',true,37),('s8','vorms',true,38),
  ('s9','vorms',true,39),('s10','vorms',true,40),
  ('t1','transformasies',true,41),('t2','transformasies',true,42),('t3','transformasies',true,43),
  ('t4','transformasies',true,44),('t5','transformasies',true,45),('t6','transformasies',true,46),
  ('t7','transformasies',true,47),('t8','transformasies',true,48),('t9','transformasies',true,49),
  ('t10','transformasies',true,50)
on conflict (quest_id) do nothing;

-- ---------- 2. xp_events (append-only) — powers the weekly board ----------
create table if not exists public.xp_events (
  id          bigserial primary key,
  student_id  uuid not null references public.students(id) on delete cascade,
  quest_id    text,
  xp          int not null,
  score       numeric,
  created_at  timestamptz not null default now()
);
alter table public.xp_events enable row level security;
revoke all on public.xp_events from anon, authenticated;
create index if not exists xp_events_student_time on public.xp_events (student_id, created_at);

-- the weekly window starts at the 'weekly_anchor' (or 'epoch' if never reset)
create or replace function public._g7_week_start()
returns timestamptz language sql stable security definer set search_path = public, extensions as $$
  select coalesce((select value::timestamptz from public.app_config where key = 'weekly_anchor'), 'epoch'::timestamptz);
$$;

-- ---------- 3. submit_quest: also log an XP event (for the weekly board) ----------
create or replace function public.g7_submit_quest(
  p_username text, p_password text, p_quest text,
  p_score numeric, p_xp int, p_total int, p_correct int)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare sid uuid; was_passed boolean := false; now_passed boolean; xp_award int;
begin
  sid := public._g7_auth(p_username, p_password);
  if sid is null then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  now_passed := (p_score >= 0.8);
  select passed into was_passed from public.progress where student_id = sid and quest_id = p_quest;
  was_passed := coalesce(was_passed, false);
  if was_passed then xp_award := 0; else xp_award := greatest(0, least(coalesce(p_xp, 0), 1000)); end if;

  insert into public.progress (student_id, quest_id, best_score, attempts, total_xp, passed, last_played_at)
  values (sid, p_quest, p_score, 1, xp_award, now_passed, now())
  on conflict (student_id, quest_id) do update set
    best_score = greatest(public.progress.best_score, excluded.best_score),
    attempts   = public.progress.attempts + 1,
    total_xp   = public.progress.total_xp + excluded.total_xp,
    passed     = public.progress.passed or excluded.passed,
    last_played_at = now();

  if xp_award > 0 then
    insert into public.xp_events (student_id, quest_id, xp, score) values (sid, p_quest, xp_award, p_score);
  end if;
  update public.students set last_active_at = now() where id = sid;

  return jsonb_build_object('ok', true, 'passed', now_passed,
    'badgeEarned', (now_passed and not was_passed), 'xpAwarded', xp_award, 'alreadyPassed', was_passed);
end; $$;

-- ---------- 4. get_state: returns openQuests (learner gating) ----------
create or replace function public.g7_get_state(p_username text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare sid uuid; prog jsonb; total int; open_q jsonb; nm text;
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

  return jsonb_build_object('ok', true,
    'student', jsonb_build_object('id', sid, 'name', nm, 'username', lower(p_username)),
    'progress', prog, 'totalXp', total, 'openQuests', open_q);
end; $$;

-- ---------- 5. admin_data: per-learner Weekly + All-time XP, per-round best%, gating ----------
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

  select coalesce(jsonb_agg(jsonb_build_object('quest_id', quest_id, 'chapter', chapter, 'is_open', is_open) order by sort), '[]'::jsonb)
    into qs from public.quests;

  return jsonb_build_object('ok', true, 'rows', rows, 'struggles', strug, 'quests', qs, 'inactiveDays', 7);
end; $$;

-- ---------- 6. round gating admin RPCs ----------
create or replace function public.g7_admin_set_quest_open(p_admin_password text, p_quest text, p_open boolean)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public._g7_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  update public.quests set is_open = p_open where quest_id = p_quest;
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.g7_admin_set_chapter_open(p_admin_password text, p_chapter text, p_open boolean)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public._g7_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  update public.quests set is_open = p_open where chapter = p_chapter;
  return jsonb_build_object('ok', true);
end; $$;

-- ---------- 7. reset the weekly board to zero for everyone ----------
create or replace function public.g7_admin_reset_weekly(p_admin_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public._g7_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  insert into public.app_config (key, value) values ('weekly_anchor', now()::text)
    on conflict (key) do update set value = excluded.value;
  return jsonb_build_object('ok', true);
end; $$;

grant execute on function
  public.g7_submit_quest(text, text, text, numeric, int, int, int),
  public.g7_get_state(text, text),
  public.g7_admin_data(text),
  public.g7_admin_set_quest_open(text, text, boolean),
  public.g7_admin_set_chapter_open(text, text, boolean),
  public.g7_admin_reset_weekly(text)
to anon, authenticated;
