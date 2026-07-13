# HU-008: Generar imagen de logro al completar libro

**Prioridad:** Must
**Rol:** Como usuario que terminó un libro
**Funcionalidad:** quiero generar una imagen bonita con la info del libro completado
**Valor:** para compartir mi logro o guardarlo como recuerdo visual

## Criterios de aceptación

- [ ] Escenario: Completar libro → botón "Generar logro"
  - **Dado** marco libro "El Hobbit" como "Completado" (toggle HU-006)
  - **Cuando** aparece toast/banner "¡Libro completado! Generar logro"
  - **Entonces** click lleva a `/challenges/{id}/achievement?book_id={bookId}`

- [ ] Escenario: Vista de logro de libro
  - **Dado** estoy en `/challenges/123/achievement?book_id=456`
  - **Cuando** carga la página
  - **Entonces** veo imagen generada con:
    - "¡Libro completado!" (badge)
    - Título: "El Hobbit"
    - Autor: "J.R.R. Tolkien"
    - Reto: "12 libros en 2026"
    - Fecha: "Completado el 15/03/2026"
    - Mi identificador (iniciales/email)
    - Fondo sencillo, tipografía limpia

- [ ] Escenario: Descargar imagen
  - **Dado** imagen de logro visible
  - **Cuando** click "Descargar PNG"
  - **Entonces** descarga `logro-libro-{titulo}-{fecha}.png` (ej. `logro-libro-el-hobbit-2026-03-15.png`)

- [ ] Escenario: Compartir (Web Share API)
  - **Dado** imagen generada en móvil
  - **Cuando** click "Compartir"
  - **Entonces** abre share sheet nativo con la imagen

- [ ] Escenario: Acceso directo sin completar
  - **Dado** intento acceder a `/achievement?book_id=X` sin completar el libro
  - **Cuando** cargo la página
  - **Entonces** redirige a detalle del reto con mensaje "El libro debe estar completado"

- [ ] Escenario: Solo mi libro
  - **Dado** intento acceder a logro de libro de otro usuario (manipulando URL)
  - **Cuando** cargo
  - **Entonces** 404 o redirige (RLS + verificación server)

## Fuera de alcance
- Plantillas personalizables / temas
- Animación / video
- Galería de logros históricos
- Compartir a redes específicas (solo Web Share API genérico)

## Notas / Restricciones
- Generación server-side (Canvas/Node-canvas o SVG → PNG via sharp) en Route Handler
- Ruta: `/challenges/[id]/achievement` (página) + API `/api/achievement/book?book_id=X`
- Verificaciones:
  - `book.challenge_id === challenge.id`
  - `challenge.user_id === auth.uid()`
  - `book.status === 'completado'`
- Cache: `no-store`, dynamic
- Responsive: 1200x630px (Open Graph) o 1080x1080 (Instagram)
- Librerías sugeridas: `@vercel/og` (Vercel OG Image) o `canvas` + `sharp`
- Sin base de datos para logros (generados on-demand)