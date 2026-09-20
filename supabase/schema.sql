-- ============================================================================
-- Relate World — Bible Reading + Bible Quiz (Supabase)
-- Shared project: https://yibzghpliehtpxovmccy.supabase.co (same as mobile).
--
-- This domain moved out of MongoDB entirely: reading-plan CONTENT, per-club
-- section unlock/progress and per-club Bible Quiz logs all live here. The only
-- per-user rows are profiles.club (the immutable club lock) and reading
-- progress / quiz logs — everything else is content.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Clubs — grouped by age into SIX registration choices (source of truth).
--    Adults is ONE registration choice; the underlying Prime/Anchor/Base/Nexus
--    slugs each still keep their own club page + own quiz board.
-- ---------------------------------------------------------------------------
create table if not exists public.clubs (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,            -- e.g. 'sprout-kids'
  name        text not null,
  group_key   text not null unique,            -- registration group: kids|tweens|teens|surge|pulse|adults
  age_min     integer not null,
  age_max     integer not null,
  sort        integer not null default 0
);
insert into public.clubs (slug, name, group_key, age_min, age_max, sort) values
  ('sprout-kids',   'Sprout Kids',   'kids',   6,   8,  10),
  ('sprout-tweens', 'Sprout Tweens', 'tweens', 9,  11,  20),
  ('sprout-teens',  'Sprout Teens',  'teens', 12,  16,  30),
  ('surge',         'Surge',         'surge', 16,  21,  40),
  ('pulse',         'Pulse',         'pulse', 21,  33,  50),
  ('prime',         'Prime',         'adults',33,  99,  60),
  ('anchor',        'Anchor',        'adults',33,  99,  70),
  ('base',          'Base',          'adults',33,  99,  80),
  ('nexus',         'Nexus',         'adults',33,  99,  90)
on conflict (slug) do update
  set name = excluded.name, group_key = excluded.group_key,
      age_min = excluded.age_min, age_max = excluded.age_max,
      sort = excluded.sort;

-- ---------------------------------------------------------------------------
-- 2. profiles — one row per auth user. `club` is chosen once at registration
--    and is IMMUTABLE from the user side; only an admin can change it.
--    (Guard column on the row so accidental profile edits can't touch it.)
-- ---------------------------------------------------------------------------
alter table public.profiles add column if not exists club text;
alter table public.profiles add column if not exists club_guard integer not null default 1
  check (club_guard = 1);

-- ---------------------------------------------------------------------------
-- 3. Reading plans — the seeded (and soon admin-created) plans across every
--    category (Bible Reading now, others later). One row per plan.
-- ---------------------------------------------------------------------------
create table if not exists public.reading_plans (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  tagline     text,
  description text,
  category    text not null,                    -- 'Bible Reading' + future categories
  cover       text,
  gradient    text[] not null default '{#111827,#1f2937}',
  status      text not null default 'draft',    -- draft | published
  sort        integer not null default 0
);

-- ---------------------------------------------------------------------------
-- 4. plan_sections — a 5-chapter block within a plan. Reading 5/5 chapters of
--    a section unlocks that section's Bible Quiz.
-- ---------------------------------------------------------------------------
create table if not exists public.plan_sections (
  id          uuid primary key default gen_random_uuid(),
  plan_slug   text not null references public.reading_plans(slug) on delete cascade,
  title       text not null,
  book        text not null,                    -- e.g. 'Genesis'
  start_ch    integer not null,
  end_ch      integer not null,
  sort        integer not null default 0
);

-- ---------------------------------------------------------------------------
-- 5. Reading progress — ONE row per user per section. `completed_days` is the
--    array of chapters read within this 5-chapter block (e.g. [1,2,3,4,5]).
-- ---------------------------------------------------------------------------
create table if not exists public.user_reading_progress (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  plan_slug      text not null,
  section_id     uuid not null references public.plan_sections(id) on delete cascade,
  completed_days integer[] not null default '{}',
  updated_at     timestamptz not null default now(),
  unique (user_id, section_id)
);

-- ---------------------------------------------------------------------------
-- 6. Quiz logs — every played attempt for a section, per club. Boards at the
--    top-5 are derived from these. `club` is denormalised from the player's
--    immutable profile at log time so boards regroup correctly.
-- ---------------------------------------------------------------------------
create table if not exists public.quiz_logs (
  id             uuid primary key default gen_random_uuid(),
  club           text not null,                 -- denormalised club slug from profile
  section_id     uuid not null references public.plan_sections(id) on delete cascade,
  user_id        uuid not null references auth.users(id) on delete cascade,
  correct        integer not null,
  total          integer not null,
  score          integer not null,
  milliseconds   integer,
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 7. RLS — content/public tables are readable by everyone (the public site is
--    open) but only writable through the backend/admin service role. Per-user
--    tables (progress, quiz logs) are fully user-scoped.
-- ---------------------------------------------------------------------------
alter table public.clubs            enable row level security;
alter table public.reading_plans    enable row level security;
alter table public.plan_sections    enable row level security;
alter table public.user_reading_progress enable row level security;
alter table public.quiz_logs        enable row level security;

-- Everyone (incl. anonymous site visitors) can read club + plan content.
create policy "clubs are public"            on public.clubs            for select using (true);
create policy "plans are public"            on public.reading_plans    for select using (true);
create policy "sections are public"         on public.plan_sections    for select using (true);

-- Users read/write only their own rows. No user can touch profiles.club
-- (the club lock) through a plain client — admin uses the service role.
create policy "own progress select" on public.user_reading_progress for select using (auth.uid() = user_id);
create policy "own progress insert" on public.user_reading_progress for insert with check (auth.uid() = user_id);
create policy "own progress update" on public.user_reading_progress for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own quiz logs select" on public.quiz_logs for select using (auth.uid() = user_id);
create policy "own quiz logs insert" on public.quiz_logs for insert with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 8. Helper: admins look up a user's club through this (service-role only).
-- ---------------------------------------------------------------------------
create or replace function public.get_user_club(uid uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select club from public.profiles where id = uid
$$;
