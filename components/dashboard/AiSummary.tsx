interface AiSummaryProps {
  text: string | null
}

export default function AiSummary({ text }: AiSummaryProps) {
  if (!text) return null

  return (
    <div className="bg-surface-card rounded-[24px] card-shadow border border-gray-border p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[22px]">auto_awesome</span>
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-on-surface mb-1">Cosa c&apos;è da fare oggi</h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  )
}
