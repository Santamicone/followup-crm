'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getContacts } from '@/lib/supabase'
import { Contact, ContactStatus } from '@/lib/types'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import ContactCard from '@/components/contacts/ContactCard'
import ContactFilters from '@/components/contacts/ContactFilters'

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
        (c.company ?? '').toLowerCase().includes(q) ||
        (c.email ?? '').toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div>
      <Header
        title="Contatti"
        subtitle={loading ? 'Caricamento…' : `${filtered.length} contatti`}
        actions={
          <Link href="/contacts/new">
            <Button>+ Nuovo contatto</Button>
          </Link>
        }
      />

      <ContactFilters
        current={statusFilter}
        search={search}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearch}
      />

      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <p>Caricamento contatti…</p>
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
