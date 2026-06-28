'use client'

import PriorityStars from '@/components/ui/PriorityStars'
import { Idea, IdeaCategory, IDEA_STATUS_LABELS, IDEA_STATUS_COLORS } from '@/lib/types'

interface IdeaCardProps {
  idea: Idea
  category?: IdeaCategory
  onEdit: (idea: Idea) => void
  onDelete: (id: string) => void
}

export default function IdeaCard({ idea, category, onEdit, onDelete }: IdeaCardProps) {
  return (
    <div className="bg-surface-card border border-gray-border rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-on-surface">{idea.name}</h3>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(idea)}
            className="p-1 rounded-lg text-gray-400 hover:text-primary hover:bg-surface-container-low transition-colors"
            aria-label="Modifica"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
          <button
            onClick={() => onDelete(idea.id)}
            className="p-1 rounded-lg text-gray-400 hover:text-danger hover:bg-red-50 transition-colors"
            aria-label="Elimina"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      </div>

      {idea.notes && <p className="text-sm text-on-surface-variant whitespace-pre-wrap">{idea.notes}</p>}

      <div className="flex items-center justify-between mt-auto pt-2">
        <PriorityStars value={idea.priority} />
        <div className="flex items-center gap-2">
          {category && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: `${category.color}20`, color: category.color }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
              {category.name}
            </span>
          )}
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${IDEA_STATUS_COLORS[idea.status]}`}>
            {IDEA_STATUS_LABELS[idea.status]}
          </span>
        </div>
      </div>
    </div>
  )
}
