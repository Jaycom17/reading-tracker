import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

interface Props {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: Props) {
  const { id } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data: challenge } = await supabase
    .from('challenges')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!challenge) {
    return NextResponse.json({ error: 'Reto no encontrado' }, { status: 404 })
  }

  const body = await request.json()
  const { title, author, notes } = body

  if (!title || !author) {
    return NextResponse.json({ error: 'Título y autor son requeridos' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('books')
    .insert({
      challenge_id: id,
      title,
      author,
      notes: notes || '',
      status: 'por_leer',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}