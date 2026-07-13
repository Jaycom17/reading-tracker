import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CreateChallengePage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Reto de Lectura</h1>
          <form className="space-y-6" action="/api/challenges" method="POST">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del reto
              </label>
              <input
                type="text"
                id="name"
                name="name"
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
                name="goal"
                required
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label htmlFor="duration_weeks" className="block text-sm font-medium text-gray-700 mb-1">
                Duración (semanas)
              </label>
              <input
                type="number"
                id="duration_weeks"
                name="duration_weeks"
                required
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Link href="/" className="text-indigo-600 hover:text-indigo-500">
                Cancelar
              </Link>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Crear reto
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}