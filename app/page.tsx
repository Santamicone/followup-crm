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

  const active = contacts.filter((c) => c.status !== 'archived')
  const leads = contacts.filter((c) => c.status === 'lead')
  const customers = contacts.filter((c) => c.status === 'customer')

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
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-xl">
          <p className="text-sm font-semibold text-amber-800 mb-1">Tabella non trovata su Supabase</p>
          <p className="text-sm text-amber-700 mb-3">
            Devi creare la tabella <code className="font-mono bg-amber-100 px-1 rounded">contacts</code> nel tuo progetto Supabase.
          </p>
          <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
            <li>Apri il tuo progetto su supabase.com</li>
            <li>Vai su <strong>SQL Editor → New query</strong></li>
            <li>Incolla il contenuto di <code className="font-mono bg-amber-100 px-1 rounded">supabase/schema.sql</code></li>
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
        subtitle={`Buongiorno! Oggi è ${today.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}`}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Contatti attivi" value={active.length} />
        <StatCard label="Lead" value={leads.length} color="text-blue-600" />
        <StatCard label="Clienti" value={customers.length} color="text-purple-600" />
        <StatCard label="Follow-up scaduti" value={overdueCount} color={overdueCount > 0 ? 'text-red-600' : 'text-gray-900'} />
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-700 mb-3">Prossimi follow-up</h2>
        <FollowUpList contacts={upcoming} />
      </div>
    </div>
  )
}
