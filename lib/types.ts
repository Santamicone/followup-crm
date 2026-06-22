export type ContactStatus = 'active' | 'archived' | 'lead' | 'customer'

export interface Contact {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  status: ContactStatus
  notes?: string
  next_action?: string
  next_action_date?: string
  created_at: string
  updated_at: string
}

export const STATUS_LABELS: Record<ContactStatus, string> = {
  active: 'Attivo',
  archived: 'Archiviato',
  lead: 'Lead',
  customer: 'Cliente',
}

export const STATUS_COLORS: Record<ContactStatus, string> = {
  active: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-600',
  lead: 'bg-blue-100 text-blue-800',
  customer: 'bg-purple-100 text-purple-800',
}
