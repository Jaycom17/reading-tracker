'use client'

import { useState } from 'react'
import { createChallenge } from '@/actions/challenges'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const durationPresets = [
  { value: 4, label: '4 semanas (1 mes)' },
  { value: 8, label: '8 semanas (2 meses)' },
  { value: 12, label: '12 semanas (3 meses)' },
  { value: 26, label: '26 semanas (6 meses)' },
  { value: 52, label: '52 semanas (1 año)' },
]

export default function CreateChallengePage() {
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [durationWeeks, setDurationWeeks] = useState('52')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await createChallenge(name.trim(), parseInt(goal), parseInt(durationWeeks))
      if (result.error) {
        setError(result.error)
      } else {
        router.push(`/challenges/${result.data.id}`)
        router.refresh()
      }
    } catch {
      setError('Error al crear el reto')
    } finally {
      setLoading(false)
    }
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
          <h1 className="font-serif text-3xl text-ink font-semibold">Nuevo Reto de Lectura</h1>
          <p className="text-ink-light mt-1">Define tu meta de lectura y el plazo para completarla.</p>
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
                Nombre del reto
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ej: 12 libros en 2026"
                className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-lg text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              />
            </div>

            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-ink mb-1.5">
                Meta de libros
              </label>
              <input
                type="number"
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                required
                min="1"
                placeholder="Ej: 12"
                className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-lg text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-3">
                Duración
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {durationPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setDurationWeeks(preset.value.toString())}
                    className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                      durationWeeks === preset.value.toString()
                        ? 'bg-ink text-paper border-ink'
                        : 'bg-white text-ink border-warm-gray hover:border-ink-light hover:bg-ink hover:text-paper'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <label htmlFor="custom_duration" className="block text-xs text-ink-light mb-1">
                  O personaliza:
                </label>
                <input
                  type="number"
                  id="custom_duration"
                  min="1"
                  placeholder="Número de semanas"
                  value={durationPresets.some(p => p.value.toString() === durationWeeks) ? '' : durationWeeks}
                  onChange={(e) => setDurationWeeks(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-lg text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                />
              </div>
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
                {loading ? 'Creando...' : 'Crear reto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
