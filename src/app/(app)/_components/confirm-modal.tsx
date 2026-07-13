'use client'

import type { ReactNode } from 'react'

export function ConfirmModal({
  open,
  title,
  message,
  warning,
  confirmLabel,
  onCancel,
  onConfirm,
  loading = false,
  danger = true,
}: {
  open: boolean
  title: string
  message: ReactNode
  warning?: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
  loading?: boolean
  danger?: boolean
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-paper-dark rounded-xl border border-warm-gray/60 p-5 sm:p-6 relative overflow-hidden shadow-xl animate-fade-in-up">
        <div className={`absolute top-0 inset-x-0 h-0.5 ${danger ? 'bg-burgundy/50' : 'bg-gold/50'}`} />
        <h2 className="font-serif text-xl text-ink font-semibold mb-1">{title}</h2>
        <div className="text-sm text-ink-light mb-2">{message}</div>
        {warning && (
          <p className="text-sm text-burgundy mb-5">{warning}</p>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-warm-gray/40">
          <button
            onClick={onCancel}
            className="text-sm text-ink-light hover:text-gold-dark transition-colors py-2"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-6 py-2.5 text-white rounded-lg font-medium disabled:opacity-50 transition-all text-sm ${
              danger ? 'bg-burgundy hover:bg-burgundy/80' : 'bg-ink hover:bg-gold hover:text-ink'
            }`}
          >
            {loading ? 'Cargando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
