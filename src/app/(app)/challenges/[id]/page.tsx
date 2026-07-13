import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ChallengeDetailPage({ params }: Props) {
  const { id } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: challenge, error: challengeError } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (challengeError || !challenge) notFound()

  const { data: books } = await supabase
    .from('books')
    .select('*')
    .eq('challenge_id', id)
    .order('created_at', { ascending: true })

  const completedCount = books?.filter(b => b.status === 'completado').length || 0
  const progress = challenge.goal > 0 ? Math.round((completedCount / challenge.goal) * 100) : 0

  const getCurrentWeek = (createdAt: string, durationWeeks: number) => {
    const created = new Date(createdAt)
    const now = new Date()
    const diffMs = now.getTime() - created.getTime()
    const diffWeeks = Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000))
    return Math.min(Math.max(diffWeeks, 1), durationWeeks)
  }

  const currentWeek = getCurrentWeek(challenge.created_at, challenge.duration_weeks)
  const isChallengeComplete = completedCount >= challenge.goal
  const isTimeUp = currentWeek >= challenge.duration_weeks && !isChallengeComplete

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    return format(new Date(dateString), "d 'de' MMMM 'de' yyyy", { locale: es })
  }

  const statusLabels: Record<string, { label: string; class: string }> = {
    por_leer: { label: 'Por leer', class: 'bg-gray-100 text-gray-800' },
    en_progreso: { label: 'En progreso', class: 'bg-yellow-100 text-yellow-800' },
    completado: { label: 'Completado', class: 'bg-green-100 text-green-800' },
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{challenge.name}</h1>
            <p className="text-gray-600 mt-1">
              Meta: {challenge.goal} libros en {challenge.duration_weeks} semanas
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {books && books.length < challenge.goal && (
              <Link
                href={`/challenges/${id}/books/new`}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Añadir libro
              </Link>
            )}
            {isChallengeComplete && (
              <Link
                href={`/challenges/${id}/achievement`}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Generar logro del reto
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Progreso</span>
              <span>{completedCount} / {challenge.goal} libros ({progress}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  isChallengeComplete ? 'bg-green-600' : 'bg-indigo-600'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="px-3 py-1 bg-gray-100 rounded-full">
              Semana {currentWeek} de {challenge.duration_weeks}
            </span>
            {isTimeUp && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full">
                Tiempo agotado
              </span>
            )}
            {isChallengeComplete && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                ¡Reto completado!
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Libro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha completado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books && books.length > 0 ? (
                books.map((book) => {
                  const status = statusLabels[book.status]
                  return (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{book.author}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.class}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.completed_at ? formatDate(book.completed_at) : '—'}
                      </td>
                      <td className="px-6 py-4">
                        {book.notes && (
                          <div className="max-w-xs line-clamp-2 text-sm text-gray-600">
                            {book.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <form action="/api/books/toggle" method="POST" className="flex items-center gap-2">
                          <input type="hidden" name="book_id" value={book.id} />
                          <input type="hidden" name="challenge_id" value={id} />
                          <select
                            name="status"
                            defaultValue={book.status}
                            onChange={(e) => (e.target as HTMLSelectElement).form?.requestSubmit()}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                          >
                            <option value="por_leer">Por leer</option>
                            <option value="en_progreso">En progreso</option>
                            <option value="completado">Completado</option>
                          </select>
                        </form>
                        <form action="/api/books/notes" method="POST" className="flex items-center gap-2 mt-2">
                          <input type="hidden" name="book_id" value={book.id} />
                          <input type="hidden" name="challenge_id" value={id} />
                          <button type="submit" className="text-indigo-600 hover:text-indigo-900 text-sm">
                            {book.notes ? 'Editar notas' : 'Añadir notas'}
                          </button>
                        </form>
                        <form action="/api/books/delete" method="POST" className="flex items-center gap-2 mt-2">
                          <input type="hidden" name="book_id" value={book.id} />
                          <input type="hidden" name="challenge_id" value={id} />
                          <button
                            type="submit"
                            disabled={book.status === 'completado'}
                            className={`text-sm ${book.status === 'completado' ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:text-red-900'}`}
                          >
                            Eliminar
                          </button>
                        </form>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No hay libros aún.{' '}
                    {books && books.length < challenge.goal && (
                      <Link href={`/challenges/${id}/books/new`} className="text-indigo-600 hover:underline">
                        Añade el primero
                      </Link>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}