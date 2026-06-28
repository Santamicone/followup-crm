'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const navItems = [
  { href: '/', label: 'Dashboard', icon: 'dashboard' },
  { href: '/contacts', label: 'Contatti', icon: 'group' },
  { href: '/ideas', label: 'Lavagna idee', icon: 'lightbulb' },
  { href: '/tasks', label: 'Bacheca task', icon: 'checklist' },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex-1 px-4 space-y-1">
      {navItems.map(({ href, label, icon }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href) && href !== '/'
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
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
  )
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  // Chiudi il drawer ad ogni cambio di route
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const brand = (
    <div className="px-5 py-4">
      <Image
        src="/logo.png"
        alt="Vieni a correre. Running CRM"
        width={180}
        height={180}
        className="w-full h-auto object-contain"
        priority
      />
    </div>
  )

  const footer = (
    <div className="p-4 border-t border-gray-border space-y-2">
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 w-full px-2 py-2 rounded-lg text-xs font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">logout</span>
        Esci
      </button>
      <p className="text-xs text-on-surface-variant px-2">CRM v0.1</p>
    </div>
  )

  return (
    <>
      {/* Sidebar desktop (lg+) */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-surface-card border-r border-gray-border flex-col h-screen sticky top-0">
        {brand}
        <NavLinks />
        {footer}
      </aside>

      {/* Top bar mobile (< lg) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 bg-surface-card border-b border-gray-border px-4 h-14">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
          aria-label="Apri menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
        <Image src="/logo.png" alt="Vieni a correre. Running CRM" width={120} height={40} className="h-8 w-auto object-contain" />
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer mobile */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-64 bg-surface-card border-r border-gray-border flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-border">
          <span className="text-sm font-bold text-primary">Menu</span>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
            aria-label="Chiudi menu"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>
        {brand}
        <NavLinks onNavigate={() => setOpen(false)} />
        {footer}
      </aside>
    </>
  )
}
