create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "user own profile" on profiles
  for all using (id = auth.uid());

create policy "public profiles readable" on profiles
  for select using (true);

create table communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  creator_id uuid references auth.users(id) not null,
  access_code text unique not null,
  created_at timestamptz default now()
);

create table community_members (
  id uuid primary key default gen_random_uuid(),
  community_id uuid references communities(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  role text not null default 'member' check (role in ('creator', 'member')),
  joined_at timestamptz default now(),
  unique(community_id, user_id)
);

create table community_books (
  id uuid primary key default gen_random_uuid(),
  community_id uuid references communities(id) on delete cascade not null,
  title text not null,
  author text not null,
  status text not null default 'asignado' check (status in ('asignado')),
  discussion_start_date date,
  created_at timestamptz default now()
);

create table community_comments (
  id uuid primary key default gen_random_uuid(),
  community_book_id uuid references community_books(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  content text not null,
  parent_id uuid references community_comments(id) on delete cascade,
  created_at timestamptz default now()
);

create index idx_communities_creator on communities(creator_id);
create index idx_communities_access_code on communities(access_code);
create index idx_community_members_user on community_members(user_id);
create index idx_community_members_community on community_members(community_id);
create index idx_community_books_community on community_books(community_id);
create index idx_community_comments_book on community_comments(community_book_id);

alter table communities enable row level security;
alter table community_members enable row level security;
alter table community_books enable row level security;
alter table community_comments enable row level security;

-- ============================================================
-- communities: cualquier usuario autenticado puede buscar por código
-- (la verificación de membresía se hace en server actions)
-- ============================================================
create policy "creator manage communities" on communities
  for all using (creator_id = auth.uid());

create policy "find community by access code" on communities
  for select using (true);

-- ============================================================
-- community_members: usuario gestiona su propia membresía
-- ============================================================
create policy "user join community" on community_members
  for insert with check (user_id = auth.uid());

create policy "user leave community" on community_members
  for delete using (user_id = auth.uid());

create policy "member view membership" on community_members
  for select using (
    user_id = auth.uid()
    or community_id in (select id from communities where creator_id = auth.uid())
  );

create policy "creator manage members" on community_members
  for all using (
    community_id in (select id from communities where creator_id = auth.uid())
  );

-- ============================================================
-- community_books: solo el creador puede insertar
-- ============================================================
create policy "creator manage books" on community_books
  for insert with check (
    community_id in (select id from communities where creator_id = auth.uid())
  );

-- ============================================================
-- community_comments: solo el creador puede insertar (membresía se verifica en server actions)
-- ============================================================
create policy "member insert comments" on community_comments
  for insert with check (user_id = auth.uid());
