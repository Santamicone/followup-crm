import { getContacts, getIdeas, getTasks } from '@/lib/supabase'
import Header from '@/components/layout/Header'
import StatCard from '@/components/dashboard/StatCard'
import FollowUpList from '@/components/dashboard/FollowUpList'
import TaskList from '@/components/dashboard/TaskList'
import AiSummary from '@/components/dashboard/AiSummary'
import ExportButtons from '@/components/contacts/ExportButtons'
import { getDashboardSummary } from '@/lib/ai'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  let contacts: Awaited<ReturnType<typeof getContacts>> = []
  let ideas: Awaited<ReturnType<typeof getIdeas>> = []
  let tasks: Awaited<ReturnType<typeof getTasks>> = []
  let dbError = false
  try {
    contacts = await getContacts()
  } catch {
    dbError = true
  }
  // Idee e task sono opzionali: se le tabelle non esistono la dashboard
  // contatti continua a funzionare.
  try {
    ideas = await getIdeas()
  } catch {
    ideas = []
  }
  try {
    tasks = await getTasks()
  } catch {
    tasks = []
  }

  const openIdeas = ideas.filter((i) => i.status === 'aperta')
  const ideasInReview = ideas.filter((i) => i.status === 'in_valutazione')
  const openTasks = tasks.filter((t) => t.status !== 'completato')
  const completedTasks = tasks.filter((t) => t.status === 'completato')

  const topTasks = openTasks.filter((t) => t.priority === 5).slice(0, 6)

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

  let aiSummary: string | null = null
  try {
    aiSummary = await getDashboardSummary({
      overdueCount,
      upcoming: upcoming.map((c) => ({ name: c.name, date: c.next_action_date ?? null })),
      topTasks: topTasks.map((t) => ({
        description: t.description,
        assignee: t.assignee ?? null,
        priority: t.priority,
      })),
      openTasksCount: openTasks.length,
      ideasInReview: ideasInReview.map((i) => ({ name: i.name })),
    })
  } catch {
    aiSummary = null
  }

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
        actions={<ExportButtons defaultScope="all" />}
      />

      <AiSummary text={aiSummary} />

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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Idee aperte"
          value={openIdeas.length}
          icon="lightbulb"
          iconBg="bg-primary-fixed"
          iconColor="text-primary"
        />
        <StatCard
          label="Idee in valutazione"
          value={ideasInReview.length}
          icon="rate_review"
          iconBg="bg-secondary-fixed"
          iconColor="text-secondary"
        />
        <StatCard
          label="Task aperti"
          value={openTasks.length}
          icon="checklist"
          iconBg="bg-tertiary-fixed"
          iconColor="text-tertiary"
        />
        <StatCard
          label="Task completati"
          value={completedTasks.length}
          icon="task_alt"
          iconBg="bg-green-100"
          iconColor="text-green-700"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <FollowUpList contacts={upcoming} />
        <TaskList tasks={topTasks} />
      </div>
    </div>
  )
}
