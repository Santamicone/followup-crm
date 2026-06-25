import { ContactStatus, STATUS_LABELS } from '@/lib/types'

interface BadgeProps {
  status: ContactStatus
  className?: string
}

const STATUS_STYLES: Record<ContactStatus, string> = {
  active: 'bg-green-100 text-green-700',
  lead: 'bg-blue-100 text-blue-700',
  customer: 'bg-purple-100 text-purple-700',
  archived: 'bg-gray-100 text-gray-500',
}

export default function Badge({ status, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status]} ${className}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
