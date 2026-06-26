'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Contact, ContactStatus, STATUS_LABELS } from '@/lib/types'
import { createContact, updateContact } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import TagInput from '@/components/ui/TagInput'

const STATUSES: ContactStatus[] = ['to_contact', 'contacted', 'involved', 'not_interested']

interface ContactFormProps {
  contact?: Contact
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && ' *'}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'

export default function ContactForm({ contact }: ContactFormProps) {
  const router = useRouter()
  const isEdit = !!contact

  const [tags, setTags] = useState<string[]>(contact?.tags ?? [])
  const [skills, setSkills] = useState<string[]>(contact?.skills ?? [])
  const [form, setForm] = useState({
    first_name: contact?.first_name ?? '',
    last_name: contact?.last_name ?? '',
    email: contact?.email ?? '',
    phone: contact?.phone ?? '',
    city: contact?.city ?? '',
    role: contact?.role ?? '',
    entity: contact?.entity ?? '',
    why_useful: contact?.why_useful ?? '',
    company: contact?.company ?? '',
    status: (contact?.status ?? 'to_contact') as ContactStatus,
    notes: contact?.notes ?? '',
    next_action: contact?.next_action ?? '',
    next_action_date: contact?.next_action_date ?? '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.first_name.trim() && !form.last_name.trim()) {
      setError('Inserisci almeno nome o cognome.')
      return
    }
    setSaving(true)
    setError('')
    const name = [form.first_name, form.last_name].filter(Boolean).join(' ')
    try {
      if (isEdit) {
        await updateContact(contact.id, { ...form, name, tags, skills })
        router.push(`/contacts/${contact.id}`)
      } else {
        const created = await createContact({ ...form, name, tags, skills })
        router.push(`/contacts/${created.id}`)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err)
      setError(`Errore: ${msg}`)
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      {/* Anagrafica */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Anagrafica</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nome" required>
            <input type="text" value={form.first_name} onChange={(e) => set('first_name', e.target.value)}
              className={inputCls} placeholder="Mario" />
          </Field>
          <Field label="Cognome">
            <input type="text" value={form.last_name} onChange={(e) => set('last_name', e.target.value)}
              className={inputCls} placeholder="Rossi" />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email">
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
              className={inputCls} placeholder="mario@esempio.it" />
          </Field>
          <Field label="Telefono">
            <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)}
              className={inputCls} placeholder="+39 333 000 0000" />
          </Field>
        </div>

        <Field label="Città">
          <input type="text" value={form.city} onChange={(e) => set('city', e.target.value)}
            className={inputCls} placeholder="Milano" />
        </Field>
      </div>

      {/* Profilo */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Profilo</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Ruolo">
            <input type="text" value={form.role} onChange={(e) => set('role', e.target.value)}
              className={inputCls} placeholder="Direttore Marketing" />
          </Field>
          <Field label="Entità di riferimento">
            <input type="text" value={form.entity} onChange={(e) => set('entity', e.target.value)}
              className={inputCls} placeholder="Azienda / Squadra / Gruppo" />
          </Field>
        </div>

        <Field label="Azienda">
          <input type="text" value={form.company} onChange={(e) => set('company', e.target.value)}
            className={inputCls} placeholder="Acme srl" />
        </Field>

        <Field label="Competenze">
          <TagInput tags={skills} onChange={setSkills} />
        </Field>

        <Field label="Perché può essere utile">
          <textarea value={form.why_useful} onChange={(e) => set('why_useful', e.target.value)}
            rows={3} className={`${inputCls} resize-none`}
            placeholder="Es. Ha esperienza nel settore X, conosce i decision maker di Y…" />
        </Field>
      </div>

      {/* Stato */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Stato</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Stato">
            <select value={form.status} onChange={(e) => set('status', e.target.value)}
              className={`${inputCls} bg-white`}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </Field>
        </div>
        <TagInput tags={tags} onChange={setTags} />
      </div>

      {/* Follow-up */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Prossima azione</h2>
        <Field label="Descrizione azione">
          <input type="text" value={form.next_action} onChange={(e) => set('next_action', e.target.value)}
            className={inputCls} placeholder="Es. Inviare proposta, fissare call…" />
        </Field>
        <Field label="Data scadenza">
          <input type="date" value={form.next_action_date} onChange={(e) => set('next_action_date', e.target.value)}
            className={inputCls} />
        </Field>
      </div>

      {/* Note */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Note</h2>
        <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)}
          rows={4} className={`${inputCls} resize-none`}
          placeholder="Annotazioni libere…" />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Salvataggio…' : isEdit ? 'Salva modifiche' : 'Crea contatto'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()} disabled={saving}>
          Annulla
        </Button>
      </div>
    </form>
  )
}
