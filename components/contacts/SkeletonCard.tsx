export default function SkeletonCard() {
  return (
    <div className="bg-surface-card rounded-[24px] card-shadow border border-gray-border p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-full bg-surface-container shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-surface-container rounded w-2/3" />
          <div className="h-3 bg-surface-container rounded w-1/2" />
          <div className="h-3 bg-surface-container rounded w-1/3" />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-border space-y-2">
        <div className="h-3 bg-surface-container rounded w-3/4" />
      </div>
    </div>
  )
}
