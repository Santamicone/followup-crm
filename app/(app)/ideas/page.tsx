'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import IdeaCard from '@/components/ideas/IdeaCard'
import IdeaForm from '@/components/ideas/IdeaForm'
import CategoryManager from '@/components/ideas/CategoryManager'
import ExportButtons from '@/components/contacts/ExportButtons'
import {
  getIdeas,
  getIdeaCategories,
  createIdea,
  updateIdea,
  deleteIdea,
} from '@/lib/supabase'
import { Idea, IdeaCategory } from '@/lib/types'

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [categories, setCategories] = useState<IdeaCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Idea | undefined>(undefined)
  const [managerOpen, setManagerOpen] = useState(false)

  const loadCategories = useCallback(() => getIdeaCategories().then(setCategories), [])

  const load = useCallback(() => {
    setLoading(true)
    return Promise.all([getIdeas(), getIdeaCategories()]).then(([i, c]) => {
      setIdeas(i)
      setCategories(c)
      setLoading(false)
    })
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = ideas.filter((i) =>
    categoryFilter === 'all' ? true : (i.category_id ?? '') === categoryFilter
  )

  function openNew() {
    setEditing(undefined)
    setFormOpen(true)
  }

  function openEdit(idea: Idea) {
    setEditing(idea)
    setFormOpen(true)
  }

  async function handleSave(data: Omit<Idea, 'id' | 'created_at' | 'updated_at'>) {
    if (editing) await updateIdea(editing.id, data)
    else await createIdea(data)
    setFormOpen(false)
    setEditing(undefined)
    await load()
  }

  async function handleDelete(id: string) {
    await deleteIdea(id)
    await load()
  }

  const catById = (id?: string | null) => categories.find((c) => c.id === id)

  return (
    <div>
      <Header
        title="Lavagna idee"
        subtitle={loading ? 'Caricamento…' : `${filtered.length} idee`}
        actions={
          <div className="flex gap-2 items-center">
            <ExportButtons defaultScope="ideas" />
            <Button variant="secondary" onClick={() => setManagerOpen(true)}>Categorie</Button>
            <Button onClick={openNew}>+ Nuova idea</Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2 mb-6">
        <FilterChip active={categoryFilter === 'all'} onClick={() => setCategoryFilter('all')}>
          Tutte
        </FilterChip>
        {categories.map((c) => (
          <FilterChip key={c.id} active={categoryFilter === c.id} onClick={() => setCategoryFilter(c.id)}>
            {c.name}
          </FilterChip>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Caricamento…</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Nessuna idea</p>
          <p className="text-sm mt-1">Aggiungi la tua prima idea con il pulsante in alto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              category={catById(idea.category_id)}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <IdeaForm
          idea={editing}
          categories={categories}
          onSave={handleSave}
          onCancel={() => { setFormOpen(false); setEditing(undefined) }}
        />
      )}

      {managerOpen && (
        <CategoryManager
          categories={categories}
          onChange={loadCategories}
          onClose={() => { setManagerOpen(false); load() }}
        />
      )}
    </div>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        active
          ? 'bg-primary text-white'
          : 'bg-surface-card border border-gray-border text-on-surface-variant hover:bg-surface-container-low'
      }`}
    >
      {children}
    </button>
  )
}
