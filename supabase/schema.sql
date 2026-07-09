-- Flex — Supabase schema. Paste this whole file into
-- Supabase Dashboard → SQL Editor → New query → Run.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  flex_name text not null default 'Flex',
  flex_color text not null default '#ffcf5a',
  wakeup_time text not null default '06:30',
  created_at timestamptz not null default now()
);
alter table profiles enable row level security;
create policy "profiles are publicly readable" on profiles for select using (true);
create policy "users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "users can update own profile" on profiles for update using (auth.uid() = id);
create policy "users can delete own profile" on profiles for delete using (auth.uid() = id);

create table if not exists challenges (
  id uuid primary key default gen_random_uuid(),
  starts_on date not null,
  ends_on date not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);
alter table challenges enable row level security;
create policy "challenges are publicly readable" on challenges for select using (true);
create policy "authenticated users can start a challenge" on challenges for insert with check (auth.role() = 'authenticated');

create table if not exists participants (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references challenges(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (challenge_id, user_id)
);
alter table participants enable row level security;
create policy "participants are publicly readable" on participants for select using (true);
create policy "users can join as themselves" on participants for insert with check (auth.uid() = user_id);
create policy "users can leave their own participation" on participants for delete using (auth.uid() = user_id);

create table if not exists checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_id uuid not null references challenges(id) on delete cascade,
  date date not null,
  steps boolean not null default false,
  wake boolean not null default false,
  workout boolean not null default false,
  water_halves int not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);
alter table checkins enable row level security;
create policy "checkins are publicly readable" on checkins for select using (true);
create policy "users can insert own checkins" on checkins for insert with check (auth.uid() = user_id);
create policy "users can update own checkins" on checkins for update using (auth.uid() = user_id);
create policy "users can delete own checkins" on checkins for delete using (auth.uid() = user_id);
