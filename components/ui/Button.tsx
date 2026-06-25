import { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md'
}

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-container shadow-sm shadow-primary/20 focus:ring-primary/30',
  secondary: 'bg-white text-on-surface border border-gray-border hover:bg-surface-container-low focus:ring-primary/30',
  danger: 'bg-danger text-white hover:bg-red-700 focus:ring-red-400',
  ghost: 'text-primary hover:bg-surface-container-low focus:ring-primary/30',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
}

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-2 font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
