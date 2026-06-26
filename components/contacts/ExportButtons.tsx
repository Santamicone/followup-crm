'use client'

import { Contact } from '@/lib/types'
import Button from '@/components/ui/Button'

interface ExportButtonsProps {
  contacts: Contact[]
}

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
    Stato: c.status,
    'Prossima azione': c.next_action ?? '',
    'Data prossima azione': c.next_action_date ?? '',
    Note: c.notes ?? '',
    'Creato il': new Date(c.created_at).toLocaleDateString('it-IT'),
  }))
}

async function exportExcel(contacts: Contact[]) {
  const XLSX = await import('xlsx')
  const rows = contactsToRows(contacts)
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Contatti')
  XLSX.writeFile(wb, `stakeholder_${new Date().toISOString().slice(0, 10)}.xlsx`)
}

async function exportPDF(contacts: Contact[]) {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  doc.setFontSize(14)
  doc.text('Stakeholder', 14, 15)
  doc.setFontSize(9)
  doc.text(`Esportato il ${new Date().toLocaleDateString('it-IT')} — ${contacts.length} contatti`, 14, 21)

  const columns = ['Nome', 'Cognome', 'Ruolo', 'Entità', 'Email', 'Telefono', 'Città', 'Competenze', 'Prossima azione']
  const rows = contacts.map((c) => [
    c.first_name ?? c.name.split(' ')[0] ?? '',
    c.last_name ?? c.name.split(' ').slice(1).join(' ') ?? '',
    c.role ?? '',
    c.entity ?? '',
    c.email ?? '',
    c.phone ?? '',
    c.city ?? '',
    (c.skills ?? []).join(', '),
    c.next_action ?? '',
  ])

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 26,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [79, 70, 229] },
  })

  doc.save(`stakeholder_${new Date().toISOString().slice(0, 10)}.pdf`)
}

export default function ExportButtons({ contacts }: ExportButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm" onClick={() => exportExcel(contacts)}>
        <span className="material-symbols-outlined text-[15px]">download</span>
        Excel
      </Button>
      <Button variant="secondary" size="sm" onClick={() => exportPDF(contacts)}>
        <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
        PDF
      </Button>
    </div>
  )
}
