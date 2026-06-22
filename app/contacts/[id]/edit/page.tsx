'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getContact } from '@/lib/supabase'
import { Contact } from '@/lib/types'
import Header from '@/components/layout/Header'
import ContactForm from '@/components/contacts/ContactForm'

export default function EditContactPage() {
  const { id } = useParams<{ id: string }>()
  const [contact, setContact] = useState<Contact | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getContact(id).then((data) => {
      setContact(data)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return <div className="text-center py-16 text-gray-400">Caricamento…</div>
  }

  if (!contact) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">Contatto non trovato</p>
        <Link href="/contacts" className="text-indigo-600 text-sm hover:underline mt-2 inline-block">
          Torna ai contatti
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Header title="Modifica contatto" subtitle={contact.name} />
      <ContactForm contact={contact} />
    </div>
  )
}
