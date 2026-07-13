import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import { DownloadButton } from './download-button'

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
  const aspectRatio = 1200 / 630

  const subtitle = book
    ? `Has completado "${book.title}"`
    : `Has completado el reto "${challenge.name}"`

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center p-4 sm:p-6 lg:p-10 pt-20 sm:pt-6 lg:pt-10">
      <div className="w-full max-w-3xl mx-auto text-center">
        <div className="mb-6 sm:mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl text-ink font-semibold mb-2">¡Logro desbloqueado!</h1>
          <p className="text-ink-light">{subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl border border-warm-gray/50 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] mb-8 relative overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gold/50" />
          <img
            src={imageUrl}
            alt={book ? `Logro: ${book.title}` : `Logro: ${challenge.name}`}
            className="mx-auto rounded-xl w-full h-auto"
            style={{ aspectRatio: `${aspectRatio}` }}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <DownloadButton imageUrl={imageUrl} fileName={book ? `logro-libro` : `logro-reto`} />
          <Link
            href={book ? `/challenges/${id}` : '/'}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-warm-gray text-ink rounded-lg font-medium hover:bg-ink hover:text-paper transition-all w-full sm:w-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {book ? 'Volver al reto' : 'Ir al inicio'}
          </Link>
        </div>
      </div>
    </div>
  )
}
