import { ContactStatus, STATUS_LABELS } from '@/lib/types'

interface BadgeProps {
  status: ContactStatus
  className?: string
}

const STATUS_STYLES: Record<ContactStatus, string> = {
  to_contact: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  involved: 'bg-green-100 text-green-700',
  not_interested: 'bg-gray-100 text-gray-500',
}

export default function Badge({ status, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status]} ${className}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
