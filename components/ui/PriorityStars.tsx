'use client'

interface PriorityStarsProps {
  value: number
  onChange?: (value: number) => void
  className?: string
}

// Mostra una priorità 1-5 a stelline. Se onChange è passato, è interattiva.
export default function PriorityStars({ value, onChange, className = '' }: PriorityStarsProps) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value
        const star = (
          <span
            key={n}
            className={`material-symbols-outlined text-[18px] ${filled ? 'text-amber-500' : 'text-gray-300'}`}
            style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            star
          </span>
        )
        if (!onChange) return star
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="leading-none hover:scale-110 transition-transform"
            aria-label={`Priorità ${n}`}
          >
            {star}
          </button>
        )
      })}
    </span>
  )
}
