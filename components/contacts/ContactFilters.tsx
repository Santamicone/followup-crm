'use client'

import { ContactStatus, STATUS_LABELS } from '@/lib/types'

const ALL_STATUSES: (ContactStatus | 'all')[] = ['all', 'active', 'lead', 'customer', 'archived']

interface ContactFiltersProps {
  current: ContactStatus | 'all'
  search: string
  onStatusChange: (status: ContactStatus | 'all') => void
  onSearchChange: (search: string) => void
}

export default function ContactFilters({ current, search, onStatusChange, onSearchChange }: ContactFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cerca per nome, azienda, email..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-container-low border border-gray-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {ALL_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
              current === status
                ? 'bg-primary text-white shadow-sm shadow-primary/20'
                : 'bg-surface-card border border-gray-border text-on-surface-variant hover:bg-surface-container-low hover:border-primary/30'
            }`}
          >
            {status === 'all' ? 'Tutti' : STATUS_LABELS[status]}
          </button>
        ))}
      </div>
    </div>
  )
}
