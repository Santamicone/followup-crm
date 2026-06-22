interface StatCardProps {
  label: string
  value: number | string
  color?: string
}

export default function StatCard({ label, value, color = 'text-gray-900' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  )
}
