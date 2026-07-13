import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getWeekProgress = (createdAt: string, durationWeeks: number) => {
    const created = new Date(createdAt)
    const now = new Date()
    const diffMs = now.getTime() - created.getTime()
    const diffWeeks = Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000))
    return Math.min(Math.max(diffWeeks, 1), durationWeeks)
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Retos de Lectura</h1>
          <Link
            href="/challenges/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Nuevo Reto
          </Link>
        </div>

        {challenges && challenges.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => {
              const books = challenge.books || []
              const completedCount = books.filter((b: { status: string }) => b.status === 'completado').length
              const progress = challenge.goal > 0 ? Math.round((completedCount / challenge.goal) * 100) : 0
              const currentWeek = getWeekProgress(challenge.created_at, challenge.duration_weeks)
              const isTimeUp = currentWeek >= challenge.duration_weeks && progress < 100

              return (
                <Link key={challenge.id} href={`/challenges/${challenge.id}`} className="block">
                  <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">{challenge.name}</h2>
                      {isTimeUp && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Finalizado (tiempo agotado)
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">
                      Meta: {challenge.goal} libros en {challenge.duration_weeks} semanas
                    </p>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Progreso</span>
                        <span>{completedCount} / {challenge.goal} libros ({progress}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Semana {currentWeek} de {challenge.duration_weeks}</span>
                      <span>Creado: {formatDate(challenge.created_at)}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">Aún no tienes retos</p>
            <Link
              href="/challenges/new"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors inline-block"
            >
              Crear mi primer reto
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}