'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Dashboard', icon: '◉' },
  { href: '/contacts', label: 'Contatti', icon: '◎' },
  { href: '/contacts/new', label: 'Nuovo contatto', icon: '+' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-gray-100">
        <span className="text-lg font-bold text-indigo-600 tracking-tight">FollowUp CRM</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href) && href !== '/'
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="px-5 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">FollowUp CRM v0.1</p>
      </div>
    </aside>
  )
}
