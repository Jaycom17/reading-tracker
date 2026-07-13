'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { updateBookStatus, updateBookNotes, updateBookDetails, deleteBook } from '@/actions/books'
import { updateChallenge, deleteChallenge } from '@/actions/challenges'
import { createClient } from '@/lib/supabase/client'

interface Book {
  id: string
  title: string
  author: string
  status: 'por_leer' | 'en_progreso' | 'completado'
  notes: string | null
  completed_at: string | null
  created_at: string
}

interface Challenge {
  id: string
  name: string
  goal: number
  duration_weeks: number
  created_at: string
}

const statusConfig = {
  por_leer: { label: 'Por leer', color: 'text-ink-light', bg: 'bg-warm-gray/60' },
  en_progreso: { label: 'Leyendo', color: 'text-gold-dark', bg: 'bg-gold/10' },
  completado: { label: 'Completado', color: 'text-sage', bg: 'bg-sage/10' },
} as const

function BookCard({ book, onStatusChange, onBookUpdated, onBookDeleted }: {
  book: Book
  onStatusChange: (bookId: string, status: string) => void
  onBookUpdated: (bookId: string, updates: Partial<Book>) => void
  onBookDeleted: (bookId: string) => void
}) {
  const config = statusConfig[book.status]
  const [toggling, setToggling] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(book.title)
  const [editAuthor, setEditAuthor] = useState(book.author)
  const [editNotes, setEditNotes] = useState(book.notes || '')
  const [savingNotes, setSavingNotes] = useState(false)
  const [savingDetails, setSavingDetails] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState('')

  const handleToggle = async () => {
    setToggling(true)
    const result = await updateBookStatus(book.id)
    if (result.data) {
      onStatusChange(book.id, result.data.status)
    }
    setToggling(false)
  }

  const handleSaveNotes = async () => {
    if (editNotes === (book.notes || '')) return
    setSavingNotes(true)
    setError('')
    const result = await updateBookNotes(book.id, editNotes)
    if (result.error) {
      setError(result.error)
    } else {
      onBookUpdated(book.id, { notes: editNotes })
    }
    setSavingNotes(false)
  }

  const handleSaveDetails = async () => {
    if (!editTitle.trim() || !editAuthor.trim()) {
      setError('Título y autor son obligatorios')
      return
    }
    setSavingDetails(true)
    setError('')
    const result = await updateBookDetails(book.id, editTitle.trim(), editAuthor.trim())
    if (result.error) {
      setError(result.error)
    } else {
      onBookUpdated(book.id, { title: editTitle.trim(), author: editAuthor.trim() })
      setIsEditing(false)
    }
    setSavingDetails(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    setError('')
    const result = await deleteBook(book.id)
    if (result.error) {
      setError(result.error)
      setShowDeleteConfirm(false)
    } else {
      onBookDeleted(book.id)
    }
    setDeleting(false)
  }

  const circleClass = book.status === 'completado'
    ? 'bg-sage border-sage text-white'
    : book.status === 'en_progreso'
    ? 'border-gold text-gold-dark'
    : 'border-warm-gray text-ink-light/40 hover:border-gold hover:text-gold hover:bg-gold/5'

  return (
    <div className="bg-white rounded-xl border border-warm-gray/50 p-4 sm:p-5 hover:border-gold/50 transition-all flex flex-col">
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`shrink-0 mt-0.5 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${toggling ? 'opacity-50' : ''} ${circleClass}`}
          title={`Cambiar a ${book.status === 'por_leer' ? 'en progreso' : book.status === 'en_progreso' ? 'completado' : 'por leer'}`}
        >
          <span className="text-xs">{book.status === 'completado' ? '✓' : book.status === 'en_progreso' ? '◐' : ''}</span>
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-1.5">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                maxLength={200}
                placeholder="Título"
                className="w-full px-2 py-1 text-sm border border-warm-gray rounded text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
              />
              <input
                type="text"
                value={editAuthor}
                onChange={(e) => setEditAuthor(e.target.value)}
                maxLength={200}
                placeholder="Autor"
                className="w-full px-2 py-1 text-sm border border-warm-gray rounded text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
              />
            </div>
          ) : (
            <div>
              <h3 className={`font-medium text-sm leading-tight ${book.status === 'completado' ? 'text-ink-light line-through decoration-sage/30' : 'text-ink'}`}>
                {book.title}
              </h3>
              <p className="text-xs text-ink-light mt-0.5">{book.author}</p>
            </div>
          )}

          <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded-full ${config.bg} ${config.color}`}>
            {config.label}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-warm-gray/30 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-ink-light/60 font-medium">Notas</span>
          {savingNotes && <span className="text-xs text-gold-dark italic">guardando...</span>}
        </div>
        <textarea
          value={editNotes}
          onChange={(e) => setEditNotes(e.target.value)}
          onBlur={handleSaveNotes}
          placeholder="Escribe tus notas, impresiones o citas..."
          rows={3}
          maxLength={5000}
          className="w-full px-3 py-2 text-xs bg-warm-gray/20 border border-transparent rounded-lg text-ink placeholder-ink-light/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold focus:bg-white transition-all resize-none"
        />
        {error && <p className="text-xs text-burgundy mt-1">{error}</p>}
      </div>

      <div className="mt-3 pt-3 border-t border-warm-gray/30 flex items-center justify-between min-h-[32px]">
        <div className="flex items-center gap-2">
          {book.completed_at && (
            <span className="text-xs text-ink-light/50">
              {format(new Date(book.completed_at), "d MMM", { locale: es })}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <button
                onClick={() => { setIsEditing(false); setEditTitle(book.title); setEditAuthor(book.author); setError('') }}
                className="px-2 py-1 text-xs text-ink-light hover:text-gold-dark transition-colors rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveDetails}
                disabled={savingDetails}
                className="px-3 py-1 text-xs bg-ink text-paper rounded-md font-medium hover:bg-gold hover:text-ink disabled:opacity-50 transition-all"
              >
                {savingDetails ? '...' : 'Guardar'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { setIsEditing(true); setEditTitle(book.title); setEditAuthor(book.author); setError('') }}
                className="p-1.5 text-ink-light/40 hover:text-gold-dark transition-colors rounded-lg hover:bg-warm-gray/30"
                title="Editar libro"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
              {book.status !== 'completado' && (
                <>
                  {showDeleteConfirm ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="px-2 py-1 text-xs text-white bg-burgundy rounded-md font-medium hover:bg-burgundy/80 disabled:opacity-50 transition-all"
                      >
                        {deleting ? '...' : 'Eliminar'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-2 py-1 text-xs text-ink-light hover:text-gold-dark transition-colors rounded"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="p-1.5 text-ink-light/40 hover:text-burgundy transition-colors rounded-lg hover:bg-burgundy/8"
                      title="Eliminar libro"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ChallengeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editName, setEditName] = useState('')
  const [editGoal, setEditGoal] = useState('')
  const [editDuration, setEditDuration] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState('')
  const [currentWeek, setCurrentWeek] = useState<number | null>(null)

  useEffect(() => {
    if (!challenge) return
    const created = new Date(challenge.created_at)
    const now = new Date()
    const diffMs = now.getTime() - created.getTime()
    const diffWeeks = Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000))
    setCurrentWeek(Math.min(Math.max(diffWeeks, 1), challenge.duration_weeks))
  }, [challenge])

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: challengeData } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (!challengeData) {
        setError('Reto no encontrado')
        setLoading(false)
        return
      }

      const { data: booksData } = await supabase
        .from('books')
        .select('*')
        .eq('challenge_id', id)
        .order('created_at', { ascending: true })

      setChallenge(challengeData)
      setBooks(booksData || [])
      setLoading(false)
    }

    fetchData()
  }, [id, router])

  const handleOpenEdit = useCallback(() => {
    if (!challenge) return
    setEditName(challenge.name)
    setEditGoal(challenge.goal.toString())
    setEditDuration(challenge.duration_weeks.toString())
    setActionError('')
    setShowEditModal(true)
  }, [challenge])

  const handleSaveEdit = async () => {
    if (!challenge) return
    setActionError('')
    setSavingEdit(true)
    const hasBooks = books.length > 0
    const result = await updateChallenge(
      challenge.id,
      editName,
      hasBooks ? undefined : parseInt(editGoal),
      hasBooks ? undefined : parseInt(editDuration)
    )
    if (result.error) {
      setActionError(result.error)
    } else if (result.data) {
      setChallenge(result.data)
      setShowEditModal(false)
    }
    setSavingEdit(false)
  }

  const handleDeleteChallenge = async () => {
    if (!challenge) return
    setDeleting(true)
    const result = await deleteChallenge(challenge.id)
    if (result.error) {
      setActionError(result.error)
    } else {
      router.push('/')
    }
    setDeleting(false)
  }

  const handleStatusChange = useCallback((bookId: string, newStatus: string) => {
    setBooks(prev => prev.map(b =>
      b.id === bookId
        ? { ...b, status: newStatus as Book['status'], completed_at: newStatus === 'completado' ? new Date().toISOString() : null }
        : b
    ))
  }, [])

  const handleBookUpdated = useCallback((bookId: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, ...updates } : b))
  }, [])

  const handleBookDeleted = useCallback((bookId: string) => {
    setBooks(prev => prev.filter(b => b.id !== bookId))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-warm-gray/60 rounded" />
            <div className="h-4 w-48 bg-warm-gray/60 rounded" />
            <div className="h-32 bg-warm-gray/40 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-4xl mx-auto text-center">
          <p className="text-ink-light mb-4">{error || 'Reto no encontrado'}</p>
          <Link href="/" className="text-gold-dark hover:text-gold transition-colors">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  const completedCount = books.filter(b => b.status === 'completado').length
  const inProgressCount = books.filter(b => b.status === 'en_progreso').length
  const progress = challenge.goal > 0 ? Math.round((completedCount / challenge.goal) * 100) : 0
  const isChallengeComplete = completedCount >= challenge.goal
  const canAddMore = books.length < challenge.goal

  const isTimeUp = currentWeek !== null && currentWeek >= challenge.duration_weeks && !isChallengeComplete

  return (
    <div className="min-h-screen flex justify-center px-4 sm:px-6 lg:px-10 pt-4 lg:pt-6 pb-10">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8 mt-4 lg:mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-ink-light hover:text-gold-dark transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Mis Retos
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <h1 className="font-serif text-3xl text-ink font-semibold">{challenge.name}</h1>
                <button
                  onClick={handleOpenEdit}
                  className="p-2 text-ink-light/30 hover:text-gold-dark transition-colors rounded-lg hover:bg-warm-gray/30"
                  title="Editar reto"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <button
                  onClick={() => { setShowDeleteConfirm(true); setActionError('') }}
                  className="p-2 text-ink-light/30 hover:text-burgundy transition-colors rounded-lg hover:bg-burgundy/8"
                  title="Eliminar reto"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
              <p className="text-ink-light mt-1">
                {challenge.goal} libro{challenge.goal !== 1 ? 's' : ''} en {challenge.duration_weeks} semana{challenge.duration_weeks !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {canAddMore && (
                <Link
                  href={`/challenges/${id}/books/new`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-ink text-paper rounded-lg font-medium hover:bg-gold hover:text-ink transition-all text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Añadir libro
                </Link>
              )}
              {isChallengeComplete && (
                <Link
                  href={`/challenges/${id}/achievement`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sage text-white rounded-lg font-medium hover:bg-sage/80 transition-all text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.77.896m0 0a6 6 0 01-2.77-.896" />
                  </svg>
                  Logro del reto
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-warm-gray/50 p-4 sm:p-6 mb-6 sm:mb-8 relative overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)] animate-fade-in-up">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gold/50" />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-serif font-semibold text-ink">{completedCount}</span>
              <span className="text-sm text-ink-light">de {challenge.goal} libros</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-warm-gray/60" />
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-ink-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-ink-light">Semana {currentWeek ?? '--'}/{challenge.duration_weeks}</span>
            </div>
            {isTimeUp && (
              <span className="px-3 py-1 bg-burgundy/8 text-burgundy text-xs font-medium rounded-full">
                Tiempo agotado
              </span>
            )}
            {isChallengeComplete && (
              <span className="px-3 py-1 bg-sage/10 text-sage text-xs font-medium rounded-full">
                ¡Reto completado!
              </span>
            )}
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-ink-light">Progreso</span>
              <span className="font-medium text-ink">{progress}%</span>
            </div>
            <div className="h-3 bg-warm-gray/60 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  isChallengeComplete ? 'bg-sage' : 'bg-gold'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl text-ink font-semibold">
              Libros
              <span className="text-sm font-sans font-normal text-ink-light ml-2">
                ({books.length})
              </span>
            </h2>
            {inProgressCount > 0 && (
              <span className="text-sm text-ink-light">{inProgressCount} leyendo</span>
            )}
          </div>

          {books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onStatusChange={handleStatusChange}
                  onBookUpdated={handleBookUpdated}
                  onBookDeleted={handleBookDeleted}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-warm-gray/50">
              <div className="w-12 h-12 rounded-xl bg-warm-gray/60 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-ink-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <p className="text-ink-light mb-1">No hay libros aún</p>
              {canAddMore && (
                <Link
                  href={`/challenges/${id}/books/new`}
                  className="text-sm text-gold-dark hover:text-gold transition-colors"
                >
                  Añade el primer libro
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-paper-dark rounded-xl border border-warm-gray/60 p-5 sm:p-6 relative overflow-hidden shadow-xl animate-fade-in-up">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gold/50" />
            <h2 className="font-serif text-xl text-ink font-semibold mb-1">Editar reto</h2>
            <p className="text-sm text-ink-light mb-5">
              {books.length > 0
                ? 'El reto tiene libros — solo puedes cambiar el nombre.'
                : 'Puedes modificar todos los campos.'}
            </p>

            {actionError && (
              <div className="bg-burgundy/8 border border-burgundy/25 text-burgundy px-4 py-3 rounded-lg text-sm mb-4">
                {actionError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Nombre del reto</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={200}
                  className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-lg text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Meta de libros</label>
                <input
                  type="number"
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value)}
                  min="1"
                  disabled={books.length > 0}
                  className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-lg text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {books.length > 0 && (
                  <p className="text-xs text-ink-light/60 mt-1">No se puede cambiar la meta porque el reto ya tiene libros.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Duración (semanas)</label>
                <input
                  type="number"
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  min="1"
                  disabled={books.length > 0}
                  className="w-full px-4 py-2.5 bg-white border border-warm-gray rounded-lg text-ink placeholder-ink-light/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {books.length > 0 && (
                  <p className="text-xs text-ink-light/60 mt-1">No se puede cambiar la duración porque el reto ya tiene libros.</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-warm-gray/40">
              <button
                onClick={() => setShowEditModal(false)}
                className="text-sm text-ink-light hover:text-gold-dark transition-colors py-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="px-6 py-2.5 bg-ink text-paper rounded-lg font-medium hover:bg-gold hover:text-ink disabled:opacity-50 disabled:hover:bg-ink disabled:hover:text-paper transition-all text-sm"
              >
                {savingEdit ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-paper-dark rounded-xl border border-warm-gray/60 p-5 sm:p-6 relative overflow-hidden shadow-xl animate-fade-in-up">
            <div className="absolute top-0 inset-x-0 h-0.5 bg-burgundy/50" />
            <h2 className="font-serif text-xl text-ink font-semibold mb-1">Eliminar reto</h2>
            <p className="text-sm text-ink-light mb-2">
              ¿Estás seguro de que quieres eliminar <strong>{challenge.name}</strong>?
            </p>
            <p className="text-sm text-burgundy mb-5">
              Se eliminarán todos los libros asociados. Esta acción no se puede deshacer.
            </p>

            {actionError && (
              <div className="bg-burgundy/8 border border-burgundy/25 text-burgundy px-4 py-3 rounded-lg text-sm mb-4">
                {actionError}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-warm-gray/40">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-sm text-ink-light hover:text-gold-dark transition-colors py-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteChallenge}
                disabled={deleting}
                className="px-6 py-2.5 bg-burgundy text-white rounded-lg font-medium hover:bg-burgundy/80 disabled:opacity-50 transition-all text-sm"
              >
                {deleting ? 'Eliminando...' : 'Eliminar reto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
