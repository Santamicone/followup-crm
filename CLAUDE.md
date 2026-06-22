# FollowUp CRM — Contesto per Claude

## Cos'è questo progetto

Mini CRM Next.js per professionisti. Stack: Next.js 15 (App Router), TypeScript, Tailwind CSS 4, Supabase (fase 2).

## Stato corrente

**Fase 1 completa** — tutti i dati vengono da `lib/mock-data.ts` (store in-memory, si resetta al refresh).
**Fase 2 pronta** — il codice Supabase è in `lib/supabase.ts` (tutto commentato, pronto all'attivazione).

## Convenzioni

- Componenti Server dove possibile; `'use client'` solo dove serve interattività
- Tipi condivisi in `lib/types.ts` — non duplicarli
- Nessun commento "ovvio"; commenta solo il WHY non evidente
- Tailwind puro, nessuna libreria UI di terze parti
- Nomi italiani nelle label/UI, nomi inglesi nel codice

## Struttura chiave

```
lib/types.ts          → ContactStatus, Contact, STATUS_LABELS, STATUS_COLORS
lib/mock-data.ts      → getContacts, getContact, createContact, updateContact, archiveContact
lib/supabase.ts       → stesso contratto di mock-data (commentato)
components/ui/        → Badge, Button, Modal — componenti atomici riutilizzabili
components/layout/    → Sidebar, Header
components/dashboard/ → StatCard, FollowUpList
components/contacts/  → ContactCard, ContactForm, ContactFilters
```

## Come passare a Supabase (fase 2)

1. Decommenta `lib/supabase.ts`
2. Sostituisci tutti gli import `from '@/lib/mock-data'` con `from '@/lib/supabase'`
3. Le funzioni hanno lo stesso nome e firma — nessun'altra modifica necessaria
4. Aggiungi `.env.local` con `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. `npm install @supabase/supabase-js`

## Schema Supabase

Vedi `supabase/schema.sql` per la definizione completa della tabella `contacts` con RLS.
