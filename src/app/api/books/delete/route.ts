import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { book_id } = body

  if (!book_id) {
    return NextResponse.json({ error: 'book_id requerido' }, { status: 400 })
  }

  const { data: book } = await supabase
    .from('books')
    .select('id, challenge_id, status')
    .eq('id', book_id)
    .single()

  if (!book) {
    return NextResponse.json({ error: 'Libro no encontrado' }, { status: 404 })
  }

  if (book.status === 'completado') {
    return NextResponse.json({ error: 'No se pueden eliminar libros completados' }, { status: 400 })
  }

  const { data: challenge } = await supabase
    .from('challenges')
    .select('id')
    .eq('id', book.challenge_id)
    .eq('user_id', user.id)
    .single()

  if (!challenge) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', book_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}