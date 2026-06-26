'use client'

import { useState, FormEvent } from 'react'
import Image from 'next/image'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      window.location.href = '/'
    } else {
      const data = await res.json()
      setError(data.error ?? 'Errore di accesso')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-surface-card rounded-[24px] card-shadow border border-gray-border p-8">
          {/* Brand */}
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/logo.png"
              alt="Vieni a correre. Running CRM"
              width={200}
              height={200}
              className="w-48 h-auto object-contain"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-border rounded-lg bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="••••••••"
                autoFocus
                required
              />
            </div>

            {error && (
              <p className="text-sm text-danger bg-error-container/40 border border-error-container px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold rounded-xl bg-primary text-white hover:bg-primary-container shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              {loading ? 'Accesso…' : 'Accedi'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
