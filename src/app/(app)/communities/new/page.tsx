'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createCommunity } from '@/actions/communities'

export default function NewCommunityPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await createCommunity(name, description)

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
          <h1 className="font-serif text-3xl text-ink font-semibold">Nueva Comunidad</h1>
          <p className="text-ink-light mt-1">Crea una comunidad de lectura y comparte con otros.</p>
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
              <label htmlFor="name" className="block text-sm font-medium text-ink mb-1.5">
                Nombre de la comunidad
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ej: Leer clásicos"
                className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-lg text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-ink mb-1.5">
                Descripción
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="¿De qué trata esta comunidad?"
                rows={3}
                className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-lg text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all resize-none"
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
                disabled={loading}
                className="px-6 py-2.5 bg-ink text-paper rounded-lg font-medium hover:bg-gold hover:text-ink disabled:opacity-50 disabled:hover:bg-ink disabled:hover:text-paper transition-all"
              >
                {loading ? 'Creando...' : 'Crear comunidad'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
