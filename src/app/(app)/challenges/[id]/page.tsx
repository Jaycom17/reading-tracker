import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

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
    .order('created_at', { ascending: false })

  const completedCount = books?.filter(b => b.status === 'completado').length || 0
  const progress = challenge.goal > 0 ? Math.round((completedCount / challenge.goal) * 100) : 0

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{challenge.name}</h1>
            <p className="text-gray-600 mt-1">
              Meta: {challenge.goal} libros en {challenge.duration_weeks} semanas
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/challenges/${id}/books/new`}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Añadir libro
            </Link>
            <Link
              href={`/challenges/${id}/achievement`}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Ver logro
            </Link>
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
                className="bg-indigo-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Libro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books && books.length > 0 ? (
                books.map((book) => (
                  <tr key={book.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{book.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{book.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          book.status === 'completado' ? 'bg-green-100 text-green-800' :
                          book.status === 'en_progreso' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {book.status === 'completado' ? 'Completado' :
                         book.status === 'en_progreso' ? 'En progreso' : 'Por leer'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <form action="/api/books/" method="POST" className="flex space-x-2">
                        <input type="hidden" name="book_id" value={book.id} />
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
                        <button type="submit" className="text-indigo-600 hover:text-indigo-900">
                          Actualizar
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No hay libros aún. <Link href={`/challenges/${id}/books/new`} className="text-indigo-600 hover:underline">Añade el primero</Link>
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