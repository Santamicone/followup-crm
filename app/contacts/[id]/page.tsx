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
    return <div className="text-center py-16 text-on-surface-variant">Caricamento…</div>
  }

  if (!contact) {
    return (
      <div className="text-center py-16 text-on-surface-variant">
        <span className="material-symbols-outlined text-[48px] mb-3 block">person_off</span>
        <p className="text-lg font-semibold">Contatto non trovato</p>
        <Link href="/contacts" className="text-primary text-sm hover:underline mt-2 inline-block">
          Torna ai contatti
        </Link>
      </div>
    )
  }

  const initials = contact.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div>
      <Header
        title={contact.name}
        subtitle={contact.company || undefined}
        actions={
          <div className="flex gap-2">
            <Link href={`/contacts/${id}/edit`}>
              <Button variant="secondary">
                <span className="material-symbols-outlined text-[16px]">edit</span>
                Modifica
              </Button>
            </Link>
            {contact.status !== 'archived' && (
              <Button variant="danger" onClick={() => setShowArchiveModal(true)}>
                <span className="material-symbols-outlined text-[16px]">archive</span>
                Archivia
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl">
        <div className="lg:col-span-2 space-y-4">
          {/* Avatar + Info header */}
          <div className="bg-surface-card rounded-[24px] card-shadow border border-gray-border p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-xl font-bold">
                {initials}
              </div>
              <div>
                <h2 className="text-lg font-bold text-on-surface">{contact.name}</h2>
                {contact.company && <p className="text-sm text-on-surface-variant">{contact.company}</p>}
                <div className="mt-1"><Badge status={contact.status} /></div>
              </div>
            </div>

            <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-4">Informazioni</h3>
            <dl className="space-y-3">
              {[
                { label: 'Email', value: contact.email, icon: 'mail' },
                { label: 'Telefono', value: contact.phone, icon: 'call' },
                { label: 'Azienda', value: contact.company, icon: 'business' },
                { label: 'Creato il', value: formatDate(contact.created_at), icon: 'calendar_today' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant w-5 shrink-0">{icon}</span>
                  <dt className="text-sm text-on-surface-variant w-24 shrink-0">{label}</dt>
                  <dd className="text-sm text-on-surface">{value || '—'}</dd>
                </div>
              ))}
            </dl>
          </div>

          {contact.tags && contact.tags.length > 0 && (
            <div className="bg-surface-card rounded-[24px] card-shadow border border-gray-border p-6">
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Tag</h3>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag) => (
                  <span key={tag} className="text-sm bg-surface-container text-primary px-3 py-1 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {contact.notes && (
            <div className="bg-surface-card rounded-[24px] card-shadow border border-gray-border p-6">
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Note</h3>
              <p className="text-sm text-on-surface whitespace-pre-wrap leading-relaxed">{contact.notes}</p>
            </div>
          )}
        </div>

        <div>
          <div className="bg-surface-card rounded-[24px] card-shadow border border-gray-border p-6">
            <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-4">Prossima azione</h3>
            {contact.next_action ? (
              <>
                <p className="text-sm text-on-surface font-medium">{contact.next_action}</p>
                {contact.next_action_date && (
                  <p className="text-xs text-primary mt-1 font-semibold">{formatDate(contact.next_action_date)}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-on-surface-variant">Nessuna azione pianificata</p>
            )}
            <div className="mt-4 pt-4 border-t border-gray-border">
              <Link href={`/contacts/${id}/edit`}>
                <Button variant="ghost" size="sm" className="w-full justify-center">
                  Aggiorna azione
                </Button>
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
