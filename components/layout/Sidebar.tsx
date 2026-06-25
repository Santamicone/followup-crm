'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Dashboard', icon: 'dashboard' },
  { href: '/contacts', label: 'Contatti', icon: 'group' },
  { href: '/contacts/new', label: 'Nuovo Contatto', icon: 'person_add' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 bg-surface-card border-r border-gray-border flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-[20px]">rocket_launch</span>
        </div>
        <h1 className="text-lg font-bold text-primary tracking-tight">FollowUp CRM</h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map(({ href, label, icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href) && href !== '/'
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                active
                  ? 'bg-secondary-fixed text-on-secondary-fixed-variant'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {icon}
              </span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-border">
        <p className="text-xs text-on-surface-variant px-2">FollowUp CRM v0.1</p>
      </div>
    </aside>
  )
}
