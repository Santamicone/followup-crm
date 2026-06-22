-- FollowUp CRM — Schema Supabase
-- Eseguire nel SQL Editor del progetto Supabase

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  company text,
  status text not null default 'active'
    check (status in ('active', 'archived', 'lead', 'customer')),
  notes text,
  next_action text,
  next_action_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Aggiornamento automatico del campo updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists contacts_updated_at on contacts;
create trigger contacts_updated_at
  before update on contacts
  for each row execute function update_updated_at();

-- Row Level Security
alter table contacts enable row level security;

-- Policy: accesso anon e authenticated (MVP senza login)
drop policy if exists "Authenticated users can manage contacts" on contacts;
create policy "Allow all access"
  on contacts for all
  to anon, authenticated
  using (true)
  with check (true);

-- Indici utili
create index if not exists contacts_status_idx on contacts (status);
create index if not exists contacts_next_action_date_idx on contacts (next_action_date);
