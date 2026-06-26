-- Migration: stakeholder fields + actions table + new status values
-- Eseguire nel SQL Editor di Supabase

-- 0. Aggiorna il check constraint sullo status
alter table contacts drop constraint if exists contacts_status_check;
alter table contacts
  alter column status set default 'to_contact',
  add constraint contacts_status_check
    check (status in ('to_contact', 'contacted', 'involved', 'not_interested'));

-- 1. Nuovi campi sulla tabella contacts
alter table contacts
  add column if not exists first_name text,
  add column if not exists last_name  text,
  add column if not exists city       text,
  add column if not exists role       text,
  add column if not exists skills     text[] default '{}',
  add column if not exists entity     text,
  add column if not exists why_useful text;

-- 2. Tabella azioni
create table if not exists actions (
  id          uuid primary key default gen_random_uuid(),
  contact_id  uuid not null references contacts(id) on delete cascade,
  title       text not null,
  description text,
  done        boolean not null default false,
  done_at     timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists actions_contact_id_idx on actions (contact_id);
create index if not exists actions_created_at_idx on actions (created_at);

-- Trigger updated_at per actions (opzionale, ma coerente)
drop trigger if exists actions_contact_updated_at on actions;
create trigger actions_contact_updated_at
  after insert or update or delete on actions
  for each row execute function update_updated_at();

-- RLS per actions
alter table actions enable row level security;

drop policy if exists "Allow all access" on actions;
create policy "Allow all access"
  on actions for all
  to anon, authenticated
  using (true)
  with check (true);
