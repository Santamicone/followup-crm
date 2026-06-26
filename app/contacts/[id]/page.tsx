'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getContact, archiveContact, getActions } from '@/lib/supabase'
import { Contact, Action } from '@/lib/types'
import Header from '@/components/layout/Header'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import ActionsPanel from '@/components/contacts/ActionsPanel'

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [contact, setContact] = useState<Contact | undefined>()
  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState(true)
  const [showArchiveModal, setShowArchiveModal] = useState(false)

  useEffect(() => {
    Promise.all([getContact(id), getActions(id)]).then(([c, a]) => {
      setContact(c)
      setActions(a)
      setLoading(false)
    })
  }, [id])

  async function handleArchive() {
    const updated = await archiveContact(id)
    if (updated) setContact(updated)
    setShowArchiveModal(false)
  }

  const fmt = (d?: string) =>
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

  const infoRows = [
    { label: 'Email', value: contact.email, icon: 'mail' },
    { label: 'Telefono', value: contact.phone, icon: 'call' },
    { label: 'Città', value: contact.city, icon: 'location_on' },
    { label: 'Ruolo', value: contact.role, icon: 'badge' },
    { label: 'Entità', value: contact.entity, icon: 'group' },
    { label: 'Azienda', value: contact.company, icon: 'business' },
    { label: 'Aggiunto', value: fmt(contact.created_at), icon: 'calendar_today' },
  ]

  return (
    <div>
      <Header
        title={contact.name}
        subtitle={[contact.role, contact.entity].filter(Boolean).join(' · ') || contact.company || undefined}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
        {/* Colonna sinistra */}
        <div className="lg:col-span-2 space-y-4">
          {/* Info */}
          <div className="bg-surface-card rounded-[24px] card-shadow border border-gray-border p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-xl font-bold">
                {initials}
              </div>
              <div>
                <h2 className="text-lg font-bold text-on-surface">{contact.name}</h2>
                {contact.entity && <p className="text-sm text-on-surface-variant">{contact.entity}</p>}
                <div className="mt-1"><Badge status={contact.status} /></div>
              </div>
            </div>

            <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-4">Informazioni</h3>
            <dl className="space-y-3">
              {infoRows.map(({ label, value, icon }) => value ? (
                <div key={label} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant w-5 shrink-0">{icon}</span>
                  <dt className="text-sm text-on-surface-variant w-24 shrink-0">{label}</dt>
                  <dd className="text-sm text-on-surface">{value}</dd>
                </div>
              ) : null)}
            </dl>
          </div>

          {/* Competenze */}
          {contact.skills && contact.skills.length > 0 && (
            <div className="bg-surface-card rounded-[24px] card-shadow border border-gray-border p-6">
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Competenze</h3>
              <div className="flex flex-wrap gap-2">
                {contact.skills.map((s) => (
                  <span key={s} className="text-sm bg-surface-container text-primary px-3 py-1 rounded-full font-medium">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Perché utile */}
          {contact.why_useful && (
            <div className="bg-surface-card rounded-[24px] card-shadow border border-gray-border p-6">
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Perché può essere utile</h3>
              <p className="text-sm text-on-surface whitespace-pre-wrap leading-relaxed">{contact.why_useful}</p>
            </div>
          )}

          {/* Note */}
          {contact.notes && (
            <div className="bg-surface-card rounded-[24px] card-shadow border border-gray-border p-6">
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Note</h3>
              <p className="text-sm text-on-surface whitespace-pre-wrap leading-relaxed">{contact.notes}</p>
            </div>
          )}

          {/* Tag */}
          {contact.tags && contact.tags.length > 0 && (
            <div className="bg-surface-card rounded-[24px] card-shadow border border-gray-border p-6">
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Tag</h3>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag) => (
                  <span key={tag} className="text-sm bg-surface-container text-primary px-3 py-1 rounded-full font-medium">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Storico azioni */}
          <ActionsPanel contactId={id} initial={actions} />
        </div>

        {/* Colonna destra */}
        <div className="space-y-4">
          <div className="bg-surface-card rounded-[24px] card-shadow border border-gray-border p-6">
            <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-4">Prossima azione</h3>
            {contact.next_action ? (
              <>
                <p className="text-sm text-on-surface font-medium">{contact.next_action}</p>
                {contact.next_action_date && (
                  <p className="text-xs text-primary mt-1 font-semibold">{fmt(contact.next_action_date)}</p>
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
        description={`Sei sicuro di voler archiviare "${contact.name}"?`}
        confirmLabel="Archivia"
        onConfirm={handleArchive}
        onCancel={() => setShowArchiveModal(false)}
        danger
      />
    </div>
  )
}
