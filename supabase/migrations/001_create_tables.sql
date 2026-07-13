-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table is handled by Supabase Auth (auth.users)

-- Challenges table
create table challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  name text not null,
  goal integer not null check (goal > 0),
  duration_weeks integer not null check (duration_weeks > 0),
  created_at timestamptz default now()
);

-- Books table
create table books (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references challenges(id) on delete cascade not null,
  title text not null,
  author text not null,
  status text not null default 'por_leer' check (status in ('por_leer', 'en_progreso', 'completado')),
  notes text default '',
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- Enable RLS
alter table challenges enable row level security;
alter table books enable row level security;

-- RLS Policies for challenges
create policy "own challenges" on challenges
  for all using (auth.uid() = user_id);

-- RLS Policies for books
create policy "own books" on books
  for all using (
    challenge_id in (select id from challenges where user_id = auth.uid())
  );

-- Indexes for performance
create index idx_challenges_user_id on challenges(user_id);
create index idx_books_challenge_id on books(challenge_id);
create index idx_books_status on books(status);