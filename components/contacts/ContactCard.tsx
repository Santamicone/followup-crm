import Link from 'next/link'
import { Contact } from '@/lib/types'
import Badge from '@/components/ui/Badge'

interface ContactCardProps {
  contact: Contact
}

export default function ContactCard({ contact }: ContactCardProps) {
  const initials = contact.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <Link href={`/contacts/${contact.id}`} className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
            <Badge status={contact.status} />
          </div>
          {contact.company && <p className="text-xs text-gray-400 mt-0.5">{contact.company}</p>}
          {contact.email && <p className="text-xs text-gray-500 mt-1">{contact.email}</p>}
          {contact.tags && contact.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {contact.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
              {contact.tags.length > 3 && (
                <span className="text-xs text-gray-400">+{contact.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
      {contact.next_action && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            <span className="font-medium text-gray-700">Prossima azione:</span> {contact.next_action}
            {contact.next_action_date && (
              <span className="ml-1 text-indigo-600 font-medium">
                ({new Date(contact.next_action_date).toLocaleDateString('it-IT')})
              </span>
            )}
          </p>
        </div>
      )}
    </Link>
  )
}
