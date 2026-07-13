import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Sidebar from './_components/sidebar'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  let userName = user.email?.split('@')[0] || 'Usuario'
  let userInitial = userName.charAt(0).toUpperCase()

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.display_name) {
    userName = profile.display_name
    userInitial = profile.display_name.charAt(0).toUpperCase()
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar
        userInitial={userInitial}
        userName={userName}
        userEmail={user.email || ''}
      />

      <main className="flex-1 min-h-screen pt-14 lg:pt-0 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
