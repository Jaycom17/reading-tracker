'use client'

import { useState } from 'react'
import { createChallenge } from '@/actions/challenges'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const durationPresets = [2, 4, 8, 12, 16, 24, 32, 40, 48, 52]

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
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Reto de Lectura</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del reto
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                Meta (número de libros)
              </label>
              <input
                type="number"
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                required
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label htmlFor="duration_weeks" className="block text-sm font-medium text-gray-700 mb-1">
                Duración (semanas)
              </label>
              <div className="space-y-2">
                <select
                  id="duration_weeks"
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                >
                  {durationPresets.map((weeks) => (
                    <option key={weeks} value={weeks.toString()}>
                      {weeks} semanas
                    </option>
                  ))}
                  <option value="custom">Personalizado...</option>
                </select>
                {durationWeeks === 'custom' && (
                  <input
                    type="number"
                    id="custom_duration"
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(e.target.value)}
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    placeholder="Número de semanas"
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Link href="/" className="text-indigo-600 hover:text-indigo-500">
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Creando...' : 'Crear reto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}