'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getContact, archiveContact } from '@/lib/supabase'
import { Contact } from '@/lib/types'
import Header from '@/components/layout/Header'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [contact, setContact] = useState<Contact | undefined>()
  const [loading, setLoading] = useState(true)
  const [showArchiveModal, setShowArchiveModal] = useState(false)

  useEffect(() => {
    getContact(id).then((data) => {
      setContact(data)
      setLoading(false)
    })
  }, [id])

  async function handleArchive() {
    const updated = await archiveContact(id)
    if (updated) setContact(updated)
    setShowArchiveModal(false)
  }

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'

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
      <Header
        title={contact.name}
        subtitle={contact.company || undefined}
        actions={
          <div className="flex gap-2">
            <Link href={`/contacts/${id}/edit`}>
              <Button variant="secondary">Modifica</Button>
            </Link>
            {contact.status !== 'archived' && (
              <Button variant="danger" onClick={() => setShowArchiveModal(true)}>Archivia</Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Informazioni</h2>
            <dl className="space-y-3">
              <div className="flex gap-3">
                <dt className="text-sm text-gray-500 w-28 shrink-0">Stato</dt>
                <dd><Badge status={contact.status} /></dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-sm text-gray-500 w-28 shrink-0">Email</dt>
                <dd className="text-sm text-gray-900">{contact.email || '—'}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-sm text-gray-500 w-28 shrink-0">Telefono</dt>
                <dd className="text-sm text-gray-900">{contact.phone || '—'}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-sm text-gray-500 w-28 shrink-0">Azienda</dt>
                <dd className="text-sm text-gray-900">{contact.company || '—'}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-sm text-gray-500 w-28 shrink-0">Creato il</dt>
                <dd className="text-sm text-gray-900">{formatDate(contact.created_at)}</dd>
              </div>
            </dl>
          </div>

          {contact.notes && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Note</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.notes}</p>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Prossima azione</h2>
            {contact.next_action ? (
              <>
                <p className="text-sm text-gray-900 font-medium">{contact.next_action}</p>
                {contact.next_action_date && (
                  <p className="text-xs text-indigo-600 mt-1 font-medium">{formatDate(contact.next_action_date)}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-400">Nessuna azione pianificata</p>
            )}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link href={`/contacts/${id}/edit`}>
                <Button variant="ghost" size="sm" className="w-full justify-center">Aggiorna azione</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={showArchiveModal}
        title="Archivia contatto"
        description={`Sei sicuro di voler archiviare "${contact.name}"? Potrai sempre riattivarlo in seguito modificando lo stato.`}
        confirmLabel="Archivia"
        onConfirm={handleArchive}
        onCancel={() => setShowArchiveModal(false)}
        danger
      />
    </div>
  )
}
