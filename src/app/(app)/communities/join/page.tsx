'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { joinCommunity } from '@/actions/communities'

export default function JoinCommunityPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await joinCommunity(code)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center p-4 sm:p-6 lg:p-10 pt-20 sm:pt-6 lg:pt-10">
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-ink-light hover:text-gold-dark transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Volver
          </Link>
          <h1 className="font-serif text-3xl text-ink font-semibold">Unirse a Comunidad</h1>
          <p className="text-ink-light mt-1">Ingresa el código de acceso que compartió el creador.</p>
        </div>

        <div className="bg-paper-dark rounded-xl border border-warm-gray/60 p-5 sm:p-8 relative overflow-hidden animate-fade-in-up shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gold/50" />
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-burgundy/8 border border-burgundy/25 text-burgundy px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-ink mb-1.5">
                Código de acceso
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
                maxLength={6}
                placeholder="Ej: A3X9K2"
                className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-lg text-ink text-center text-lg tracking-[0.3em] font-mono placeholder-ink-light/50 placeholder:tracking-normal placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-warm-gray/40">
              <Link
                href="/"
                className="text-sm text-center sm:text-left text-ink-light hover:text-gold-dark transition-colors py-2"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading || code.length < 6}
                className="px-6 py-2.5 bg-ink text-paper rounded-lg font-medium hover:bg-gold hover:text-ink disabled:opacity-50 disabled:hover:bg-ink disabled:hover:text-paper transition-all"
              >
                {loading ? 'Buscando...' : 'Unirse'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
