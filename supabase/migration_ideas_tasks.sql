-- FollowUp CRM — Migration: Lavagna Idee + Bacheca Task
-- Eseguire nel SQL Editor del progetto Supabase

-- =========================================================
-- IDEE
-- =========================================================

-- Categorie idee (gestibili dall'utente)
create table if not exists idea_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null default '#6366f1',
  created_at timestamptz not null default now()
);

create table if not exists ideas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  notes text,
  category_id uuid references idea_categories (id) on delete set null,
  priority int not null default 3 check (priority between 1 and 5),
  status text not null default 'aperta'
    check (status in ('aperta', 'in_valutazione', 'archiviata')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- TASK
-- =========================================================

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  assignee text,
  priority int not null default 3 check (priority between 1 and 5),
  status text not null default 'aperto'
    check (status in ('aperto', 'in_lavorazione', 'completato')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- Trigger updated_at (riusa la funzione update_updated_at già creata in schema.sql)
-- =========================================================

drop trigger if exists ideas_updated_at on ideas;
create trigger ideas_updated_at
  before update on ideas
  for each row execute function update_updated_at();

drop trigger if exists tasks_updated_at on tasks;
create trigger tasks_updated_at
  before update on tasks
  for each row execute function update_updated_at();

-- =========================================================
-- Row Level Security (policy aperta come per contacts, MVP senza login)
-- =========================================================

alter table idea_categories enable row level security;
alter table ideas enable row level security;
alter table tasks enable row level security;

drop policy if exists "Allow all access" on idea_categories;
create policy "Allow all access" on idea_categories for all
  to anon, authenticated using (true) with check (true);

drop policy if exists "Allow all access" on ideas;
create policy "Allow all access" on ideas for all
  to anon, authenticated using (true) with check (true);

drop policy if exists "Allow all access" on tasks;
create policy "Allow all access" on tasks for all
  to anon, authenticated using (true) with check (true);

-- =========================================================
-- Indici utili
-- =========================================================

create index if not exists ideas_category_idx on ideas (category_id);
create index if not exists ideas_status_idx on ideas (status);
create index if not exists tasks_status_idx on tasks (status);
create index if not exists tasks_assignee_idx on tasks (assignee);
