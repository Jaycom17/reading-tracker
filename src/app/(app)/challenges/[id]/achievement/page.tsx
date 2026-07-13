import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import Image from 'next/image'

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

  const completedBooks = await supabase
    .from('books')
    .select('*')
    .eq('challenge_id', id)
    .eq('status', 'completado')

  const isChallengeComplete = (completedBooks.data?.length || 0) >= challenge.goal

  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 450
  const ctx = canvas.getContext('2d')!

  // Background
  ctx.fillStyle = '#1e1e2e'
  ctx.fillRect(0, 0, 800, 450)

  // Decorative elements
  ctx.fillStyle = '#313244'
  ctx.fillRect(0, 0, 800, 450)

  // Title
  ctx.fillStyle = '#cdd6f4'
  ctx.font = 'bold 36px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(book ? '¡Libro Completado!' : '¡Reto Completado!', 400, 100)

  // Challenge/Book name
  ctx.fillStyle = '#f5c2e7'
  ctx.font = '24px Inter, sans-serif'
  ctx.fillText(book ? book.title : challenge.name, 400, 150)

  if (book) {
    ctx.fillStyle = '#a6adc8'
    ctx.font = '18px Inter, sans-serif'
    ctx.fillText(`por ${book.author}`, 400, 190)
  } else {
    ctx.fillStyle = '#a6adc8'
    ctx.font = '18px Inter, sans-serif'
    ctx.fillText(`Meta: ${challenge.goal} libros en ${challenge.duration_weeks} semanas`, 400, 190)
    ctx.fillText(`Completados: ${completedBooks.data?.length || 0} libros`, 400, 220)
  }

  // Date
  ctx.fillStyle = '#6c7086'
  ctx.font = '16px Inter, sans-serif'
  ctx.fillText(new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }), 400, 300)

  // Footer
  ctx.fillStyle = '#45475a'
  ctx.font = '14px Inter, sans-serif'
  ctx.fillText('Reading Tracker - Tu progreso de lectura', 400, 400)

  const imageUrl = canvas.toDataURL('image/png')

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
              download={`logro-${book ? 'libro' : 'reto'}-${crypto.randomUUID()}.png`}
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