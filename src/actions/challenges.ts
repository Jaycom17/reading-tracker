'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function createChallenge(name: string, goal: number, durationWeeks: number) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  if (!name || name.trim().length === 0) {
    return { error: 'El nombre es obligatorio' }
  }

  if (goal <= 0) {
    return { error: 'La meta debe ser mayor a 0' }
  }

  if (durationWeeks <= 0) {
    return { error: 'La duración debe ser mayor a 0' }
  }

  const { data, error } = await supabase
    .from('challenges')
    .insert({
      user_id: user.id,
      name: name.trim(),
      goal,
      duration_weeks: durationWeeks,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { data }
}

export async function getChallenges() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  const { data, error } = await supabase
    .from('challenges')
    .select(`
      *,
      books:books (id, status)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function getChallenge(challengeId: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  const { data: challenge, error: challengeError } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', challengeId)
    .eq('user_id', user.id)
    .single()

  if (challengeError || !challenge) {
    return { error: 'Reto no encontrado' }
  }

  const { data: books, error: booksError } = await supabase
    .from('books')
    .select('*')
    .eq('challenge_id', challengeId)
    .order('created_at', { ascending: true })

  if (booksError) {
    return { error: booksError.message }
  }

  return { data: { challenge, books: books || [] } }
}

export async function updateChallenge(
  challengeId: string,
  name: string,
  goal?: number,
  durationWeeks?: number
) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  if (!name || name.trim().length === 0) {
    return { error: 'El nombre es obligatorio' }
  }

  const { count } = await supabase
    .from('books')
    .select('*', { count: 'exact', head: true })
    .eq('challenge_id', challengeId)

  const hasBooks = (count ?? 0) > 0

  const updates: Record<string, string | number> = {
    name: name.trim(),
  }

  if (!hasBooks) {
    if (goal !== undefined) {
      if (goal <= 0) return { error: 'La meta debe ser mayor a 0' }
      updates.goal = goal
    }
    if (durationWeeks !== undefined) {
      if (durationWeeks <= 0) return { error: 'La duración debe ser mayor a 0' }
      updates.duration_weeks = durationWeeks
    }
  }

  const { data, error } = await supabase
    .from('challenges')
    .update(updates)
    .eq('id', challengeId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath(`/challenges/${challengeId}`)
  return { data }
}

export async function deleteChallenge(challengeId: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  const { error } = await supabase
    .from('challenges')
    .delete()
    .eq('id', challengeId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}