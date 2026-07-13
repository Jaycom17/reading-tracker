import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import CommunityDetailClient from './community-detail-client'

export default async function CommunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: community } = await supabase
    .from('communities')
    .select('id')
    .eq('id', id)
    .single()

  if (!community) notFound()

  return <CommunityDetailClient communityId={id} currentUserId={user.id} />
}
