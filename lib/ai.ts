import { unstable_cache } from 'next/cache'

export interface DashboardSummaryInput {
  overdueCount: number
  upcoming: { name: string; date: string | null }[]
  topTasks: { description: string; assignee: string | null; priority: number }[]
  openTasksCount: number
  ideasInReview: { name: string }[]
}

const MODEL = 'claude-haiku-4-5'

async function callClaude(input: DashboardSummaryInput): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null

  const prompt = `Sei l'assistente di un CRM. In base ai dati qui sotto, scrivi un riepilogo discorsivo in italiano (massimo 3 frasi, tono professionale e diretto) che evidenzi le priorità del giorno: cosa va recuperato subito, i task più urgenti e le idee da valutare. Non elencare, scrivi un paragrafo scorrevole. Se non c'è nulla di urgente, dillo in modo positivo.

Dati:
- Follow-up scaduti: ${input.overdueCount}
- Prossimi follow-up: ${input.upcoming.map((c) => `${c.name} (${c.date ?? 'senza data'})`).join(', ') || 'nessuno'}
- Task prioritari aperti: ${input.topTasks.map((t) => `${t.description}${t.assignee ? ` [${t.assignee}]` : ''} (priorità ${t.priority})`).join(', ') || 'nessuno'}
- Totale task aperti: ${input.openTasksCount}
- Idee in valutazione: ${input.ideasInReview.map((i) => i.name).join(', ') || 'nessuna'}`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    const text = data?.content?.[0]?.text
    return typeof text === 'string' ? text.trim() : null
  } catch {
    return null
  }
}

/**
 * Riepilogo AI delle priorità della dashboard.
 * Cache giornaliera: rigenerato al massimo una volta al giorno (chiave = data odierna),
 * così i costi API restano sotto controllo.
 */
export async function getDashboardSummary(
  input: DashboardSummaryInput
): Promise<string | null> {
  const dayKey = new Date().toISOString().slice(0, 10)
  const cached = unstable_cache(
    async () => callClaude(input),
    ['dashboard-summary', dayKey],
    { revalidate: 86400 }
  )
  return cached()
}
