-- ============================================================
--  MIGRATION — QUEST GATING (teacher opens/closes each round)
--  ------------------------------------------------------------
--  Run this ONCE in the Supabase SQL editor (Homework Hub).
--  Safe to re-run. ADDITIVE — it does NOT touch students,
--  progress or struggles, so no learner data is lost.
--
--  What it does:
--   • adds a `quests` table (one row per round, with is_open)
--   • makes g7_get_state return `openQuests` (the learner app
--     only shows rounds that are open)
--   • makes g7_admin_data return the open/closed state
--   • adds g7_admin_set_quest_open + g7_admin_set_chapter_open
--
--  DEFAULT: every round starts OPEN. Close the ones you haven't
--  taught yet from the admin dashboard.
-- ============================================================

create table if not exists public.quests (
  quest_id text primary key,
  chapter  text not null,
  is_open  boolean not null default true,
  sort     int not null default 0
);
alter table public.quests enable row level security;
revoke all on public.quests from anon, authenticated;

-- seed every round (open). on conflict: keep the teacher's current choice.
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

-- ---------- g7_get_state: now also returns openQuests ----------
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

-- ---------- g7_admin_data: now also returns the quests' open/closed state ----------
create or replace function public.g7_admin_data(p_admin_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare rows jsonb; strug jsonb; qs jsonb;
begin
  if not public._g7_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;

  select coalesce(jsonb_agg(jsonb_build_object(
      'id', s.id, 'name', s.display_name, 'username', s.username,
      'hasPassword', (s.password is not null),
      'lastActive', s.last_active_at,
      'totalXp', coalesce((select sum(total_xp) from public.progress p where p.student_id = s.id), 0),
      'quests', coalesce((select jsonb_object_agg(quest_id, jsonb_build_object(
                  'best_score', best_score, 'attempts', attempts, 'passed', passed,
                  'last_played_at', last_played_at)) from public.progress p where p.student_id = s.id), '{}'::jsonb)
    ) order by s.display_name), '[]'::jsonb)
  into rows from public.students s;

  select coalesce(jsonb_agg(j order by (j->>'count')::int desc), '[]'::jsonb) into strug
  from (select jsonb_build_object('concept', concept, 'count', sum(count), 'students', count(distinct student_id)) j
        from public.struggles group by concept) t;

  select coalesce(jsonb_agg(jsonb_build_object('quest_id', quest_id, 'chapter', chapter, 'is_open', is_open) order by sort), '[]'::jsonb)
    into qs from public.quests;

  return jsonb_build_object('ok', true, 'rows', rows, 'struggles', strug, 'quests', qs, 'inactiveDays', 7);
end; $$;

-- ---------- open/close a single round ----------
create or replace function public.g7_admin_set_quest_open(p_admin_password text, p_quest text, p_open boolean)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public._g7_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  update public.quests set is_open = p_open where quest_id = p_quest;
  return jsonb_build_object('ok', true);
end; $$;

-- ---------- open/close a whole chapter at once ----------
create or replace function public.g7_admin_set_chapter_open(p_admin_password text, p_chapter text, p_open boolean)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public._g7_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  update public.quests set is_open = p_open where chapter = p_chapter;
  return jsonb_build_object('ok', true);
end; $$;

grant execute on function
  public.g7_get_state(text, text),
  public.g7_admin_data(text),
  public.g7_admin_set_quest_open(text, text, boolean),
  public.g7_admin_set_chapter_open(text, text, boolean)
to anon, authenticated;
