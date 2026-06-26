export type ContactStatus = 'to_contact' | 'contacted' | 'involved' | 'not_interested'

export interface Contact {
  id: string
  name: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  city?: string
  role?: string
  skills?: string[]
  entity?: string
  why_useful?: string
  company?: string
  status: ContactStatus
  tags?: string[]
  notes?: string
  next_action?: string
  next_action_date?: string
  created_at: string
  updated_at: string
}

export interface Action {
  id: string
  contact_id: string
  title: string
  description?: string
  done: boolean
  done_at?: string
  created_at: string
}

export const STATUS_LABELS: Record<ContactStatus, string> = {
  to_contact: 'Da contattare',
  contacted: 'Contattato',
  involved: 'Coinvolto',
  not_interested: 'Non interessato',
}

export const STATUS_COLORS: Record<ContactStatus, string> = {
  to_contact: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  involved: 'bg-green-100 text-green-800',
  not_interested: 'bg-gray-100 text-gray-500',
}
