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
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Cerca per nome, azienda, email..."
        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      <div className="flex gap-1 flex-wrap">
        {ALL_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              current === status
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {status === 'all' ? 'Tutti' : STATUS_LABELS[status]}
          </button>
        ))}
      </div>
    </div>
  )
}
