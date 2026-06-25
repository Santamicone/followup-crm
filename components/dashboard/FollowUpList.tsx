import Link from 'next/link'
import { Contact } from '@/lib/types'
import Badge from '@/components/ui/Badge'

interface FollowUpListProps {
  contacts: Contact[]
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.floor((date.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return `${Math.abs(diff)}g fa`
  if (diff === 0) return 'Oggi'
  if (diff === 1) return 'Domani'
  return `Fra ${diff}g`
}

function isOverdue(dateStr: string): boolean {
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
}

const AVATAR_COLORS = [
  'bg-primary-fixed text-primary',
  'bg-secondary-fixed text-secondary',
  'bg-tertiary-fixed text-tertiary',
  'bg-green-100 text-green-700',
]

export default function FollowUpList({ contacts }: FollowUpListProps) {
  if (contacts.length === 0) {
    return (
      <div className="bg-surface-card rounded-[24px] card-shadow border border-gray-border p-8 text-center">
        <span className="material-symbols-outlined text-[40px] text-on-surface-variant mb-3 block">event_available</span>
        <p className="text-sm text-on-surface-variant">Nessun follow-up in programma</p>
      </div>
    )
  }

  return (
    <div className="bg-surface-card rounded-[24px] card-shadow border border-gray-border overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-border flex items-center justify-between">
        <h4 className="text-base font-semibold text-on-surface">Prossimi follow-up</h4>
        <Link href="/contacts" className="text-sm font-semibold text-primary hover:underline">
          Vedi tutti
        </Link>
      </div>
      <div className="divide-y divide-gray-border">
        {contacts.map((contact, i) => (
          <Link
            key={contact.id}
            href={`/contacts/${contact.id}`}
            className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container-low transition-colors"
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
              {getInitials(contact.name)}
            </div>

            {/* Name + company */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate">{contact.name}</p>
              {contact.company && (
                <p className="text-xs text-on-surface-variant">{contact.company}</p>
              )}
            </div>

            {/* Status */}
            <Badge status={contact.status} />

            {/* Action */}
            {contact.next_action && (
              <p className="text-xs text-on-surface-variant hidden md:block max-w-[200px] truncate">
                {contact.next_action}
              </p>
            )}

            {/* Date chip */}
            {contact.next_action_date && (
              <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                isOverdue(contact.next_action_date)
                  ? 'bg-red-100 text-red-700'
                  : 'bg-surface-container text-primary'
              }`}>
                {formatDate(contact.next_action_date)}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
