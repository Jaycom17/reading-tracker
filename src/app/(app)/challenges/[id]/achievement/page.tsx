import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { format } from 'date-fns'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ book_id?: string }>
}

export default async function AchievementPage({ params, searchParams }: Props) {
  const { id } = await params
  const { book_id } = await searchParams
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: challenge } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!challenge) notFound()

  let book = null
  if (book_id) {
    const { data } = await supabase
      .from('books')
      .select('*')
      .eq('id', book_id)
      .eq('challenge_id', id)
      .single()
    book = data
  }

  const { data: completedBooks } = await supabase
    .from('books')
    .select('*')
    .eq('challenge_id', id)
    .eq('status', 'completado')

  const isChallengeComplete = (completedBooks?.length || 0) >= challenge.goal

  if (book && book.status !== 'completado') {
    redirect(`/challenges/${id}`)
  }

  if (!book_id && !isChallengeComplete) {
    redirect(`/challenges/${id}`)
  }

  const imageUrl = `/api/achievement?challenge_id=${id}${book_id ? `&book_id=${book_id}` : ''}`
  const fileName = book
    ? `logro-libro-${book.title.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.png`
    : `logro-reto-${challenge.name.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.png`

  return (
    <main className="min-h-screen bg-gray-900 py-12 px-4 flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 text-center">
          <img
            src={imageUrl}
            alt={book ? `Logro: ${book.title}` : `Logro: ${challenge.name}`}
            className="mx-auto rounded-lg shadow-lg max-w-full h-auto"
          />
          <div className="mt-8 space-y-4">
            <a
              href={imageUrl}
              download={fileName}
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Descargar imagen
            </a>
            <a
              href={book ? `/challenges/${id}` : '/'}
              className="inline-block px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Volver
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}