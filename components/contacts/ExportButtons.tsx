'use client'

import { useState, useRef, useEffect } from 'react'
import { Contact, Task, Idea, IdeaCategory, STATUS_LABELS, TASK_STATUS_LABELS, IDEA_STATUS_LABELS } from '@/lib/types'
import { getTasks, getIdeas, getIdeaCategories } from '@/lib/supabase'
import Button from '@/components/ui/Button'

interface ExportButtonsProps {
  contacts: Contact[]
}

type Scope = 'contacts' | 'tasks' | 'ideas' | 'all'

const SCOPE_LABELS: Record<Scope, string> = {
  contacts: 'Contatti',
  tasks: 'Task',
  ideas: 'Idee',
  all: 'Tutto',
}

const today = () => new Date().toISOString().slice(0, 10)
const itDate = (iso: string) => new Date(iso).toLocaleDateString('it-IT')

// ===== Righe per tipo =====
function contactsToRows(contacts: Contact[]) {
  return contacts.map((c) => ({
    Nome: c.first_name ?? c.name.split(' ')[0] ?? '',
    Cognome: c.last_name ?? c.name.split(' ').slice(1).join(' ') ?? '',
    Email: c.email ?? '',
    Telefono: c.phone ?? '',
    Città: c.city ?? '',
    Ruolo: c.role ?? '',
    Entità: c.entity ?? '',
    Azienda: c.company ?? '',
    Competenze: (c.skills ?? []).join(', '),
    'Perché utile': c.why_useful ?? '',
    Stato: STATUS_LABELS[c.status] ?? c.status,
    'Prossima azione': c.next_action ?? '',
    'Data prossima azione': c.next_action_date ?? '',
    Note: c.notes ?? '',
    'Creato il': itDate(c.created_at),
  }))
}

function tasksToRows(tasks: Task[]) {
  return tasks.map((t) => ({
    Descrizione: t.description,
    Assegnatario: t.assignee ?? '',
    Priorità: t.priority,
    Stato: TASK_STATUS_LABELS[t.status] ?? t.status,
    'Creato il': itDate(t.created_at),
  }))
}

function ideasToRows(ideas: Idea[], categories: IdeaCategory[]) {
  const catName = (id?: string | null) => categories.find((c) => c.id === id)?.name ?? ''
  return ideas.map((i) => ({
    Nome: i.name,
    Categoria: catName(i.category_id),
    Priorità: i.priority,
    Stato: IDEA_STATUS_LABELS[i.status] ?? i.status,
    Note: i.notes ?? '',
    'Creato il': itDate(i.created_at),
  }))
}

// ===== Caricamento dati in base allo scope =====
async function loadData(scope: Scope, contacts: Contact[]) {
  const need = (s: Scope) => scope === 'all' || scope === s
  const [tasks, ideas, categories] = await Promise.all([
    need('tasks') ? getTasks() : Promise.resolve([] as Task[]),
    need('ideas') ? getIdeas() : Promise.resolve([] as Idea[]),
    need('ideas') ? getIdeaCategories() : Promise.resolve([] as IdeaCategory[]),
  ])
  return { contacts, tasks, ideas, categories }
}

type Sheet = { name: string; rows: Record<string, unknown>[]; columns: string[] }

function buildSheets(
  scope: Scope,
  data: { contacts: Contact[]; tasks: Task[]; ideas: Idea[]; categories: IdeaCategory[] }
): Sheet[] {
  const need = (s: Scope) => scope === 'all' || scope === s
  const sheets: Sheet[] = []
  if (need('contacts')) {
    sheets.push({
      name: 'Contatti',
      rows: contactsToRows(data.contacts),
      columns: ['Nome', 'Cognome', 'Ruolo', 'Entità', 'Email', 'Telefono', 'Città', 'Competenze', 'Prossima azione'],
    })
  }
  if (need('tasks')) {
    sheets.push({
      name: 'Task',
      rows: tasksToRows(data.tasks),
      columns: ['Descrizione', 'Assegnatario', 'Priorità', 'Stato', 'Creato il'],
    })
  }
  if (need('ideas')) {
    sheets.push({
      name: 'Idee',
      rows: ideasToRows(data.ideas, data.categories),
      columns: ['Nome', 'Categoria', 'Priorità', 'Stato', 'Note', 'Creato il'],
    })
  }
  return sheets
}

async function exportExcel(scope: Scope, contacts: Contact[]) {
  const XLSX = await import('xlsx')
  const data = await loadData(scope, contacts)
  const sheets = buildSheets(scope, data)
  const wb = XLSX.utils.book_new()
  for (const sheet of sheets) {
    const ws = XLSX.utils.json_to_sheet(sheet.rows)
    XLSX.utils.book_append_sheet(wb, ws, sheet.name)
  }
  XLSX.writeFile(wb, `export_${scope}_${today()}.xlsx`)
}

async function exportPDF(scope: Scope, contacts: Contact[]) {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')
  const data = await loadData(scope, contacts)
  const sheets = buildSheets(scope, data)

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  doc.setFontSize(14)
  doc.text('FollowUp CRM — Export', 14, 15)
  doc.setFontSize(9)
  doc.text(`Esportato il ${new Date().toLocaleDateString('it-IT')}`, 14, 21)

  let startY = 28
  for (const sheet of sheets) {
    doc.setFontSize(11)
    doc.text(`${sheet.name} (${sheet.rows.length})`, 14, startY)
    autoTable(doc, {
      head: [sheet.columns],
      body: sheet.rows.map((r) => sheet.columns.map((col) => String(r[col] ?? ''))),
      startY: startY + 3,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [79, 70, 229] },
    })
    // @ts-expect-error lastAutoTable è aggiunto a runtime da jspdf-autotable
    startY = (doc.lastAutoTable?.finalY ?? startY) + 10
  }

  doc.save(`export_${scope}_${today()}.pdf`)
}

export default function ExportButtons({ contacts }: ExportButtonsProps) {
  const [scope, setScope] = useState<Scope>('contacts')
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  async function run(fn: (scope: Scope, contacts: Contact[]) => Promise<void>) {
    setBusy(true)
    try {
      await fn(scope, contacts)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <div ref={menuRef} className="relative">
        <Button variant="secondary" size="sm" onClick={() => setOpen((o) => !o)}>
          {SCOPE_LABELS[scope]}
          <span className="material-symbols-outlined text-[15px]">expand_more</span>
        </Button>
        {open && (
          <div className="absolute right-0 z-10 mt-1 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            {(Object.keys(SCOPE_LABELS) as Scope[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setScope(s)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${
                  scope === s ? 'font-medium text-indigo-600' : 'text-gray-700'
                }`}
              >
                {SCOPE_LABELS[s]}
                {scope === s && <span className="material-symbols-outlined text-[15px]">check</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <Button variant="secondary" size="sm" disabled={busy} onClick={() => run(exportExcel)}>
        <span className="material-symbols-outlined text-[15px]">download</span>
        Excel
      </Button>
      <Button variant="secondary" size="sm" disabled={busy} onClick={() => run(exportPDF)}>
        <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
        PDF
      </Button>
    </div>
  )
}
