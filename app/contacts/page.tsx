'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getContacts } from '@/lib/supabase'
import { Contact, ContactStatus } from '@/lib/types'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import ContactCard from '@/components/contacts/ContactCard'
import SkeletonCard from '@/components/contacts/SkeletonCard'
import ContactFilters from '@/components/contacts/ContactFilters'
import ExportButtons from '@/components/contacts/ExportButtons'

export default function ContactsPage() {
  const [allContacts, setAllContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    getContacts().then((data) => {
      setAllContacts(data)
      setLoading(false)
    })
  }, [])

  const filtered = allContacts.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        c.name.toLowerCase().includes(q) ||
        (c.role ?? '').toLowerCase().includes(q) ||
        (c.entity ?? '').toLowerCase().includes(q) ||
        (c.company ?? '').toLowerCase().includes(q) ||
        (c.email ?? '').toLowerCase().includes(q) ||
        (c.city ?? '').toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div>
      <Header
        title="Stakeholder"
        subtitle={loading ? 'Caricamento…' : `${filtered.length} contatti`}
        actions={
          <div className="flex gap-2 items-center">
            {!loading && <ExportButtons contacts={filtered} />}
            <Link href="/contacts/new">
              <Button>+ Nuovo contatto</Button>
            </Link>
          </div>
        }
      />

      <ContactFilters
        current={statusFilter}
        search={search}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearch}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Nessun contatto trovato</p>
          <p className="text-sm mt-1">Prova a modificare i filtri o aggiungi un nuovo contatto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  )
}
