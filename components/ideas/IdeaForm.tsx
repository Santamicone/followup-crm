'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import PriorityStars from '@/components/ui/PriorityStars'
import { Idea, IdeaCategory, IdeaStatus, IDEA_STATUS_LABELS } from '@/lib/types'

interface IdeaFormProps {
  idea?: Idea
  categories: IdeaCategory[]
  onSave: (data: Omit<Idea, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
}

export default function IdeaForm({ idea, categories, onSave, onCancel }: IdeaFormProps) {
  const [name, setName] = useState(idea?.name ?? '')
  const [notes, setNotes] = useState(idea?.notes ?? '')
  const [categoryId, setCategoryId] = useState(idea?.category_id ?? '')
  const [priority, setPriority] = useState(idea?.priority ?? 3)
  const [status, setStatus] = useState<IdeaStatus>(idea?.status ?? 'aperta')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await onSave({
        name: name.trim(),
        notes,
        category_id: categoryId || null,
        priority,
        status,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {idea ? 'Modifica idea' : 'Nuova idea'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Nome *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="w-full rounded-xl border border-gray-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Note</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-gray-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Categoria</label>
              <select
                value={categoryId ?? ''}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-gray-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">— Nessuna —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Stato</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as IdeaStatus)}
                className="w-full rounded-xl border border-gray-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {(Object.keys(IDEA_STATUS_LABELS) as IdeaStatus[]).map((s) => (
                  <option key={s} value={s}>{IDEA_STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Priorità</label>
            <PriorityStars value={priority} onChange={setPriority} />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={onCancel}>Annulla</Button>
          <Button type="submit" disabled={saving || !name.trim()}>
            {saving ? 'Salvataggio…' : 'Salva'}
          </Button>
        </div>
      </form>
    </div>
  )
}
