'use client'

import { useState } from 'react'

interface Props {
  imageUrl: string
  fileName: string
}

export function DownloadButton({ imageUrl, fileName }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      const res = await fetch(imageUrl)
      const svgText = await res.text()

      const blob = new Blob([svgText], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)

      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 1200
        canvas.height = 630
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, 1200, 630)

        canvas.toBlob((pngBlob) => {
          if (pngBlob) {
            const pngUrl = URL.createObjectURL(pngBlob)
            const a = document.createElement('a')
            a.href = pngUrl
            a.download = `${fileName}-${new Date().toISOString().slice(0, 10)}.png`
            a.click()
            URL.revokeObjectURL(pngUrl)
          }
          URL.revokeObjectURL(url)
          setLoading(false)
        }, 'image/png')
      }
      img.onerror = () => {
        const a = document.createElement('a')
        a.href = url
        a.download = `${fileName}-${new Date().toISOString().slice(0, 10)}.svg`
        a.click()
        URL.revokeObjectURL(url)
        setLoading(false)
      }
      img.src = url
    } catch {
      const a = document.createElement('a')
      a.href = imageUrl
      a.download = `${fileName}-${new Date().toISOString().slice(0, 10)}.svg`
      a.click()
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-ink text-paper rounded-lg font-medium hover:bg-gold hover:text-ink disabled:opacity-50 disabled:hover:bg-ink disabled:hover:text-paper transition-all w-full sm:w-auto"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      {loading ? 'Generando...' : 'Descargar imagen'}
    </button>
  )
}
