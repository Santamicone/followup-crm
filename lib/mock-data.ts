import { Contact } from './types'

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Giulia Ferretti',
    email: 'giulia.ferretti@example.com',
    phone: '+39 333 123 4567',
    company: 'Studio Ferretti Consulting',
    status: 'involved',
    notes: 'Contatto storico, coinvolto nel progetto.',
    next_action: 'Inviare aggiornamento',
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
    status: 'contacted',
    notes: 'Ha partecipato al webinar di maggio.',
    next_action: 'Chiamata di follow-up',
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
    status: 'to_contact',
    notes: 'Freelance, lavora su progetti editoriali.',
    next_action: 'Primo contatto',
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
    status: 'not_interested',
    notes: 'Contatto da LinkedIn. Non interessato al momento.',
    next_action: '',
    next_action_date: '',
    created_at: '2026-06-01T10:00:00Z',
    updated_at: '2026-06-18T12:45:00Z',
  },
]

let contacts = [...mockContacts]

export function getContacts(): Contact[] {
  return contacts
}

export function getContact(id: string): Contact | undefined {
  return contacts.find((c) => c.id === id)
}

export function createContact(data: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Contact {
  const now = new Date().toISOString()
  const newContact: Contact = { ...data, id: String(Date.now()), created_at: now, updated_at: now }
  contacts = [newContact, ...contacts]
  return newContact
}

export function updateContact(id: string, data: Partial<Omit<Contact, 'id' | 'created_at'>>): Contact | null {
  const idx = contacts.findIndex((c) => c.id === id)
  if (idx === -1) return null
  contacts[idx] = { ...contacts[idx], ...data, updated_at: new Date().toISOString() }
  return contacts[idx]
}
