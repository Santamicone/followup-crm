import { getContacts } from '@/lib/supabase'
import Header from '@/components/layout/Header'
import StatCard from '@/components/dashboard/StatCard'
import FollowUpList from '@/components/dashboard/FollowUpList'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  let contacts: Awaited<ReturnType<typeof getContacts>> = []
  let dbError = false
  try {
    contacts = await getContacts()
  } catch {
    dbError = true
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const active = contacts.filter((c) => c.status !== 'not_interested')
  const contacted = contacts.filter((c) => c.status === 'contacted')
  const involved = contacts.filter((c) => c.status === 'involved')

  const upcoming = active
    .filter((c) => c.next_action_date)
    .sort((a, b) => new Date(a.next_action_date!).getTime() - new Date(b.next_action_date!).getTime())
    .slice(0, 8)

  const overdueCount = active.filter((c) => {
    if (!c.next_action_date) return false
    return new Date(c.next_action_date) < today
  }).length

  if (dbError) {
    return (
      <div>
        <Header title="Dashboard" />
        <div className="bg-surface-card rounded-[24px] card-shadow border border-gray-border p-6 max-w-xl">
          <p className="text-sm font-semibold text-on-surface mb-1">Tabella non trovata su Supabase</p>
          <p className="text-sm text-on-surface-variant mb-3">
            Devi creare la tabella <code className="font-mono bg-surface-container px-1 rounded">contacts</code> nel tuo progetto Supabase.
          </p>
          <ol className="text-sm text-on-surface-variant space-y-1 list-decimal list-inside">
            <li>Apri il tuo progetto su supabase.com</li>
            <li>Vai su <strong>SQL Editor → New query</strong></li>
            <li>Incolla il contenuto di <code className="font-mono bg-surface-container px-1 rounded">supabase/schema.sql</code></li>
            <li>Clicca <strong>Run</strong> e ricarica questa pagina</li>
          </ol>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle={`Oggi è ${today.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}`}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Contatti attivi"
          value={active.length}
          icon="contact_page"
          iconBg="bg-primary-fixed"
          iconColor="text-primary"
        />
        <StatCard
          label="Contattati"
          value={contacted.length}
          icon="mark_email_read"
          iconBg="bg-secondary-fixed"
          iconColor="text-secondary"
        />
        <StatCard
          label="Coinvolti"
          value={involved.length}
          icon="handshake"
          iconBg="bg-tertiary-fixed"
          iconColor="text-tertiary"
        />
        <StatCard
          label="Follow-up scaduti"
          value={overdueCount}
          icon="event_busy"
          iconBg="bg-red-100"
          iconColor="text-red-600"
          valueColor={overdueCount > 0 ? 'text-danger' : 'text-on-surface'}
          badge={overdueCount > 0 ? 'Urgenti' : undefined}
          badgeColor="bg-error-container text-on-error-container"
        />
      </div>

      <FollowUpList contacts={upcoming} />
    </div>
  )
}
