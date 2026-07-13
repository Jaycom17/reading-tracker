# AGENTS.md — Reading Tracker (Retos de Lectura — Fase 1)

## Project Overview
Personal reading challenge tracker app (Phase 1: individual challenges only). Built with **Next.js + Supabase** for weekend development. Goal: track a personal reading goal (e.g., "12 books in 2026"), add books manually, mark them as "in progress" / "completed", see progress (X/12 + progress bar), and generate achievement images on completion. Phase 2 adds group reading communities.

**Target user:** Single user (you) — private data, email/password auth only, no social features yet.

---

## Phase 1 Scope (MVP — 5 features)

| # | Feature | Depends on |
|---|---------|------------|
| 1 | Create personal challenge (name, numeric goal, duration in weeks) | — |
| 2 | Add book to challenge (title, author, manual entry) | #1 |
| 3 | Mark book "in progress" / "completed" | #2 |
| 4 | View challenge progress (counter X/Y + progress bar) | #3 |
| 5 | Generate achievement image on book/ challenge completion | #3, #4 |

**Explicitly out of scope (Phase 1):**
- External book catalogs (Google Books, Open Library)
- Groups, discussions, social features (Phase 2)
- Password recovery, social login, notifications, gamification (beyond achievement image)
- Multi-user registration (single-user app)

---

## Success Criteria (Phase 1)
- You actively use at least one challenge for 4–6 consecutive weeks
- Adding books + marking them completed becomes a weekly habit
- If you stop logging progress after 2 weeks → something in the flow is broken

---

## Tech Stack
- **Frontend:** Next.js (App Router, TypeScript, Tailwind)
- **Backend/DB/Auth:** Supabase (Postgres + Auth + RLS)
- **Deploy:** Vercel (frontend) + Supabase (backend)
- **Auth:** Email/password only (Supabase Auth)

---

## Data Model (Phase 1)

```sql
-- Users: handled by Supabase Auth (auth.users)

create table challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  name text not null,
  goal integer not null check (goal > 0),
  duration_weeks integer not null check (duration_weeks > 0),
  created_at timestamptz default now()
);

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

-- RLS: users only see their own challenges & books
alter table challenges enable row level security;
alter table books enable row level security;

create policy "own challenges" on challenges
  for all using (auth.uid() = user_id);

create policy "own books" on books
  for all using (
    challenge_id in (select id from challenges where user_id = auth.uid())
  );
```

---

## Routes (App Router)

| Route | Description |
|-------|-------------|
| `/login` | Login / Register (email + password) |
| `/` | Dashboard: list of challenges + "Create challenge" button |
| `/challenges/new` | Create challenge form |
| `/challenges/[id]` | Challenge detail: list books, add book, mark progress, progress bar |
| `/challenges/[id]/books/new` | Add book form (title + author) |
| `/challenges/[id]/achievement` | Generate achievement image (book or challenge) |

---

## Key Flows

1. **Auth:** Email/password → Supabase Auth → session cookie → middleware protects all `/` routes
2. **Create challenge:** POST `/api/challenges` → insert row with `user_id = auth.uid()`
3. **Add book:** POST `/api/challenges/[id]/books` → insert with `status = 'in_progress'`
4. **Mark completed:** PATCH `/api/books/[id]` → set `status = 'completed', completed_at = now()`
5. **Progress:** GET `/api/challenges/[id]` → count completed books / goal → compute percentage
6. **Achievement image:** GET `/challenges/[id]/achievement?book_id=X` → generate PNG with book/challenge info

---

## Security Rules
- **RLS on all tables** — users only see their own data
- **No public registration** — only you create an account (disable Supabase public signups, or gate behind invite code)
- **Auth errors:** Generic "invalid credentials" (no email enumeration)
- **Validation:** Goal > 0, duration_weeks > 0, title+author required, status enum enforced

---

## Phase 2 Preview (not in scope yet)
| Module | Feature |
|--------|---------|
| Groups | Create group, invite members (no roles) |
| Assignment | Assign book + discussion start date to group |
| Discussion | Comment thread per book, opens on assigned date |
| History | Past books list for group |

---

## Agent Guidance

### When adding features:
1. Check if it's in **Phase 1 scope** (table above) — if not, it's Phase 2 or backlog
2. Follow **RLS pattern**: every table has `user_id` or links to owned resource
3. Use **Server Actions** or **Route Handlers** for mutations (not client-side Supabase)
4. Keep UI minimal: Tailwind, shadcn/ui components, server components by default

### Testing approach:
- Unit: Server Actions / API routes (Vitest)
- E2E: Playwright (login → create challenge → add book → complete → verify progress → generate achievement)
- No unit tests for UI components unless complex logic

### Commands (add to package.json scripts):
```json
{
  "dev": "next dev",
  "build": "next build",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "test": "vitest",
  "test:e2e": "playwright test"
}
```

---

## Key Files to Know
- `src/app/(auth)/login/page.tsx` — login/register
- `src/app/(app)/page.tsx` — dashboard (challenge list)
- `src/app/(app)/challenges/[id]/page.tsx` — challenge detail + progress
- `src/app/(app)/challenges/[id]/achievement/page.tsx` — achievement image generation
- `src/lib/supabase/server.ts` — Supabase server client (cookies)
- `src/lib/supabase/middleware.ts` — auth middleware
- `supabase/migrations/` — SQL migrations (RLS included)
- `middleware.ts` — route protection