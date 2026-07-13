'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCommunityById, leaveCommunity, removeMember, assignBook, getBookComments, postComment } from '@/actions/communities'
import DiscussionThread from './_components/discussion-thread'

type CommunityData = {
  id: string
  name: string
  description: string
  creator_id: string
  access_code: string
  created_at: string
  community_members: {
    id: string
    user_id: string
    role: string
    joined_at: string
    display_name: string
  }[]
  community_books: {
    id: string
    title: string
    author: string
    status: string
    discussion_start_date: string | null
    created_at: string
  }[]
}

type Tab = 'books' | 'discussion' | 'members'

export default function CommunityDetailClient({
  communityId,
  currentUserId,
}: {
  communityId: string
  currentUserId: string
}) {
  const router = useRouter()
  const [community, setCommunity] = useState<CommunityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('books')
  const [error, setError] = useState('')

  const [bookTitle, setBookTitle] = useState('')
  const [bookAuthor, setBookAuthor] = useState('')
  const [bookDate, setBookDate] = useState('')
  const [bookError, setBookError] = useState('')
  const [bookLoading, setBookLoading] = useState(false)
  const [showBookForm, setShowBookForm] = useState(false)

  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [comments, setComments] = useState<any[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)

  const isCreator = community?.creator_id === currentUserId

  const loadCommunity = useCallback(async () => {
    const result = await getCommunityById(communityId)
    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }
    setCommunity(result.data as unknown as CommunityData)
    setLoading(false)
  }, [communityId])

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      const result = await getCommunityById(communityId)
      if (cancelled) return
      if (result.error) {
        setError(result.error)
      } else {
        setCommunity(result.data as unknown as CommunityData)
      }
      setLoading(false)
    }
    fetch()
    return () => { cancelled = true }
  }, [communityId])

  async function loadComments(bookId: string) {
    setSelectedBookId(bookId)
    setCommentsLoading(true)
    const result = await getBookComments(bookId)
    if (result.data) {
      setComments(result.data)
    }
    setCommentsLoading(false)
  }

  async function handleAssignBook(e: React.FormEvent) {
    e.preventDefault()
    setBookError('')
    setBookLoading(true)

    const result = await assignBook(communityId, bookTitle, bookAuthor, bookDate)

    if (result.error) {
      setBookError(result.error)
      setBookLoading(false)
      return
    }

    setBookTitle('')
    setBookAuthor('')
    setBookDate('')
    setBookLoading(false)
    setShowBookForm(false)
    loadCommunity()
  }

  async function handleLeave() {
    if (!confirm('¿Seguro que quieres salir de esta comunidad?')) return
    const result = await leaveCommunity(communityId)
    if (result.error) {
      alert(result.error)
      return
    }
    router.push('/')
    router.refresh()
  }

  async function handleRemoveMember(userId: string) {
    if (!confirm('¿Expulsar a este miembro?')) return
    const result = await removeMember(communityId, userId)
    if (result.error) {
      alert(result.error)
      return
    }
    loadCommunity()
  }

  async function handlePostComment(content: string, parentId?: string) {
    if (!selectedBookId) return
    const result = await postComment(selectedBookId, content, parentId)
    if (result.error) {
      throw new Error(result.error)
    }
    loadComments(selectedBookId)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-start sm:items-center justify-center p-4 sm:p-6 lg:p-10 pt-20 sm:pt-6 lg:pt-10">
        <div className="w-full max-w-4xl mx-auto animate-pulse space-y-4">
          <div className="h-8 bg-warm-gray/60 rounded w-1/3" />
          <div className="h-4 bg-warm-gray/40 rounded w-1/2" />
        </div>
      </div>
    )
  }

  if (error || !community) {
    return (
      <div className="min-h-screen flex items-start sm:items-center justify-center p-4 sm:p-6 lg:p-10 pt-20 sm:pt-6 lg:pt-10">
        <div className="w-full max-w-4xl mx-auto text-center py-20">
          <p className="text-burgundy">{error || 'Comunidad no encontrada'}</p>
          <Link href="/" className="text-sm text-ink-light hover:text-ink mt-4 inline-block">Volver al dashboard</Link>
        </div>
      </div>
    )
  }

  const members = community.community_members || []
  const books = community.community_books || []

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center p-4 sm:p-6 lg:p-10 pt-20 sm:pt-6 lg:pt-10">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-ink-light hover:text-gold-dark transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Volver
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl text-ink font-semibold">{community.name}</h1>
              {community.description && (
                <p className="text-ink-light mt-1">{community.description}</p>
              )}
              <p className="text-sm text-ink-light mt-2">
                {members.length} miembro{members.length !== 1 ? 's' : ''} · {books.length} libro{books.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isCreator && (
                <div className="px-3 py-1.5 bg-gold/10 text-gold-dark text-xs font-medium rounded-full">
                  Creador
                </div>
              )}
              {!isCreator && (
                <button
                  onClick={handleLeave}
                  className="px-4 py-2 text-sm text-burgundy border border-burgundy/20 rounded-lg hover:bg-burgundy/5 transition-colors"
                >
                  Salir
                </button>
              )}
            </div>
          </div>

          {isCreator && (
            <div className="mt-4 bg-paper-dark rounded-xl border border-warm-gray/60 p-4 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gold/50" />
              <p className="text-xs text-ink-light mb-1">Código de acceso para compartir</p>
              <p className="font-mono text-2xl tracking-[0.3em] text-ink font-semibold">{community.access_code}</p>
            </div>
          )}
        </div>

        <div className="flex gap-1 border-b border-warm-gray/50 mb-6 overflow-x-auto pb-px">
          {(['books', 'discussion', 'members'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px shrink-0 ${
                activeTab === tab
                  ? 'text-ink border-gold'
                  : 'text-ink-light border-transparent hover:text-ink'
              }`}
            >
              {tab === 'books' && 'Libros'}
              {tab === 'discussion' && 'Discusión'}
              {tab === 'members' && 'Miembros'}
            </button>
          ))}
        </div>

        {activeTab === 'books' && (
          <div className="space-y-4">
            {isCreator && !showBookForm && (
              <button
                onClick={() => setShowBookForm(true)}
                className="w-full bg-paper-dark rounded-xl border border-dashed border-warm-gray/80 p-5 text-center hover:border-gold/60 hover:bg-gold/5 transition-all group"
              >
                <div className="flex items-center justify-center gap-2 text-ink-light group-hover:text-gold-dark transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span className="font-medium">Asignar libro del mes</span>
                </div>
              </button>
            )}

            {isCreator && showBookForm && (
              <div className="bg-paper-dark rounded-xl border border-warm-gray/60 p-5 sm:p-6 relative overflow-hidden animate-fade-in-up">
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gold/50" />
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-serif text-lg text-ink font-semibold">Asignar libro del mes</h3>
                  <button
                    onClick={() => {
                      setShowBookForm(false)
                      setBookTitle('')
                      setBookAuthor('')
                      setBookDate('')
                      setBookError('')
                    }}
                    className="p-1.5 text-ink-light hover:text-ink rounded-lg hover:bg-warm-gray/30 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleAssignBook} className="space-y-4">
                  {bookError && (
                    <div className="bg-burgundy/8 border border-burgundy/25 text-burgundy px-4 py-3 rounded-lg text-sm">
                      {bookError}
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="bookTitle" className="block text-sm font-medium text-ink mb-1.5">
                        Título del libro
                      </label>
                      <input
                        type="text"
                        id="bookTitle"
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)}
                        required
                        placeholder="Ej: Cien años de soledad"
                        className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-lg text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="bookAuthor" className="block text-sm font-medium text-ink mb-1.5">
                        Autor
                      </label>
                      <input
                        type="text"
                        id="bookAuthor"
                        value={bookAuthor}
                        onChange={(e) => setBookAuthor(e.target.value)}
                        required
                        placeholder="Ej: Gabriel García Márquez"
                        className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-lg text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bookDate" className="block text-sm font-medium text-ink mb-1.5">
                      Fecha de discusión
                    </label>
                    <input
                      type="date"
                      id="bookDate"
                      value={bookDate}
                      onChange={(e) => setBookDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                    />
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-warm-gray/40">
                    <button
                      type="button"
                      onClick={() => {
                        setShowBookForm(false)
                        setBookTitle('')
                        setBookAuthor('')
                        setBookDate('')
                        setBookError('')
                      }}
                      className="text-sm text-ink-light hover:text-gold-dark transition-colors py-2"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={bookLoading}
                      className="px-6 py-2.5 bg-ink text-paper rounded-lg font-medium hover:bg-gold hover:text-ink disabled:opacity-50 disabled:hover:bg-ink disabled:hover:text-paper transition-all"
                    >
                      {bookLoading ? 'Asignando...' : 'Asignar libro'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {books.length === 0 ? (
              <div className="text-center py-12 bg-paper-dark rounded-xl border border-warm-gray/60">
                <p className="text-ink-light text-sm">Aún no hay libros asignados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="bg-paper-dark rounded-xl border border-warm-gray/60 p-5 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-medium text-ink">{book.title}</h4>
                      <p className="text-sm text-ink-light">{book.author}</p>
                      {book.discussion_start_date && (
                        <p className="text-xs text-ink-light mt-1">
                          Discusión: {new Date(book.discussion_start_date + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('discussion')
                        loadComments(book.id)
                      }}
                      className="px-4 py-2 text-sm text-ink border border-warm-gray/60 rounded-lg hover:bg-warm-gray/30 transition-colors"
                    >
                      Discutir
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'discussion' && (
          <div>
            {books.length === 0 ? (
              <div className="text-center py-12 bg-paper-dark rounded-xl border border-warm-gray/60">
                <p className="text-ink-light text-sm">Primero asigna un libro para empezar a discutir</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {books.map((book) => (
                    <button
                      key={book.id}
                      onClick={() => loadComments(book.id)}
                      className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedBookId === book.id
                          ? 'bg-ink text-paper'
                          : 'bg-paper-dark border border-warm-gray/60 text-ink hover:border-gold'
                      }`}
                    >
                      {book.title}
                    </button>
                  ))}
                </div>

                {selectedBookId && (
                  <DiscussionThread
                    initialComments={comments}
                    loading={commentsLoading}
                    onPostComment={handlePostComment}
                  />
                )}

                {!selectedBookId && (
                  <div className="text-center py-12 bg-paper-dark rounded-xl border border-warm-gray/60">
                    <p className="text-ink-light text-sm">Selecciona un libro para ver la discusión</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-2">
            {members.map((member) => {
              const name = member.display_name || 'Usuario'
              const initial = name.charAt(0).toUpperCase()
              return (
                <div
                  key={member.id}
                  className="bg-paper-dark rounded-xl border border-warm-gray/60 p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center text-gold text-sm font-semibold">
                      {initial}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{name}</p>
                      <p className="text-xs text-ink-light">
                        {member.role === 'creator' ? 'Creador' : 'Miembro'} · Se unió {new Date(member.joined_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                  {isCreator && member.user_id !== currentUserId && (
                    <button
                      onClick={() => handleRemoveMember(member.user_id)}
                      className="px-3 py-1.5 text-xs text-burgundy border border-burgundy/20 rounded-lg hover:bg-burgundy/5 transition-colors"
                    >
                      Expulsar
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
