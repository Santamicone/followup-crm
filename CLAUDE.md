# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandi principali

```bash
npm run dev      # avvia dev server su localhost:3000
npm run build    # build di produzione (rileva errori TypeScript)
npm run lint     # ESLint
```

Non ci sono test automatici. La verifica si fa con `npm run build` (TypeScript + Next.js) e manualmente nel browser.

## Architettura

Next.js 15 App Router, TypeScript, Tailwind CSS 4, Supabase come database.

**Fonte dati:** `lib/supabase.ts` espone le funzioni CRUD (`getContacts`, `getContact`, `createContact`, `updateContact`, `archiveContact`). Tutte sono async. Il file `lib/mock-data.ts` esiste come fallback in-memory ma non è più usato in produzione.

**Pattern pagine:**
- Pagine senza interattività → Server Component async (es. `app/page.tsx`)
- Pagine con stato locale (filtri, form) → `'use client'` + `useEffect` per il fetch (es. `app/contacts/page.tsx`)

**Tipo centrale:** `Contact` in `lib/types.ts`. `ContactStatus` è un union type `'active' | 'lead' | 'customer' | 'archived'`. Non duplicare i tipi altrove.

**Sanitizzazione:** la funzione `sanitize()` in `lib/supabase.ts` converte le stringhe vuote in `null` prima di ogni insert/update — necessario perché i campi opzionali (es. `next_action_date`) arrivano dal form come `""` ma Supabase si aspetta `null` per i tipi date.

## Convenzioni

- Tailwind puro, nessuna libreria UI di terze parti
- Label e testi UI in italiano, nomi di variabili e funzioni in inglese
- `'use client'` solo dove strettamente necessario (interattività o hook)
- Componenti atomici riutilizzabili in `components/ui/` (Badge, Button, Modal)

## Supabase

Schema in `supabase/schema.sql`. La RLS è abilitata con policy aperta a `anon` e `authenticated` (MVP senza autenticazione). Se si aggiunge Supabase Auth in futuro, restringere la policy per isolare i dati per utente.

Variabili d'ambiente richieste in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Deploy

- **Repo:** https://github.com/Santamicone/followup-crm
- **Produzione:** https://followup-crm-phi.vercel.app (Vercel, deploy automatico su push a `master`)
- Le variabili d'ambiente vanno configurate anche in Vercel → Settings → Environment Variables
