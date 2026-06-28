import { createClient } from '@supabase/supabase-js'
import { Contact, Action, Idea, IdeaCategory, Task } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getContacts(): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Contact[]
}

export async function getContact(id: string): Promise<Contact | undefined> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return undefined
  return data as Contact
}

function sanitize<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === '' ? null : v])
  ) as T
}

export async function createContact(
  contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>
): Promise<Contact> {
  const { data, error } = await supabase
    .from('contacts')
    .insert(sanitize(contact as Record<string, unknown>))
    .select()
    .single()
  if (error) throw error
  return data as Contact
}

export async function updateContact(
  id: string,
  contact: Partial<Omit<Contact, 'id' | 'created_at'>>
): Promise<Contact | null> {
  const { data, error } = await supabase
    .from('contacts')
    .update(sanitize(contact as Record<string, unknown>))
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Contact
}

export async function archiveContact(id: string): Promise<Contact | null> {
  return updateContact(id, { status: 'not_interested' })
}

export async function deleteContact(id: string): Promise<void> {
  const { error } = await supabase.from('contacts').delete().eq('id', id)
  if (error) throw error
}

// Actions
export async function getActions(contactId: string): Promise<Action[]> {
  const { data, error } = await supabase
    .from('actions')
    .select('*')
    .eq('contact_id', contactId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Action[]
}

export async function createAction(
  action: Omit<Action, 'id' | 'created_at'>
): Promise<Action> {
  const { data, error } = await supabase
    .from('actions')
    .insert(sanitize(action as Record<string, unknown>))
    .select()
    .single()
  if (error) throw error
  return data as Action
}

export async function toggleAction(id: string, done: boolean): Promise<Action | null> {
  const { data, error } = await supabase
    .from('actions')
    .update({ done, done_at: done ? new Date().toISOString() : null })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Action
}

export async function deleteAction(id: string): Promise<void> {
  const { error } = await supabase.from('actions').delete().eq('id', id)
  if (error) throw error
}

// ===== Categorie idee =====
export async function getIdeaCategories(): Promise<IdeaCategory[]> {
  const { data, error } = await supabase
    .from('idea_categories')
    .select('*')
    .order('name', { ascending: true })
  if (error) throw error
  return data as IdeaCategory[]
}

export async function createIdeaCategory(
  category: Omit<IdeaCategory, 'id' | 'created_at'>
): Promise<IdeaCategory> {
  const { data, error } = await supabase
    .from('idea_categories')
    .insert(sanitize(category as Record<string, unknown>))
    .select()
    .single()
  if (error) throw error
  return data as IdeaCategory
}

export async function updateIdeaCategory(
  id: string,
  category: Partial<Omit<IdeaCategory, 'id' | 'created_at'>>
): Promise<IdeaCategory> {
  const { data, error } = await supabase
    .from('idea_categories')
    .update(sanitize(category as Record<string, unknown>))
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as IdeaCategory
}

export async function deleteIdeaCategory(id: string): Promise<void> {
  const { error } = await supabase.from('idea_categories').delete().eq('id', id)
  if (error) throw error
}

// ===== Idee =====
export async function getIdeas(): Promise<Idea[]> {
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Idea[]
}

export async function createIdea(
  idea: Omit<Idea, 'id' | 'created_at' | 'updated_at'>
): Promise<Idea> {
  const { data, error } = await supabase
    .from('ideas')
    .insert(sanitize(idea as Record<string, unknown>))
    .select()
    .single()
  if (error) throw error
  return data as Idea
}

export async function updateIdea(
  id: string,
  idea: Partial<Omit<Idea, 'id' | 'created_at'>>
): Promise<Idea> {
  const { data, error } = await supabase
    .from('ideas')
    .update(sanitize(idea as Record<string, unknown>))
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Idea
}

export async function deleteIdea(id: string): Promise<void> {
  const { error } = await supabase.from('ideas').delete().eq('id', id)
  if (error) throw error
}

// ===== Task =====
export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Task[]
}

export async function createTask(
  task: Omit<Task, 'id' | 'created_at' | 'updated_at'>
): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert(sanitize(task as Record<string, unknown>))
    .select()
    .single()
  if (error) throw error
  return data as Task
}

export async function updateTask(
  id: string,
  task: Partial<Omit<Task, 'id' | 'created_at'>>
): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update(sanitize(task as Record<string, unknown>))
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Task
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}
