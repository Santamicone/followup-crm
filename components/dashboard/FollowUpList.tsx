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

function isUrgent(dateStr: string): boolean {
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.floor((date.getTime() - today.getTime()) / 86400000)
  return diff <= 1
}

export default function FollowUpList({ contacts }: FollowUpListProps) {
  if (contacts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <p className="text-gray-400 text-sm">Nessun follow-up in programma</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
      {contacts.map((contact) => (
        <Link key={contact.id} href={`/contacts/${contact.id}`} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-900 truncate">{contact.name}</p>
              <Badge status={contact.status} />
            </div>
            {contact.company && <p className="text-xs text-gray-400 mt-0.5">{contact.company}</p>}
            {contact.next_action && (
              <p className="text-xs text-gray-600 mt-1 truncate">{contact.next_action}</p>
            )}
          </div>
          {contact.next_action_date && (
            <span className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${
              isUrgent(contact.next_action_date)
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {formatDate(contact.next_action_date)}
            </span>
          )}
        </Link>
      ))}
    </div>
  )
}
