'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar({
  userInitial,
  userName,
  userEmail,
}: {
  userInitial: string
  userName: string
  userEmail: string
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: 'Mis Retos', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
    { href: '/challenges/new', label: 'Nuevo Reto', icon: 'M12 4.5v15m7.5-7.5h-15' },
    { href: '/communities/new', label: 'Nueva Comunidad', icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z' },
    { href: '/profile', label: 'Mi Perfil', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
  ]

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/8">
        <Link href="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
          <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center group-hover:bg-gold/25 transition-colors">
            <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <div>
            <h1 className="font-serif text-lg text-paper font-semibold leading-tight">Reading</h1>
            <p className="text-xs text-paper/35">Tracker</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navLinks.map((link) => {
          const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all ${
                isActive
                  ? 'text-gold bg-gold/8'
                  : 'text-paper/60 hover:text-gold hover:bg-gold/8'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
              </svg>
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/8">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center text-gold text-sm font-semibold">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-paper/80 truncate">{userName}</p>
            <p className="text-[11px] text-paper/35 truncate">{userEmail}</p>
          </div>
        </div>
        <div className="mt-1 px-4">
          <form action="/auth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-paper/50 hover:text-gold transition-colors w-full rounded-lg hover:bg-gold/8"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="hidden lg:flex lg:w-64 lg:shrink-0">
        <aside className="fixed top-0 left-0 w-64 h-full bg-ink flex flex-col overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #C9A84C 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }} />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            {sidebarContent}
          </div>
        </aside>
      </div>

      <div className="lg:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between px-4 h-14 bg-paper border-b border-warm-gray/50">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center">
            <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <span className="font-serif text-base text-ink font-semibold">Reading Tracker</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-ink-light hover:text-ink hover:bg-warm-gray/50 transition-colors"
          aria-label="Abrir menú"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute top-0 left-0 w-72 h-full bg-ink flex flex-col overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <div className="w-full h-full" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, #C9A84C 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }} />
            </div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-end p-4 border-b border-white/8">
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-paper/50 hover:text-paper hover:bg-white/8 transition-colors"
                  aria-label="Cerrar menú"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {sidebarContent}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
