'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function addBook(challengeId: string, title: string, author: string, notes?: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  const { data: challenge } = await supabase
    .from('challenges')
    .select('id, goal')
    .eq('id', challengeId)
    .eq('user_id', user.id)
    .single()

  if (!challenge) {
    return { error: 'Reto no encontrado' }
  }

  const { count } = await supabase
    .from('books')
    .select('*', { count: 'exact', head: true })
    .eq('challenge_id', challengeId)

  if ((count || 0) >= challenge.goal) {
    return { error: `Ya has añadido los ${challenge.goal} libros de tu meta` }
  }

  const { data, error } = await supabase
    .from('books')
    .insert({
      challenge_id: challengeId,
      title,
      author,
      notes: notes || '',
      status: 'por_leer',
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/challenges/${challengeId}`)
  return { data }
}

export async function updateBookStatus(bookId: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  const { data: book } = await supabase
    .from('books')
    .select('id, challenge_id, status')
    .eq('id', bookId)
    .single()

  if (!book) {
    return { error: 'Libro no encontrado' }
  }

  const { data: challenge } = await supabase
    .from('challenges')
    .select('id')
    .eq('id', book.challenge_id)
    .eq('user_id', user.id)
    .single()

  if (!challenge) {
    return { error: 'No autorizado' }
  }

  const statusOrder = ['por_leer', 'en_progreso', 'completado']
  const currentIndex = statusOrder.indexOf(book.status)
  const nextIndex = (currentIndex + 1) % 3
  const nextStatus = statusOrder[nextIndex]

  const updateData: Record<string, unknown> = { status: nextStatus }
  if (nextStatus === 'completado') {
    updateData.completed_at = new Date().toISOString()
  } else if (book.status === 'completado') {
    updateData.completed_at = null
  }

  const { data, error } = await supabase
    .from('books')
    .update(updateData)
    .eq('id', bookId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/challenges/${book.challenge_id}`)
  return { data, nextStatus, completed: nextStatus === 'completado' }
}

export async function updateBookNotes(bookId: string, notes: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  const { data: book } = await supabase
    .from('books')
    .select('id, challenge_id')
    .eq('id', bookId)
    .single()

  if (!book) {
    return { error: 'Libro no encontrado' }
  }

  const { data: challenge } = await supabase
    .from('challenges')
    .select('id')
    .eq('id', book.challenge_id)
    .eq('user_id', user.id)
    .single()

  if (!challenge) {
    return { error: 'No autorizado' }
  }

  if (notes.length > 5000) {
    return { error: 'Máximo 5000 caracteres' }
  }

  const { data, error } = await supabase
    .from('books')
    .update({ notes })
    .eq('id', bookId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/challenges/${book.challenge_id}`)
  return { data }
}

export async function deleteBook(bookId: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  const { data: book } = await supabase
    .from('books')
    .select('id, challenge_id, status, title')
    .eq('id', bookId)
    .single()

  if (!book) {
    return { error: 'Libro no encontrado' }
  }

  const { data: challenge } = await supabase
    .from('challenges')
    .select('id')
    .eq('id', book.challenge_id)
    .eq('user_id', user.id)
    .single()

  if (!challenge) {
    return { error: 'No autorizado' }
  }

  if (book.status === 'completado') {
    return { error: 'No se pueden eliminar libros completados' }
  }

  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', bookId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/challenges/${book.challenge_id}`)
  return { success: true }
}

export async function updateBookDetails(bookId: string, title: string, author: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  if (!title || !author) {
    return { error: 'Título y autor son obligatorios' }
  }

  const { data: book } = await supabase
    .from('books')
    .select('id, challenge_id')
    .eq('id', bookId)
    .single()

  if (!book) {
    return { error: 'Libro no encontrado' }
  }

  const { data: challenge } = await supabase
    .from('challenges')
    .select('id')
    .eq('id', book.challenge_id)
    .eq('user_id', user.id)
    .single()

  if (!challenge) {
    return { error: 'No autorizado' }
  }

  const { data, error } = await supabase
    .from('books')
    .update({ title, author })
    .eq('id', bookId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/challenges/${book.challenge_id}`)
  return { data }
}