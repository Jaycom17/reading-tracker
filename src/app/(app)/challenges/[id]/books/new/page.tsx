import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AddBookPage({ params }: Props) {
  const { id } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: challenge } = await supabase
    .from('challenges')
    .select('id, name')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!challenge) redirect('/')

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Añadir libro a: {challenge.name}</h1>
          <form action="/api/challenges/[id]/books" method="POST" className="space-y-6">
            <input type="hidden" name="challenge_id" value={id} />
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Autor
              </label>
              <input
                type="text"
                id="author"
                name="author"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notas (opcional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <a href={`/challenges/${id}`} className="text-indigo-600 hover:text-indigo-500">
                Cancelar
              </a>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Añadir libro
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}