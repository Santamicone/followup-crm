import { ContactStatus, STATUS_COLORS, STATUS_LABELS } from '@/lib/types'

interface BadgeProps {
  status: ContactStatus
  className?: string
}

export default function Badge({ status, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status]} ${className}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
