'use client'

import { useState } from 'react'
import { Action } from '@/lib/types'
import { createAction, toggleAction, deleteAction } from '@/lib/supabase'
import Button from '@/components/ui/Button'

interface ActionsPanelProps {
  contactId: string
  initial: Action[]
}

export default function ActionsPanel({ contactId, initial }: ActionsPanelProps) {
  const [actions, setActions] = useState<Action[]>(initial)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })

  async function handleAdd() {
    if (!title.trim()) return
    setSaving(true)
    try {
      const action = await createAction({ contact_id: contactId, title, description, done: false })
      setActions([action, ...actions])
      setTitle('')
      setDescription('')
      setAdding(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(id: string, done: boolean) {
    const updated = await toggleAction(id, done)
    if (updated) setActions(actions.map((a) => (a.id === id ? updated : a)))
  }

  async function handleDelete(id: string) {
    await deleteAction(id)
    setActions(actions.filter((a) => a.id !== id))
  }

  const pending = actions.filter((a) => !a.done)
  const done = actions.filter((a) => a.done)

  return (
    <div className="bg-surface-card rounded-[24px] card-shadow border border-gray-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
          Azioni ({actions.length})
        </h3>
        <button
          onClick={() => setAdding((v) => !v)}
          className="text-xs font-semibold text-primary hover:underline"
        >
          {adding ? 'Annulla' : '+ Nuova azione'}
        </button>
      </div>

      {adding && (
        <div className="bg-surface-container rounded-xl p-4 space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titolo azione *"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrizione (opzionale)"
            rows={2}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <Button size="sm" onClick={handleAdd} disabled={saving || !title.trim()}>
            {saving ? 'Salvataggio…' : 'Aggiungi'}
          </Button>
        </div>
      )}

      {actions.length === 0 && !adding && (
        <p className="text-sm text-on-surface-variant">Nessuna azione registrata.</p>
      )}

      {pending.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Da fare</p>
          {pending.map((a) => (
            <ActionRow key={a.id} action={a} onToggle={handleToggle} onDelete={handleDelete} formatDate={formatDate} />
          ))}
        </div>
      )}

      {done.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mt-2">Completate</p>
          {done.map((a) => (
            <ActionRow key={a.id} action={a} onToggle={handleToggle} onDelete={handleDelete} formatDate={formatDate} />
          ))}
        </div>
      )}
    </div>
  )
}

function ActionRow({
  action,
  onToggle,
  onDelete,
  formatDate,
}: {
  action: Action
  onToggle: (id: string, done: boolean) => void
  onDelete: (id: string) => void
  formatDate: (d: string) => string
}) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${action.done ? 'border-gray-100 bg-gray-50 opacity-70' : 'border-gray-200 bg-white'}`}>
      <input
        type="checkbox"
        checked={action.done}
        onChange={(e) => onToggle(action.id, e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded text-indigo-600 cursor-pointer shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${action.done ? 'line-through text-gray-400' : 'text-on-surface'}`}>
          {action.title}
        </p>
        {action.description && (
          <p className="text-xs text-on-surface-variant mt-0.5 whitespace-pre-wrap">{action.description}</p>
        )}
        <p className="text-xs text-on-surface-variant mt-1">
          {action.done && action.done_at
            ? `Completata il ${formatDate(action.done_at)}`
            : `Aggiunta il ${formatDate(action.created_at)}`}
        </p>
      </div>
      <button
        onClick={() => onDelete(action.id)}
        className="text-gray-300 hover:text-red-500 transition-colors shrink-0 mt-0.5"
        title="Elimina azione"
      >
        <span className="material-symbols-outlined text-[18px]">delete</span>
      </button>
    </div>
  )
}
