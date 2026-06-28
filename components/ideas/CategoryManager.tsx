'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { IdeaCategory } from '@/lib/types'
import {
  createIdeaCategory,
  updateIdeaCategory,
  deleteIdeaCategory,
} from '@/lib/supabase'

interface CategoryManagerProps {
  categories: IdeaCategory[]
  onChange: () => void
  onClose: () => void
}

const PALETTE = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6']

export default function CategoryManager({ categories, onChange, onClose }: CategoryManagerProps) {
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(PALETTE[0])
  const [busy, setBusy] = useState(false)

  async function handleAdd() {
    if (!newName.trim()) return
    setBusy(true)
    try {
      await createIdeaCategory({ name: newName.trim(), color: newColor })
      setNewName('')
      onChange()
    } finally {
      setBusy(false)
    }
  }

  async function handleRename(c: IdeaCategory, name: string) {
    if (!name.trim() || name === c.name) return
    await updateIdeaCategory(c.id, { name: name.trim() })
    onChange()
  }

  async function handleDelete(id: string) {
    await deleteIdeaCategory(id)
    onChange()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestione categorie</h2>

        <div className="space-y-2 mb-6">
          {categories.length === 0 && (
            <p className="text-sm text-gray-400">Nessuna categoria ancora.</p>
          )}
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
              <input
                defaultValue={c.name}
                onBlur={(e) => handleRename(c, e.target.value)}
                className="flex-1 rounded-lg border border-gray-border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={() => handleDelete(c.id)}
                className="p-1 rounded-lg text-gray-400 hover:text-danger hover:bg-red-50 transition-colors"
                aria-label="Elimina categoria"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-border pt-4">
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Nuova categoria</label>
          <div className="flex items-center gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome categoria"
              className="flex-1 rounded-lg border border-gray-border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Button size="sm" onClick={handleAdd} disabled={busy || !newName.trim()}>Aggiungi</Button>
          </div>
          <div className="flex gap-2 mt-3">
            {PALETTE.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setNewColor(color)}
                className={`w-6 h-6 rounded-full transition-transform ${newColor === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
                style={{ backgroundColor: color }}
                aria-label={`Colore ${color}`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="secondary" onClick={onClose}>Chiudi</Button>
        </div>
      </div>
    </div>
  )
}
