import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUserCommunities } from '@/actions/communities'

function CommunityCard({ community, index }: { community: { id: string; name: string; description: string; community_members: { id: string }[] }; index: number }) {
  return (
    <Link
      href={`/communities/${community.id}`}
      className="group block min-w-0 bg-white rounded-xl border border-warm-gray/50 hover:border-gold hover:shadow-lg hover:shadow-gold/8 transition-all animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="p-4 sm:p-5">
        <h3 className="font-serif text-lg text-ink font-semibold group-hover:text-gold-dark transition-colors truncate">
          {community.name}
        </h3>
        {community.description && (
          <p className="text-sm text-ink-light mt-1 line-clamp-2">{community.description}</p>
        )}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-warm-gray/40 text-xs text-ink-light">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          {community.community_members?.length || 0} miembro{(community.community_members?.length || 0) !== 1 ? 's' : ''}
        </div>
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-warm-gray/60 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-ink-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      </div>
      <h2 className="font-serif text-2xl text-ink font-semibold mb-2">Aún no tienes retos</h2>
      <p className="text-ink-light mb-8">Crea tu primer reto de lectura y empieza a trackear tu progreso.</p>
      <Link
        href="/challenges/new"
        className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-paper rounded-lg font-medium hover:bg-gold hover:text-ink transition-all"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Crear mi primer reto
      </Link>
    </div>
  )
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: challenges } = await supabase
    .from('challenges')
    .select(`
      *,
      books:books (
        id,
        status
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const communitiesResult = await getUserCommunities()
  const createdCommunities = communitiesResult.data?.created || []
  const joinedCommunities = communitiesResult.data?.joined || []

  const getWeekProgress = (createdAt: string, durationWeeks: number) => {
    const created = new Date(createdAt)
    const now = new Date()
    const diffMs = now.getTime() - created.getTime()
    const diffWeeks = Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000))
    return Math.min(Math.max(diffWeeks, 1), durationWeeks)
  }

  return (
    <div className="p-4 sm:p-8 lg:p-10 overflow-hidden">
      <div className="max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-10">
          <div>
            <h1 className="font-serif text-3xl text-ink font-semibold">Mis Retos</h1>
            <p className="text-ink-light mt-1">
              {challenges ? `${challenges.length} reto${challenges.length !== 1 ? 's' : ''} activo${challenges.length !== 1 ? 's' : ''}` : 'Carga tus retos de lectura'}
            </p>
          </div>
          <Link
            href="/challenges/new"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-paper rounded-lg font-medium hover:bg-gold hover:text-ink transition-all text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nuevo Reto
          </Link>
        </div>

        {challenges && challenges.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {challenges.map((challenge, index) => {
              const books = challenge.books || []
              const completedCount = books.filter((b: { status: string }) => b.status === 'completado').length
              const inProgressCount = books.filter((b: { status: string }) => b.status === 'en_progreso').length
              const progress = challenge.goal > 0 ? Math.round((completedCount / challenge.goal) * 100) : 0
              const currentWeek = getWeekProgress(challenge.created_at, challenge.duration_weeks)
              const isTimeUp = currentWeek >= challenge.duration_weeks && progress < 100
              const isComplete = completedCount >= challenge.goal

              return (
                <Link
                  key={challenge.id}
                  href={`/challenges/${challenge.id}`}
                  className="group block min-w-0 bg-white rounded-xl border border-warm-gray/50 hover:border-gold hover:shadow-lg hover:shadow-gold/8 transition-all animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h2 className="font-serif text-xl text-ink font-semibold truncate group-hover:text-gold-dark transition-colors">
                          {challenge.name}
                        </h2>
                        <p className="text-sm text-ink-light mt-0.5">
                          {challenge.goal} libro{challenge.goal !== 1 ? 's' : ''} · {challenge.duration_weeks} semana{challenge.duration_weeks !== 1 ? 's' : ''}
                        </p>
                      </div>
                      {isComplete && (
                        <span className="shrink-0 ml-3 px-3 py-1 bg-sage/10 text-sage text-xs font-medium rounded-full">
                          Completado
                        </span>
                      )}
                      {isTimeUp && (
                        <span className="shrink-0 ml-3 px-3 py-1 bg-burgundy/8 text-burgundy text-xs font-medium rounded-full">
                          Tiempo agotado
                        </span>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-ink-light">{completedCount} de {challenge.goal}</span>
                        <span className="font-medium text-ink">{progress}%</span>
                      </div>
                      <div className="h-2 bg-warm-gray/60 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            isComplete ? 'bg-sage' : 'bg-gold'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-warm-gray/40">
                      <div className="flex items-center gap-2 text-xs text-ink-light">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Semana {currentWeek}/{challenge.duration_weeks}
                      </div>
                      {inProgressCount > 0 && (
                        <div className="flex items-center gap-2 text-xs text-ink-light">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                          <span>{inProgressCount} en curso</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <EmptyState />
        )}

        <div className="mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="font-serif text-2xl text-ink font-semibold">Comunidades</h2>
              <p className="text-ink-light mt-1">
                {(createdCommunities.length + joinedCommunities.length) > 0
                  ? `${createdCommunities.length + joinedCommunities.length} comunidad${(createdCommunities.length + joinedCommunities.length) !== 1 ? 'es' : ''}`
                  : 'Únete o crea una comunidad'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/communities/join"
                className="inline-flex items-center gap-2 px-4 py-2 border border-warm-gray/60 text-ink rounded-lg font-medium hover:bg-warm-gray/30 transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Unirse
              </Link>
              <Link
                href="/communities/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-paper rounded-lg font-medium hover:bg-gold hover:text-ink transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Nueva
              </Link>
            </div>
          </div>

          {(createdCommunities.length > 0 || joinedCommunities.length > 0) ? (
            <div className="space-y-8">
              {createdCommunities.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-ink-light mb-3">Mis comunidades</h3>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {createdCommunities.map((community, index) => (
                      <CommunityCard key={community.id} community={community} index={index} />
                    ))}
                  </div>
                </div>
              )}

              {joinedCommunities.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-ink-light mb-3">Comunidades que sigo</h3>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    {joinedCommunities.map((community, index) => (
                      <CommunityCard key={community.id} community={community} index={index} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-warm-gray/50">
              <div className="w-12 h-12 rounded-xl bg-warm-gray/60 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-ink-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <p className="text-ink-light text-sm">No perteneces a ninguna comunidad</p>
              <Link
                href="/communities/join"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-ink text-paper rounded-lg font-medium hover:bg-gold hover:text-ink transition-all text-sm"
              >
                Unirse con código
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
