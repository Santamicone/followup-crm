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

// ===== Lavagna Idee =====
export type IdeaStatus = 'aperta' | 'in_valutazione' | 'archiviata'

export interface IdeaCategory {
  id: string
  name: string
  color: string
  created_at: string
}

export interface Idea {
  id: string
  name: string
  notes?: string
  category_id?: string | null
  priority: number // 1-5
  status: IdeaStatus
  created_at: string
  updated_at: string
}

export const IDEA_STATUS_LABELS: Record<IdeaStatus, string> = {
  aperta: 'Aperta',
  in_valutazione: 'In valutazione',
  archiviata: 'Archiviata',
}

export const IDEA_STATUS_COLORS: Record<IdeaStatus, string> = {
  aperta: 'bg-blue-100 text-blue-700',
  in_valutazione: 'bg-yellow-100 text-yellow-700',
  archiviata: 'bg-gray-100 text-gray-500',
}

// ===== Bacheca Task =====
export type TaskStatus = 'aperto' | 'in_lavorazione' | 'completato'

export interface Task {
  id: string
  description: string
  assignee?: string
  priority: number // 1-5
  status: TaskStatus
  created_at: string
  updated_at: string
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  aperto: 'Aperto',
  in_lavorazione: 'In lavorazione',
  completato: 'Completato',
}

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  aperto: 'bg-blue-100 text-blue-700',
  in_lavorazione: 'bg-yellow-100 text-yellow-700',
  completato: 'bg-green-100 text-green-700',
}

export const TASK_ASSIGNEE_SUGGESTIONS = ['Massimo', 'Marzia']
