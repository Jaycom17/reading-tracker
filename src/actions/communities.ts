'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getProfilesByIds } from './profiles'

function generateAccessCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

async function isMember(supabase: ReturnType<typeof createClient>, communityId: string, userId: string) {
  const { data } = await supabase
    .from('community_members')
    .select('id')
    .eq('community_id', communityId)
    .eq('user_id', userId)
    .maybeSingle()
  return !!data
}

async function isCreator(supabase: ReturnType<typeof createClient>, communityId: string, userId: string) {
  const { data } = await supabase
    .from('communities')
    .select('id')
    .eq('id', communityId)
    .eq('creator_id', userId)
    .maybeSingle()
  return !!data
}

export async function createCommunity(name: string, description: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  if (!name || name.trim().length === 0) {
    return { error: 'El nombre es obligatorio' }
  }

  const accessCode = generateAccessCode()

  const { data: community, error: communityError } = await supabase
    .from('communities')
    .insert({
      name: name.trim(),
      description: description?.trim() || '',
      creator_id: user.id,
      access_code: accessCode,
    })
    .select()
    .single()

  if (communityError) {
    if (communityError.code === '23505') {
      return { error: 'Ya existe una comunidad con ese nombre' }
    }
    return { error: communityError.message }
  }

  const { error: memberError } = await supabase
    .from('community_members')
    .insert({
      community_id: community.id,
      user_id: user.id,
      role: 'creator',
    })

  if (memberError) {
    return { error: memberError.message }
  }

  revalidatePath('/')
  return { data: community }
}

export async function joinCommunity(accessCode: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  if (!accessCode || accessCode.trim().length === 0) {
    return { error: 'El código de acceso es obligatorio' }
  }

  const { data: community, error: communityError } = await supabase
    .from('communities')
    .select('id, name')
    .eq('access_code', accessCode.trim().toUpperCase())
    .maybeSingle()

  if (communityError || !community) {
    return { error: 'Código de acceso no válido' }
  }

  const existing = await isMember(supabase, community.id, user.id)
  if (existing) {
    return { error: 'Ya perteneces a esta comunidad' }
  }

  const { error: memberError } = await supabase
    .from('community_members')
    .insert({
      community_id: community.id,
      user_id: user.id,
      role: 'member',
    })

  if (memberError) {
    return { error: memberError.message }
  }

  revalidatePath('/')
  return { data: community }
}

export async function leaveCommunity(communityId: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  if (await isCreator(supabase, communityId, user.id)) {
    return { error: 'El creador no puede salirse. Debe transferir la propiedad o eliminar la comunidad' }
  }

  const { error } = await supabase
    .from('community_members')
    .delete()
    .eq('community_id', communityId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath(`/communities/${communityId}`)
  return { success: true }
}

export async function removeMember(communityId: string, userId: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  if (!(await isCreator(supabase, communityId, user.id))) {
    return { error: 'Solo el creador puede expulsar miembros' }
  }

  if (userId === user.id) {
    return { error: 'No puedes expulsarte a ti mismo' }
  }

  const { error } = await supabase
    .from('community_members')
    .delete()
    .eq('community_id', communityId)
    .eq('user_id', userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/communities/${communityId}`)
  return { success: true }
}

export async function assignBook(
  communityId: string,
  title: string,
  author: string,
  discussionStartDate: string
) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  if (!(await isCreator(supabase, communityId, user.id))) {
    return { error: 'Solo el creador puede asignar libros' }
  }

  if (!title || title.trim().length === 0) {
    return { error: 'El título es obligatorio' }
  }

  if (!author || author.trim().length === 0) {
    return { error: 'El autor es obligatorio' }
  }

  const { data, error } = await supabase
    .from('community_books')
    .insert({
      community_id: communityId,
      title: title.trim(),
      author: author.trim(),
      status: 'asignado',
      discussion_start_date: discussionStartDate || null,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/communities/${communityId}`)
  return { data }
}

export async function postComment(
  communityBookId: string,
  content: string,
  parentId?: string
) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  if (!content || content.trim().length === 0) {
    return { error: 'El comentario no puede estar vacío' }
  }

  if (content.length > 2000) {
    return { error: 'Máximo 2000 caracteres' }
  }

  const { data: book } = await supabase
    .from('community_books')
    .select('id, community_id, discussion_start_date')
    .eq('id', communityBookId)
    .maybeSingle()

  if (!book) {
    return { error: 'Libro no encontrado' }
  }

  if (!(await isMember(supabase, book.community_id, user.id))) {
    return { error: 'No eres miembro de esta comunidad' }
  }

  if (book.discussion_start_date) {
    const startDate = new Date(book.discussion_start_date)
    const now = new Date()
    if (startDate > now) {
      const formatted = startDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      return { error: `La discusión comenzará el ${formatted}` }
    }
  }

  const insertData: {
    community_book_id: string
    user_id: string
    content: string
    parent_id?: string
  } = {
    community_book_id: communityBookId,
    user_id: user.id,
    content: content.trim(),
  }

  if (parentId) {
    insertData.parent_id = parentId
  }

  const { data, error } = await supabase
    .from('community_comments')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/communities/${book.community_id}`)
  return { data }
}

export async function getCommunityMembers(communityId: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  if (!(await isMember(supabase, communityId, user.id))) {
    return { error: 'No eres miembro de esta comunidad' }
  }

  const { data: members, error } = await supabase
    .from('community_members')
    .select('id, user_id, role, joined_at')
    .eq('community_id', communityId)
    .order('joined_at', { ascending: true })

  if (error) {
    return { error: error.message }
  }

  if (!members || members.length === 0) {
    return { data: [] }
  }

  const userIds = members.map(m => m.user_id)
  const profilesResult = await getProfilesByIds(userIds)
  const profileMap = new Map<string, string>()
  if (profilesResult.data) {
    for (const p of profilesResult.data) {
      profileMap.set(p.id, p.display_name)
    }
  }

  const enriched = members.map(m => ({
    ...m,
    display_name: profileMap.get(m.user_id) || 'Usuario',
  }))

  return { data: enriched }
}

export async function getBookComments(communityBookId: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  const { data: comments, error } = await supabase
    .from('community_comments')
    .select('id, content, parent_id, created_at, user_id')
    .eq('community_book_id', communityBookId)
    .order('created_at', { ascending: true })

  if (error) {
    return { error: error.message }
  }

  if (!comments || comments.length === 0) {
    return { data: [] }
  }

  const userIds = [...new Set(comments.map(c => c.user_id))]
  const profilesResult = await getProfilesByIds(userIds)
  const profileMap = new Map<string, string>()
  if (profilesResult.data) {
    for (const p of profilesResult.data) {
      profileMap.set(p.id, p.display_name)
    }
  }

  const enriched = comments.map(c => ({
    ...c,
    display_name: profileMap.get(c.user_id) || 'Usuario',
  }))

  return { data: enriched }
}

export async function getCommunityBooks(communityId: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  if (!(await isMember(supabase, communityId, user.id))) {
    return { error: 'No eres miembro de esta comunidad' }
  }

  const { data, error } = await supabase
    .from('community_books')
    .select('*')
    .eq('community_id', communityId)
    .order('created_at', { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function getUserCommunities() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  const { data: memberships, error: memberError } = await supabase
    .from('community_members')
    .select('community_id, role')
    .eq('user_id', user.id)

  if (memberError) {
    return { error: memberError.message }
  }

  if (!memberships || memberships.length === 0) {
    return { data: { created: [], joined: [] } }
  }

  const createdIds = memberships.filter(m => m.role === 'creator').map(m => m.community_id)
  const joinedIds = memberships.filter(m => m.role === 'member').map(m => m.community_id)

  const allIds = [...new Set([...createdIds, ...joinedIds])]

  const { data: communities, error: communityError } = await supabase
    .from('communities')
    .select(`
      *,
      community_members (id, user_id, role)
    `)
    .in('id', allIds)

  if (communityError) {
    return { error: communityError.message }
  }

  const created = (communities || []).filter(c => createdIds.includes(c.id))
  const joined = (communities || []).filter(c => joinedIds.includes(c.id))

  return { data: { created, joined } }
}

export async function getCommunityById(communityId: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  if (!(await isMember(supabase, communityId, user.id))) {
    return { error: 'No eres miembro de esta comunidad' }
  }

  const { data: community, error: communityError } = await supabase
    .from('communities')
    .select('*')
    .eq('id', communityId)
    .maybeSingle()

  if (communityError || !community) {
    return { error: 'Comunidad no encontrada' }
  }

  const { data: members } = await supabase
    .from('community_members')
    .select('id, user_id, role, joined_at')
    .eq('community_id', communityId)
    .order('joined_at', { ascending: true })

  const { data: books } = await supabase
    .from('community_books')
    .select('*')
    .eq('community_id', communityId)
    .order('created_at', { ascending: false })

  let enrichedMembers: any[] = []
  if (members && members.length > 0) {
    const userIds = members.map(m => m.user_id)
    const profilesResult = await getProfilesByIds(userIds)
    const profileMap = new Map<string, string>()
    if (profilesResult.data) {
      for (const p of profilesResult.data) {
        profileMap.set(p.id, p.display_name)
      }
    }
    enrichedMembers = members.map(m => ({
      ...m,
      display_name: profileMap.get(m.user_id) || 'Usuario',
    }))
  }

  return {
    data: {
      ...community,
      community_members: enrichedMembers,
      community_books: books || [],
    },
  }
}
