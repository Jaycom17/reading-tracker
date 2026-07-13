'use client'

import { useState, useMemo } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { getOrCreateProfile } from '@/actions/profiles'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      ),
    []
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setError('Cuenta creada. Revisa tu email para confirmar.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        await getOrCreateProfile()
        window.location.href = '/'
      }
    } catch {
      setError('Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper flex">
      <div className="hidden lg:flex lg:w-1/2 bg-ink relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #C9A84C 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }} />
        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 rounded-2xl bg-gold/15 flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h1 className="font-serif text-4xl text-paper font-semibold mb-3">Reading Tracker</h1>
          <p className="text-paper/50 text-lg max-w-sm mx-auto leading-relaxed">
            Tu diario de lectura personal. Establece retos, sigue tu progreso y celebra cada libro completado.
          </p>
          <div className="mt-12 flex justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-serif text-gold font-semibold">Retos</div>
              <div className="text-paper/40 text-sm mt-1">Personalizados</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-serif text-gold font-semibold">Progreso</div>
              <div className="text-paper/40 text-sm mt-1">Visual</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-serif text-gold font-semibold">Logros</div>
              <div className="text-paper/40 text-sm mt-1">Compartibles</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-10">
            <div className="w-14 h-14 rounded-xl bg-gold/15 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h1 className="font-serif text-2xl text-ink font-semibold">Reading Tracker</h1>
          </div>

          <h2 className="font-serif text-3xl text-ink font-semibold mb-2">
            {isSignUp ? 'Crear cuenta' : 'Bienvenido'}
          </h2>
          <p className="text-ink-light mb-8">
            {isSignUp ? 'Regístrate para empezar' : 'Inicia sesión en tu cuenta'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-burgundy/8 border border-burgundy/25 text-burgundy px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-lg text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-lg text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 bg-ink text-paper rounded-lg font-medium hover:bg-gold hover:text-ink disabled:opacity-50 disabled:hover:bg-ink disabled:hover:text-paper transition-all"
            >
              {loading ? 'Cargando...' : isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>

            <div className="text-center text-sm text-ink-light">
              {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError('') }}
                className="font-medium text-gold-dark hover:text-gold transition-colors"
              >
                {isSignUp ? 'Iniciar sesión' : 'Registrarse'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
