import Link from 'next/link'
import { Task, TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '@/lib/types'
import PriorityStars from '@/components/ui/PriorityStars'

interface TaskListProps {
  tasks: Task[]
}

export default function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="bg-surface-card rounded-[24px] card-shadow border border-gray-border overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-border flex items-center justify-between">
        <h4 className="text-base font-semibold text-on-surface">Task prioritari aperti</h4>
        <Link href="/tasks" className="text-sm font-semibold text-primary hover:underline">
          Vedi tutti
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="p-8 text-center">
          <span className="material-symbols-outlined text-[40px] text-on-surface-variant mb-3 block">task_alt</span>
          <p className="text-sm text-on-surface-variant">Nessun task aperto</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-border">
          {tasks.map((task) => (
            <Link
              key={task.id}
              href="/tasks"
              className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container-low transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface truncate">{task.description}</p>
                {task.assignee && (
                  <p className="text-xs text-on-surface-variant">{task.assignee}</p>
                )}
              </div>

              <PriorityStars value={task.priority} className="shrink-0 hidden sm:inline-flex" />

              <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${TASK_STATUS_COLORS[task.status]}`}>
                {TASK_STATUS_LABELS[task.status]}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
