'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Contact, ContactStatus, STATUS_LABELS } from '@/lib/types'
import { createContact, updateContact } from '@/lib/supabase'
import Button from '@/components/ui/Button'

const STATUSES: ContactStatus[] = ['active', 'lead', 'customer', 'archived']

interface ContactFormProps {
  contact?: Contact
}

export default function ContactForm({ contact }: ContactFormProps) {
  const router = useRouter()
  const isEdit = !!contact

  const [form, setForm] = useState({
    name: contact?.name ?? '',
    email: contact?.email ?? '',
    phone: contact?.phone ?? '',
    company: contact?.company ?? '',
    status: (contact?.status ?? 'active') as ContactStatus,
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
    if (!form.name.trim()) {
      setError('Il nome è obbligatorio.')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (isEdit) {
        await updateContact(contact.id, form)
        router.push(`/contacts/${contact.id}`)
      } else {
        const created = await createContact(form)
        router.push(`/contacts/${created.id}`)
      }
    } catch {
      setError('Errore nel salvataggio. Riprova.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Informazioni di base</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Mario Rossi"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="mario@esempio.it"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="+39 333 000 0000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Azienda</label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => set('company', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Acme srl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Follow-up</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prossima azione</label>
          <input
            type="text"
            value={form.next_action}
            onChange={(e) => set('next_action', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Es. Inviare proposta commerciale"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data scadenza</label>
          <input
            type="date"
            value={form.next_action_date}
            onChange={(e) => set('next_action_date', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Note</h2>
        <textarea
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Annotazioni libere sul contatto..."
        />
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
