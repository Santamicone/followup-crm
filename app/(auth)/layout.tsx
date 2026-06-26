export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full bg-surface-bg">
      {children}
    </div>
  )
}
