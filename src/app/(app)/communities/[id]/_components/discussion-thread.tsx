'use client'

import { useState } from 'react'

type Comment = {
  id: string
  content: string
  parent_id: string | null
  created_at: string
  user_id: string
  display_name: string
}

type CommentNode = Comment & { children: CommentNode[] }

export default function DiscussionThread({
  initialComments,
  loading,
  onPostComment,
}: {
  initialComments: Comment[]
  loading: boolean
  onPostComment: (content: string, parentId?: string) => Promise<void>
}) {
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function buildTree(comments: Comment[]): CommentNode[] {
    const map = new Map<string, CommentNode>()
    const roots: CommentNode[] = []

    for (const c of comments) {
      map.set(c.id, { ...c, children: [] })
    }

    for (const c of comments) {
      const node = map.get(c.id)!
      if (c.parent_id && map.has(c.parent_id)) {
        map.get(c.parent_id)!.children.push(node)
      } else {
        roots.push(node)
      }
    }

    return roots
  }

  function getAuthorName(comment: Comment) {
    return comment.display_name || 'Usuario'
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim()) {
      setError('El comentario no puede estar vacío')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await onPostComment(newComment)
      setNewComment('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al publicar')
    }
    setSubmitting(false)
  }

  async function handleReply(parentId: string) {
    if (!replyContent.trim()) {
      setError('El comentario no puede estar vacío')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await onPostComment(replyContent, parentId)
      setReplyContent('')
      setReplyingTo(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al responder')
    }
    setSubmitting(false)
  }

  function renderComment(comment: CommentNode, depth: number = 0) {
    const created = new Date(comment.created_at)
    const timeStr = created.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    return (
      <div key={comment.id} className={depth > 0 ? 'ml-6 sm:ml-10' : ''}>
        <div className={`py-3 ${depth > 0 ? 'border-l-2 border-warm-gray/40 pl-4' : 'border-b border-warm-gray/30'}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-ink">{getAuthorName(comment)}</span>
            <span className="text-xs text-ink-light">{timeStr}</span>
          </div>
          <p className="text-sm text-ink whitespace-pre-wrap">{comment.content}</p>
          <button
            onClick={() => {
              setReplyingTo(replyingTo === comment.id ? null : comment.id)
              setReplyContent('')
            }}
            className="text-xs text-ink-light hover:text-gold-dark mt-1 transition-colors"
          >
            Responder
          </button>
        </div>

        {replyingTo === comment.id && (
          <div className="ml-4 sm:ml-10 my-2 pl-4 border-l-2 border-gold/40">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="flex-1 px-3 py-2 rounded-lg border border-warm-gray/60 bg-white text-ink text-sm placeholder:text-ink-light/50 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleReply(comment.id)
                  }
                }}
              />
              <button
                onClick={() => handleReply(comment.id)}
                disabled={submitting || !replyContent.trim()}
                className="px-3 py-2 bg-ink text-paper rounded-lg text-sm font-medium hover:bg-gold hover:text-ink transition-all disabled:opacity-50 sm:w-auto"
              >
                Enviar
              </button>
            </div>
          </div>
        )}

        {comment.children.length > 0 && (
          <div>
            {comment.children.map((child) => renderComment(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-paper-dark rounded-xl border border-warm-gray/60 p-4 sm:p-5 animate-pulse space-y-4">
        <div className="h-4 bg-warm-gray/40 rounded w-3/4" />
        <div className="h-4 bg-warm-gray/40 rounded w-1/2" />
        <div className="h-4 bg-warm-gray/40 rounded w-2/3" />
      </div>
    )
  }

  const tree = buildTree(initialComments)

  return (
    <div className="bg-paper-dark rounded-xl border border-warm-gray/60">
      <div className="p-4 sm:p-5">
        {tree.length === 0 ? (
          <p className="text-sm text-ink-light text-center py-6">Aún no hay comentarios. Sé el primero en comentar.</p>
        ) : (
          <div className="space-y-0">
            {tree.map((comment) => renderComment(comment))}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 border-t border-warm-gray/30">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value)
              setError('')
            }}
            placeholder="Escribe un comentario..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-warm-gray/60 bg-white text-ink text-sm placeholder:text-ink-light/50 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="px-4 py-2.5 bg-ink text-paper rounded-lg text-sm font-medium hover:bg-gold hover:text-ink transition-all disabled:opacity-50 sm:w-auto"
          >
            {submitting ? '...' : 'Enviar'}
          </button>
        </form>
        {error && <p className="text-xs text-burgundy mt-2">{error}</p>}
        <p className="text-xs text-ink-light mt-2">{newComment.length}/2000</p>
      </div>
    </div>
  )
}
