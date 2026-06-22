# FollowUp CRM

Mini CRM per professionisti e piccoli imprenditori. Gestisci contatti, opportunità commerciali e prossime azioni.

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Supabase** (fase 2)

## Avvio rapido

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Struttura

```
app/
  page.tsx                  # Dashboard
  contacts/
    page.tsx                # Lista contatti
    new/page.tsx            # Nuovo contatto
    [id]/page.tsx           # Dettaglio contatto
    [id]/edit/page.tsx      # Modifica contatto
components/
  layout/                   # Sidebar, Header
  dashboard/                # StatCard, FollowUpList
  contacts/                 # ContactCard, ContactForm, ContactFilters
  ui/                       # Badge, Button, Modal
lib/
  types.ts                  # Tipi TypeScript
  mock-data.ts              # Store in-memory (fase 1)
  supabase.ts               # Client Supabase (fase 2, commentato)
```

## Funzionalità

- Dashboard con statistiche e follow-up imminenti
- Lista contatti con filtri per stato (Attivo, Lead, Cliente, Archiviato) e ricerca testuale
- Creazione e modifica contatti
- Dettaglio contatto con prossima azione
- Archiviazione contatto con conferma modale

## Fase 2 — Connessione Supabase

1. Crea un progetto su [supabase.com](https://supabase.com)
2. Esegui lo schema SQL in `supabase/schema.sql`
3. Crea `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
4. Installa il client: `npm install @supabase/supabase-js`
5. Decommenta il codice in `lib/supabase.ts`
6. Sostituisci gli import di `mock-data` con `supabase` nelle pagine
