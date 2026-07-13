import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { FONTS_CSS } from '@/lib/achievement-fonts'

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1) + '…' : text
}

function generateBookSvg(book: { title: string; author: string; completed_at: string | null }, challenge: { name: string }, userInitials: string): string {
  const title = truncate(escapeXml(book.title), 50)
  const author = truncate(escapeXml(book.author), 45)
  const completedDate = formatDate(book.completed_at || new Date().toISOString())
  const challengeName = truncate(escapeXml(challenge.name), 60)

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FDF8F3"/>
      <stop offset="50%" stop-color="#F5F0E8"/>
      <stop offset="100%" stop-color="#EDE4D8"/>
    </linearGradient>
    <linearGradient id="starGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#C9A84C"/>
      <stop offset="100%" stop-color="#E8D5A3"/>
    </linearGradient>
    <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="0.8" fill="#C9A84C" opacity="0.06"/>
    </pattern>
    <filter id="shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="16" flood-color="#1A1A2E" flood-opacity="0.08"/>
    </filter>
  </defs>

  <style>
    ${FONTS_CSS}
    .title { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; fill: #1A1A2E; }
    .book-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; fill: #7A2E3B; }
    .body-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; fill: #6B6B7D; }
    .small-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; fill: #6B6B7D; }
    .label { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600; fill: #8A9A7B; letter-spacing: 0.5px; text-transform: uppercase; }
    .footer-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600; fill: #1A1A2E; }
    .footer-sub { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; fill: #6B6B7D; }
    .divider { stroke: rgba(201,168,76,0.2); stroke-width: 1; }
    .star-text { font-size: 32px; fill: #FFFFFF; }
    .initials-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; font-weight: 700; fill: #FDF8F3; }
  </style>

  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  <rect width="1200" height="630" fill="url(#dots)"/>

  <rect x="300" y="65" width="600" height="500" rx="24" fill="rgba(255,255,255,0.7)" stroke="rgba(201,168,76,0.2)" stroke-width="1" filter="url(#shadow)"/>

  <rect x="300" y="65" width="600" height="3" rx="1.5" fill="#C9A84C" opacity="0.4"/>

  <circle cx="600" cy="140" r="36" fill="url(#starGrad)"/>
  <text x="600" y="149" text-anchor="middle" class="star-text">★</text>

  <text x="600" y="215" text-anchor="middle" class="title">¡Libro Completado!</text>

  <text x="600" y="258" text-anchor="middle" class="book-title">${title}</text>
  <text x="600" y="290" text-anchor="middle" class="body-text">por ${author}</text>

  <line x1="460" y1="325" x2="740" y2="325" class="divider"/>

  <text x="600" y="358" text-anchor="middle" class="label">Reto</text>
  <text x="600" y="384" text-anchor="middle" class="footer-title">${challengeName}</text>
  <text x="600" y="413" text-anchor="middle" class="small-text">Completado el ${completedDate}</text>

  <line x1="460" y1="443" x2="740" y2="443" class="divider"/>

  <circle cx="538" cy="485" r="22" fill="#1A1A2E"/>
  <text x="538" y="491" text-anchor="middle" class="initials-text">${escapeXml(userInitials)}</text>
  <text x="574" y="480" class="footer-title">Reading Tracker</text>
  <text x="574" y="498" class="footer-sub">Tu progreso de lectura</text>
</svg>`
}

function generateChallengeSvg(challenge: { name: string; goal: number; duration_weeks: number }, completedCount: number, booksList: string, userInitials: string): string {
  const name = truncate(escapeXml(challenge.name), 50)
  const booksSummary = `${completedCount} libro${completedCount !== 1 ? 's' : ''} completado${completedCount !== 1 ? 's' : ''}`
  const meta = `Meta: ${challenge.goal} libro${challenge.goal !== 1 ? 's' : ''} en ${challenge.duration_weeks} semana${challenge.duration_weeks !== 1 ? 's' : ''}`

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FDF8F3"/>
      <stop offset="50%" stop-color="#F5F0E8"/>
      <stop offset="100%" stop-color="#EDE4D8"/>
    </linearGradient>
    <linearGradient id="starGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#C9A84C"/>
      <stop offset="100%" stop-color="#E8D5A3"/>
    </linearGradient>
    <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="0.8" fill="#C9A84C" opacity="0.06"/>
    </pattern>
    <filter id="shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="16" flood-color="#1A1A2E" flood-opacity="0.08"/>
    </filter>
  </defs>

  <style>
    ${FONTS_CSS}
    .title { font-family: 'Playfair Display', serif; font-size: 40px; font-weight: 700; fill: #1A1A2E; }
    .challenge-name { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; fill: #7A2E3B; }
    .body-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; fill: #6B6B7D; }
    .small-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; fill: #6B6B7D; }
    .label { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600; fill: #8A9A7B; letter-spacing: 0.5px; text-transform: uppercase; }
    .footer-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600; fill: #1A1A2E; }
    .footer-sub { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; fill: #6B6B7D; }
    .books-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; fill: #1A1A2E; }
    .divider { stroke: rgba(201,168,76,0.2); stroke-width: 1; }
    .star-text { font-size: 32px; fill: #FFFFFF; }
    .initials-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; font-weight: 700; fill: #FDF8F3; }
  </style>

  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  <rect width="1200" height="630" fill="url(#dots)"/>

  <rect x="300" y="55" width="600" height="520" rx="24" fill="rgba(255,255,255,0.7)" stroke="rgba(201,168,76,0.2)" stroke-width="1" filter="url(#shadow)"/>

  <rect x="300" y="55" width="600" height="3" rx="1.5" fill="#C9A84C" opacity="0.4"/>

  <circle cx="600" cy="130" r="36" fill="url(#starGrad)"/>
  <text x="600" y="139" text-anchor="middle" class="star-text">★</text>

  <text x="600" y="200" text-anchor="middle" class="title">¡Reto Completado!</text>

  <text x="600" y="245" text-anchor="middle" class="challenge-name">${name}</text>
  <text x="600" y="278" text-anchor="middle" class="body-text">${escapeXml(meta)}</text>

  <line x1="460" y1="315" x2="740" y2="315" class="divider"/>

  <text x="600" y="348" text-anchor="middle" class="label">Finalizado</text>
  <text x="600" y="374" text-anchor="middle" class="footer-title">${formatDate(new Date().toISOString())}</text>
  <text x="600" y="402" text-anchor="middle" class="small-text">${booksSummary}</text>

  ${booksList ? `
  <line x1="460" y1="430" x2="740" y2="430" class="divider"/>
  <text x="600" y="458" text-anchor="middle" class="label">Libros leídos</text>
  <text x="600" y="480" text-anchor="middle" class="books-text">${escapeXml(booksList)}</text>` : ''}

  <line x1="460" y1="${booksList ? 510 : 462}" x2="740" y2="${booksList ? 510 : 462}" class="divider"/>

  <circle cx="538" cy="${booksList ? 540 : 490}" r="22" fill="#1A1A2E"/>
  <text x="538" y="${booksList ? 546 : 496}" text-anchor="middle" class="initials-text">${escapeXml(userInitials)}</text>
  <text x="574" y="${booksList ? 535 : 485}" class="footer-title">Reading Tracker</text>
  <text x="574" y="${booksList ? 553 : 503}" class="footer-sub">Tu progreso de lectura</text>
</svg>`
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const challengeId = searchParams.get('challenge_id')
    const bookId = searchParams.get('book_id')

    if (!challengeId) {
      return NextResponse.json({ error: 'challenge_id is required' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { data: challenge } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .eq('user_id', user.id)
      .single()

    if (!challenge) {
      return NextResponse.json({ error: 'Reto no encontrado' }, { status: 404 })
    }

    let book = null
    if (bookId) {
      const { data } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .eq('challenge_id', challengeId)
        .single()
      book = data
    }

    const { data: completedBooks } = await supabase
      .from('books')
      .select('*')
      .eq('challenge_id', challengeId)
      .eq('status', 'completado')

    const isChallengeComplete = (completedBooks?.length || 0) >= challenge.goal

    if (book && book.status !== 'completado') {
      return NextResponse.json({ error: 'El libro debe estar completado' }, { status: 400 })
    }

    if (!bookId && !isChallengeComplete) {
      return NextResponse.json({ error: 'El reto no está completado' }, { status: 400 })
    }

    const userInitials = user.email?.split('@')[0]?.toUpperCase().slice(0, 2) || 'RT'

    let svg: string
    if (book) {
      svg = generateBookSvg(book, challenge, userInitials)
    } else {
      const booksTitles = completedBooks?.map(b => b.title).join(', ') || ''
      const booksList = completedBooks && completedBooks.length > 6
        ? booksTitles.slice(0, 120) + '…'
        : (completedBooks?.length || 0) > 3
        ? booksTitles
        : ''
      svg = generateChallengeSvg(challenge, completedBooks?.length || 0, booksList, userInitials)
    }

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error al generar la imagen' }, { status: 500 })
  }
}
