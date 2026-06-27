-- ============================================================
--  WISKUNDE AVONTUUR (Graad 7) — Supabase schema, security & RPC API
--  Run this whole file once in the Supabase SQL editor (Homework Hub).
--  Safe to re-run.
--
--  AUTH MODEL (self sign-up, like the Times Table game):
--   • Learners SIGN UP themselves: own name + username + password.
--   • Passwords are stored BCRYPT-HASHED — the teacher never sees them.
--   • Forgot a password? The teacher "resets" it (clears it); the learner
--     sets a new one on next login. Their progress is kept.
--
--  SECURITY: every table has RLS on with NO policies, so the publishable
--  key can't touch tables directly. All access goes through SECURITY
--  DEFINER functions that verify the password (or admin password)
--  server-side. The secret/service-role key is never needed.
--
--  All sections are open (no quest gating in this version).
-- ============================================================

create extension if not exists pgcrypto with schema extensions;

drop table if exists public.struggles cascade;
drop table if exists public.progress  cascade;
drop table if exists public.students  cascade;

create table public.students (
  id             uuid primary key default gen_random_uuid(),
  username       text unique not null,         -- login id (lower-cased)
  display_name   text not null,                -- name they show
  password       text,                         -- BCRYPT HASH; null = reset (set a new one)
  created_at     timestamptz not null default now(),
  last_active_at timestamptz
);

create table public.progress (
  id             uuid primary key default gen_random_uuid(),
  student_id     uuid not null references public.students(id) on delete cascade,
  quest_id       text not null,
  best_score     numeric not null default 0,
  attempts       int not null default 0,
  total_xp       int not null default 0,
  passed         boolean not null default false,
  last_played_at timestamptz,
  unique (student_id, quest_id)
);

create table public.struggles (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.students(id) on delete cascade,
  concept     text not null,
  count       int not null default 0,
  last_ts     timestamptz not null default now(),
  unique (student_id, concept)
);

create table if not exists public.app_config (key text primary key, value text);

-- ---------- lock everything down ----------
alter table public.students   enable row level security;
alter table public.progress   enable row level security;
alter table public.struggles  enable row level security;
alter table public.app_config enable row level security;
revoke all on public.students, public.progress, public.struggles, public.app_config from anon, authenticated;

drop function if exists public._g7_auth(text, text);
drop function if exists public.g7_signup(text, text, text);
drop function if exists public.g7_login(text, text);
drop function if exists public.g7_set_password(text, text);
drop function if exists public.g7_get_state(text, text);
drop function if exists public.g7_submit_quest(text, text, text, numeric, int, int, int);
drop function if exists public.g7_log_struggle(text, text, text);

-- ============================================================
--  HELPERS
-- ============================================================
create or replace function public._g7_auth(p_username text, p_password text)
returns uuid language sql stable security definer set search_path = public, extensions as $$
  select id from public.students
  where username = lower(p_username) and password is not null and password = crypt(p_password, password);
$$;

create or replace function public._g7_admin_ok(p_admin_password text)
returns boolean language sql stable security definer set search_path = public, extensions as $$
  select coalesce((select value = crypt(p_admin_password, value) from public.app_config where key = 'admin_password'), false);
$$;

-- ============================================================
--  LEARNER RPC
-- ============================================================
create or replace function public.g7_signup(p_username text, p_name text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare uname text := lower(trim(p_username));
begin
  if length(uname) < 3 then return jsonb_build_object('ok', false, 'error', 'username_short'); end if;
  if uname !~ '^[a-z0-9_.]+$' then return jsonb_build_object('ok', false, 'error', 'username_chars'); end if;
  if length(coalesce(p_password,'')) < 4 then return jsonb_build_object('ok', false, 'error', 'too_short'); end if;
  if length(coalesce(trim(p_name),'')) < 1 then return jsonb_build_object('ok', false, 'error', 'no_name'); end if;
  if exists (select 1 from public.students where username = uname) then
    return jsonb_build_object('ok', false, 'error', 'username_taken');
  end if;
  insert into public.students (username, display_name, password, last_active_at)
  values (uname, trim(p_name), crypt(p_password, gen_salt('bf')), now());
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.g7_login(p_username text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare s public.students;
begin
  select * into s from public.students where username = lower(p_username);
  if not found then return jsonb_build_object('ok', false, 'error', 'no_such_user'); end if;
  if s.password is null then return jsonb_build_object('ok', false, 'needsReset', true); end if;
  if s.password <> crypt(p_password, s.password) then return jsonb_build_object('ok', false, 'error', 'wrong_password'); end if;
  update public.students set last_active_at = now() where id = s.id;
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.g7_set_password(p_username text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare s public.students;
begin
  if length(coalesce(p_password,'')) < 4 then return jsonb_build_object('ok', false, 'error', 'too_short'); end if;
  select * into s from public.students where username = lower(p_username);
  if not found then return jsonb_build_object('ok', false, 'error', 'no_such_user'); end if;
  if s.password is not null then return jsonb_build_object('ok', false, 'error', 'already_set'); end if;
  update public.students set password = crypt(p_password, gen_salt('bf')), last_active_at = now() where id = s.id;
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.g7_get_state(p_username text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare sid uuid; prog jsonb; total int; nm text;
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

  return jsonb_build_object('ok', true,
    'student', jsonb_build_object('id', sid, 'name', nm, 'username', lower(p_username)),
    'progress', prog, 'totalXp', total);
end; $$;

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
  update public.students set last_active_at = now() where id = sid;

  return jsonb_build_object('ok', true, 'passed', now_passed,
    'badgeEarned', (now_passed and not was_passed), 'xpAwarded', xp_award, 'alreadyPassed', was_passed);
end; $$;

create or replace function public.g7_log_struggle(p_username text, p_password text, p_concept text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare sid uuid;
begin
  sid := public._g7_auth(p_username, p_password);
  if sid is null then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  insert into public.struggles (student_id, concept, count, last_ts) values (sid, p_concept, 1, now())
  on conflict (student_id, concept) do update set count = public.struggles.count + 1, last_ts = now();
  return jsonb_build_object('ok', true);
end; $$;

-- ============================================================
--  ADMIN RPC  (every function checks the admin password)
-- ============================================================
create or replace function public.g7_admin_login(p_admin_password text)
returns jsonb language sql security definer set search_path = public, extensions as $$
  select jsonb_build_object('ok', public._g7_admin_ok(p_admin_password));
$$;

create or replace function public.g7_admin_data(p_admin_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare rows jsonb; strug jsonb;
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

  return jsonb_build_object('ok', true, 'rows', rows, 'struggles', strug, 'inactiveDays', 7);
end; $$;

create or replace function public.g7_admin_reset_password(p_admin_password text, p_id uuid)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public._g7_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  update public.students set password = null where id = p_id;
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.g7_admin_remove_student(p_admin_password text, p_id uuid)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public._g7_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  delete from public.students where id = p_id;
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.g7_admin_reset_progress(p_admin_password text, p_id uuid)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public._g7_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  delete from public.progress  where student_id = p_id;
  delete from public.struggles where student_id = p_id;
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.g7_admin_resolve_struggle(p_admin_password text, p_concept text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public._g7_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  delete from public.struggles where concept = p_concept;
  return jsonb_build_object('ok', true);
end; $$;

-- ============================================================
--  GRANTS — the publishable/anon key may only EXECUTE the API
-- ============================================================
grant execute on function
  public.g7_signup(text, text, text),
  public.g7_login(text, text),
  public.g7_set_password(text, text),
  public.g7_get_state(text, text),
  public.g7_submit_quest(text, text, text, numeric, int, int, int),
  public.g7_log_struggle(text, text, text),
  public.g7_admin_login(text),
  public.g7_admin_data(text),
  public.g7_admin_reset_password(text, uuid),
  public.g7_admin_remove_student(text, uuid),
  public.g7_admin_reset_progress(text, uuid),
  public.g7_admin_resolve_struggle(text, text)
to anon, authenticated;

-- ============================================================
--  SEED — admin password (default 'admin'). CHANGE IT with:
--    update public.app_config set value = crypt('JOU-WAGWOORD', gen_salt('bf')) where key='admin_password';
-- ============================================================
insert into public.app_config (key, value) values ('admin_password', crypt('admin', gen_salt('bf')))
on conflict (key) do nothing;
