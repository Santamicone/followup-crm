'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import PriorityStars from '@/components/ui/PriorityStars'
import {
  Task,
  TaskStatus,
  TASK_STATUS_LABELS,
  TASK_ASSIGNEE_SUGGESTIONS,
} from '@/lib/types'

interface TaskFormProps {
  task?: Task
  onSave: (data: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
}

export default function TaskForm({ task, onSave, onCancel }: TaskFormProps) {
  const [description, setDescription] = useState(task?.description ?? '')
  const [assignee, setAssignee] = useState(task?.assignee ?? '')
  const [priority, setPriority] = useState(task?.priority ?? 3)
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'aperto')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) return
    setSaving(true)
    try {
      await onSave({ description: description.trim(), assignee, priority, status })
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
          {task ? 'Modifica task' : 'Nuovo task'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Descrizione *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoFocus
              rows={3}
              className="w-full rounded-xl border border-gray-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Responsabile</label>
              <input
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                list="assignee-suggestions"
                placeholder="Massimo, Marzia…"
                className="w-full rounded-xl border border-gray-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <datalist id="assignee-suggestions">
                {TASK_ASSIGNEE_SUGGESTIONS.map((a) => <option key={a} value={a} />)}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Stato</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full rounded-xl border border-gray-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {(Object.keys(TASK_STATUS_LABELS) as TaskStatus[]).map((s) => (
                  <option key={s} value={s}>{TASK_STATUS_LABELS[s]}</option>
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
          <Button type="submit" disabled={saving || !description.trim()}>
            {saving ? 'Salvataggio…' : 'Salva'}
          </Button>
        </div>
      </form>
    </div>
  )
}
