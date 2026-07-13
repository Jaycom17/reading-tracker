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
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Retos de Lectura</h1>
          <Link
            href="/challenges/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Nuevo Reto
          </Link>
        </div>

        {challenges && challenges.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => (
              <Link key={challenge.id} href={`/challenges/${challenge.id}`} className="block">
                <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{challenge.name}</h2>
                  <p className="text-gray-600 mb-4">
                    Meta: {challenge.goal} libros en {challenge.duration_weeks} semanas
                  </p>
                  <div className="text-sm text-gray-500">
                    Creado: {new Date(challenge.created_at).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">No tienes retos aún</p>
            <Link
              href="/challenges/new"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Crear mi primer reto
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}