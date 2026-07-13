'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function getOrCreateProfile(displayName?: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  const { data: existing } = await supabase
    .from('profiles')
    .select('id, display_name')
    .eq('id', user.id)
    .maybeSingle()

  if (existing) {
    if (displayName && displayName.trim() && existing.display_name !== displayName.trim()) {
      await supabase
        .from('profiles')
        .update({ display_name: displayName.trim() })
        .eq('id', user.id)
      return { data: { id: user.id, display_name: displayName.trim() } }
    }
    return { data: existing }
  }

  const name = displayName?.trim() || user.email?.split('@')[0] || 'Usuario'
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: user.id, display_name: name })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function updateProfile(displayName: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  if (!displayName || displayName.trim().length === 0) {
    return { error: 'El nombre es obligatorio' }
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, display_name: displayName.trim() })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function getProfilesByIds(ids: string[]) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (ids.length === 0) {
    return { data: [] }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name')
    .in('id', ids)

  if (error) {
    return { error: error.message }
  }

  return { data }
}
