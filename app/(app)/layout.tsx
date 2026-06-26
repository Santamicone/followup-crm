import Sidebar from '@/components/layout/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex bg-surface-bg custom-scrollbar">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0 p-8 custom-scrollbar">
        {children}
      </main>
    </div>
  )
}
