import { createClient } from '@supabase/supabase-js'
import { Contact, Action } from './types'

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
