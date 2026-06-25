interface StatCardProps {
  label: string
  value: number | string
  icon: string
  iconBg?: string
  iconColor?: string
  valueColor?: string
  badge?: string
  badgeColor?: string
}

export default function StatCard({
  label,
  value,
  icon,
  iconBg = 'bg-primary-fixed',
  iconColor = 'text-primary',
  valueColor = 'text-on-surface',
  badge,
  badgeColor = 'bg-error-container text-on-error-container',
}: StatCardProps) {
  return (
    <div className="bg-surface-card p-5 rounded-[24px] card-shadow border border-gray-border flex flex-col gap-2 hover:border-primary transition-colors duration-300 group">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center ${iconColor}`}>
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
        </div>
        {badge && (
          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${badgeColor}`}>{badge}</span>
        )}
      </div>
      <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mt-2">{label}</span>
      <span className={`text-[28px] font-bold ${valueColor}`}>{value}</span>
    </div>
  )
}
