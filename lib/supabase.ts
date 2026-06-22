import { createClient } from '@supabase/supabase-js'
import { Contact } from './types'

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

export async function createContact(
  contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>
): Promise<Contact> {
  const { data, error } = await supabase
    .from('contacts')
    .insert(contact)
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
    .update(contact)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Contact
}

export async function archiveContact(id: string): Promise<Contact | null> {
  return updateContact(id, { status: 'archived' })
}
