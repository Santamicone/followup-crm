'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import PriorityStars from '@/components/ui/PriorityStars'
import TaskForm from '@/components/tasks/TaskForm'
import ExportButtons from '@/components/contacts/ExportButtons'
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/supabase'
import {
  Task,
  TaskStatus,
  TASK_STATUS_LABELS,
  TASK_STATUS_COLORS,
} from '@/lib/types'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Task | undefined>(undefined)

  const load = useCallback(() => {
    setLoading(true)
    return getTasks().then((t) => { setTasks(t); setLoading(false) })
  }, [])

  useEffect(() => { load() }, [load])

  const assignees = Array.from(new Set(tasks.map((t) => t.assignee).filter(Boolean))) as string[]

  const filtered = tasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    if (assigneeFilter !== 'all' && (t.assignee ?? '') !== assigneeFilter) return false
    return true
  })

  function openNew() { setEditing(undefined); setFormOpen(true) }
  function openEdit(task: Task) { setEditing(task); setFormOpen(true) }

  async function handleSave(data: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
    if (editing) await updateTask(editing.id, data)
    else await createTask(data)
    setFormOpen(false)
    setEditing(undefined)
    await load()
  }

  async function handleStatusChange(task: Task, status: TaskStatus) {
    await updateTask(task.id, { status })
    await load()
  }

  async function handleDelete(id: string) {
    await deleteTask(id)
    await load()
  }

  return (
    <div>
      <Header
        title="Bacheca task"
        subtitle={loading ? 'Caricamento…' : `${filtered.length} task`}
        actions={
          <div className="flex gap-2 items-center">
            <ExportButtons defaultScope="tasks" />
            <Button onClick={openNew}>+ Nuovo task</Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
          className="rounded-xl border border-gray-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">Tutti gli stati</option>
          {(Object.keys(TASK_STATUS_LABELS) as TaskStatus[]).map((s) => (
            <option key={s} value={s}>{TASK_STATUS_LABELS[s]}</option>
          ))}
        </select>

        <select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="rounded-xl border border-gray-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">Tutti i responsabili</option>
          {assignees.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Caricamento…</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Nessun task</p>
          <p className="text-sm mt-1">Aggiungi il primo task con il pulsante in alto.</p>
        </div>
      ) : (
        <div className="bg-surface-card border border-gray-border rounded-xl divide-y divide-gray-border">
          {filtered.map((task) => (
            <div key={task.id} className="flex items-start gap-4 p-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-on-surface whitespace-pre-wrap">{task.description}</p>
                <div className="flex items-center flex-wrap gap-3 mt-2">
                  {task.assignee && (
                    <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px]">person</span>
                      {task.assignee}
                    </span>
                  )}
                  <PriorityStars value={task.priority} />
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task, e.target.value as TaskStatus)}
                  className={`rounded-full text-xs font-semibold px-2.5 py-1 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${TASK_STATUS_COLORS[task.status]}`}
                >
                  {(Object.keys(TASK_STATUS_LABELS) as TaskStatus[]).map((s) => (
                    <option key={s} value={s}>{TASK_STATUS_LABELS[s]}</option>
                  ))}
                </select>
                <button
                  onClick={() => openEdit(task)}
                  className="p-1 rounded-lg text-gray-400 hover:text-primary hover:bg-surface-container-low transition-colors"
                  aria-label="Modifica"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="p-1 rounded-lg text-gray-400 hover:text-danger hover:bg-red-50 transition-colors"
                  aria-label="Elimina"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <TaskForm
          task={editing}
          onSave={handleSave}
          onCancel={() => { setFormOpen(false); setEditing(undefined) }}
        />
      )}
    </div>
  )
}
