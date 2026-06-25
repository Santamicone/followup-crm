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
    <Link
      href={`/contacts/${contact.id}`}
      className="block bg-surface-card rounded-[24px] card-shadow border border-gray-border p-5 hover:border-primary transition-all duration-200 group"
    >
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-sm font-bold shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-on-surface">{contact.name}</p>
            <Badge status={contact.status} />
          </div>
          {contact.company && (
            <p className="text-xs text-on-surface-variant mt-0.5">{contact.company}</p>
          )}
          {contact.email && (
            <p className="text-xs text-on-surface-variant mt-1">{contact.email}</p>
          )}
          {contact.tags && contact.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {contact.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs bg-surface-container text-primary px-2 py-0.5 rounded-full font-medium">
                  {tag}
                </span>
              ))}
              {contact.tags.length > 3 && (
                <span className="text-xs text-on-surface-variant">+{contact.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
      {contact.next_action && (
        <div className="mt-4 pt-3 border-t border-gray-border">
          <p className="text-xs text-on-surface-variant">
            <span className="font-semibold text-on-surface">Prossima azione:</span>{' '}
            {contact.next_action}
            {contact.next_action_date && (
              <span className="ml-1 text-primary font-semibold">
                ({new Date(contact.next_action_date).toLocaleDateString('it-IT')})
              </span>
            )}
          </p>
        </div>
      )}
    </Link>
  )
}
