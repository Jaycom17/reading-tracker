import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

interface Props {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: Props) {
  const { id } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data: book } = await supabase
    .from('books')
    .select('id, challenge_id, status')
    .eq('id', id)
    .single()

  if (!book) {
    return NextResponse.json({ error: 'Libro no encontrado' }, { status: 404 })
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

  const body = await request.json()
  const { status } = body

  if (!status || !['por_leer', 'en_progreso', 'completado'].includes(status)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
  }

  const updateData: Record<string, unknown> = { status }
  if (status === 'completado') {
    updateData.completed_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('books')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}