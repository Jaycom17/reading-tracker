import { ImageResponse } from '@vercel/og'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const fontData = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff2').then(res => res.arrayBuffer())
  const fontDataRegular = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff2').then(res => res.arrayBuffer())

  if (book) {
    return new ImageResponse(
      (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1e1e2e 0%, #313244 100%)',
          padding: '60px',
          fontFamily: 'Inter',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '600px',
            width: '100%',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #f5c2e7, #cba6f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '36px',
              fontWeight: 800,
              marginBottom: '16px',
              letterSpacing: '-0.5px',
            }}>
              ¡Libro Completado!
            </div>
            <div style={{ color: '#cdd6f4', fontSize: '28px', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>
              {book.title}
            </div>
            <div style={{ color: '#a6adc8', fontSize: '20px', marginBottom: '24px' }}>
              por {book.author}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', marginBottom: '24px' }}>
              <div style={{ color: '#6c7086', fontSize: '16px', marginBottom: '4px' }}>
                Reto: {challenge.name}
              </div>
              <div style={{ color: '#6c7086', fontSize: '16px' }}>
                Completado el {formatDate(book.completed_at || new Date().toISOString())}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #f5c2e7, #cba6f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '18px', color: '#1e1e2e'
              }}>
                {userInitials}
              </div>
              <div style={{ color: '#45475a', fontSize: '14px', textAlign: 'left' }}>
                <div style={{ fontWeight: 600 }}>Reading Tracker</div>
                <div>Tu progreso de lectura</div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: 'Inter', data: fontData, style: 'normal', weight: 700 },
          { name: 'Inter', data: fontDataRegular, style: 'normal', weight: 400 },
        ],
      }
    )
  } else {
    const booksList = completedBooks?.slice(0, 6).map(b => b.title).join(', ') || ''

    return new ImageResponse(
      (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1e1e2e 0%, #313244 100%)',
          padding: '60px',
          fontFamily: 'Inter',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '600px',
            width: '100%',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #a6e3a1, #f9e2af)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '40px',
              fontWeight: 800,
              marginBottom: '16px',
              letterSpacing: '-0.5px',
            }}>
              ¡Reto Completado!
            </div>
            <div style={{ color: '#cdd6f4', fontSize: '26px', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>
              {challenge.name}
            </div>
            <div style={{ color: '#a6adc8', fontSize: '18px', marginBottom: '24px' }}>
              Meta: {challenge.goal} libros en {challenge.duration_weeks} semanas
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', marginBottom: '24px' }}>
              <div style={{ color: '#6c7086', fontSize: '16px', marginBottom: '4px' }}>
                Finalizado el {formatDate(new Date().toISOString())}
              </div>
              <div style={{ color: '#6c7086', fontSize: '16px' }}>
                {completedBooks?.length || 0} libros completados
              </div>
            </div>
            {booksList && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', marginBottom: '24px' }}>
                <div style={{ color: '#a6e3a1', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Libros leídos:</div>
                <div style={{ color: '#cdd6f4', fontSize: '14px', lineHeight: 1.8 }}>
                  {booksList}{completedBooks && completedBooks.length > 6 ? ` y ${completedBooks.length - 6} más...` : ''}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #a6e3a1, #f9e2af)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '18px', color: '#1e1e2e'
              }}>
                {userInitials}
              </div>
              <div style={{ color: '#45475a', fontSize: '14px', textAlign: 'left' }}>
                <div style={{ fontWeight: 600 }}>Reading Tracker</div>
                <div>Tu progreso de lectura</div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: 'Inter', data: fontData, style: 'normal', weight: 700 },
          { name: 'Inter', data: fontDataRegular, style: 'normal', weight: 400 },
        ],
      }
    )
  }
}