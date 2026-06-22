import { Contact } from './types'

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Giulia Ferretti',
    email: 'giulia.ferretti@example.com',
    phone: '+39 333 123 4567',
    company: 'Studio Ferretti Consulting',
    status: 'customer',
    notes: 'Cliente storica, contratto annuale rinnovato a gennaio. Molto soddisfatta del servizio.',
    next_action: 'Inviare proposta rinnovo per il prossimo anno',
    next_action_date: '2026-06-25',
    created_at: '2025-01-10T09:00:00Z',
    updated_at: '2026-06-01T14:30:00Z',
  },
  {
    id: '2',
    name: 'Marco Santini',
    email: 'marco.santini@techstart.it',
    phone: '+39 347 987 6543',
    company: 'TechStart srl',
    status: 'lead',
    notes: 'Ha partecipato al webinar di maggio. Interessato al piano Pro.',
    next_action: 'Chiamata di qualifica',
    next_action_date: '2026-06-23',
    created_at: '2026-05-20T11:00:00Z',
    updated_at: '2026-06-10T09:15:00Z',
  },
  {
    id: '3',
    name: 'Chiara Mancini',
    email: 'chiara@mancinidesign.com',
    phone: '+39 320 555 0011',
    company: 'Mancini Design',
    status: 'active',
    notes: 'Freelance, lavora soprattutto su progetti editoriali.',
    next_action: 'Follow-up dopo proposta inviata',
    next_action_date: '2026-06-28',
    created_at: '2026-03-05T08:30:00Z',
    updated_at: '2026-06-15T16:00:00Z',
  },
  {
    id: '4',
    name: 'Roberto Esposito',
    email: 'roberto.esposito@gmail.com',
    phone: '+39 392 000 1122',
    company: '',
    status: 'lead',
    notes: 'Contatto da LinkedIn. Imprenditore settore ristorazione.',
    next_action: 'Inviare presentazione prodotto',
    next_action_date: '2026-06-22',
    created_at: '2026-06-01T10:00:00Z',
    updated_at: '2026-06-18T12:45:00Z',
  },
  {
    id: '5',
    name: 'Alessandra Vitale',
    email: 'a.vitale@studiocreativo.it',
    phone: '+39 329 444 7788',
    company: 'Studio Creativo srl',
    status: 'customer',
    notes: 'Cliente dal 2024. Acquisto licenze multiple per il team.',
    next_action: 'Verifica soddisfazione trimestrale',
    next_action_date: '2026-07-01',
    created_at: '2024-09-12T13:00:00Z',
    updated_at: '2026-06-05T11:00:00Z',
  },
  {
    id: '6',
    name: 'Luca Bianchi',
    email: 'luca.bianchi@vecchiofornitore.com',
    phone: '+39 333 000 9999',
    company: 'Vecchio Fornitore srl',
    status: 'archived',
    notes: 'Contratto non rinnovato a dicembre. Possibile ritorno a Q3 2026.',
    next_action: '',
    next_action_date: '',
    created_at: '2023-06-20T09:00:00Z',
    updated_at: '2025-12-31T17:00:00Z',
  },
  {
    id: '7',
    name: 'Francesca Colombo',
    email: 'f.colombo@innovazione.net',
    phone: '+39 347 222 3344',
    company: 'Innovazione spa',
    status: 'active',
    notes: 'In fase di valutazione interna. Ha richiesto referenze.',
    next_action: 'Inviare case study e referenze',
    next_action_date: '2026-06-24',
    created_at: '2026-05-30T14:00:00Z',
    updated_at: '2026-06-20T10:30:00Z',
  },
]

// Simula un piccolo store in-memory per le operazioni CRUD
let contacts = [...mockContacts]

export function getContacts(): Contact[] {
  return contacts
}

export function getContact(id: string): Contact | undefined {
  return contacts.find((c) => c.id === id)
}

export function createContact(data: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Contact {
  const now = new Date().toISOString()
  const newContact: Contact = {
    ...data,
    id: String(Date.now()),
    created_at: now,
    updated_at: now,
  }
  contacts = [newContact, ...contacts]
  return newContact
}

export function updateContact(id: string, data: Partial<Omit<Contact, 'id' | 'created_at'>>): Contact | null {
  const idx = contacts.findIndex((c) => c.id === id)
  if (idx === -1) return null
  contacts[idx] = { ...contacts[idx], ...data, updated_at: new Date().toISOString() }
  return contacts[idx]
}

export function archiveContact(id: string): Contact | null {
  return updateContact(id, { status: 'archived' })
}
