import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'

export const metadata: Metadata = {
  title: 'FollowUp CRM',
  description: 'Mini CRM per professionisti e piccoli imprenditori',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="h-full">
      <body className="h-full flex bg-gray-50 antialiased">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </body>
    </html>
  )
}
