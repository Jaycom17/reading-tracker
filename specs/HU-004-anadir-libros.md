# HU-004: Añadir libros obligatorios al reto (título, autor)

**Prioridad:** Must
**Rol:** Como usuario que creó un reto
**Funcionalidad:** quiero añadir exactamente N libros (donde N = meta del reto) con título y autor
**Valor:** para definir mi plan de lectura completo antes de empezar

## Criterios de aceptación

- [ ] Escenario: Añadir libro tras crear reto
  - **Dado** reto "12 libros 2026" (meta=12) recién creado, 0 libros
  - **Cuando** voy a `/challenges/{id}/books/new`, ingreso "El Hobbit" + "J.R.R. Tolkien" y guardo
  - **Entonces** libro se crea con `status='por_leer'`, redirige a `/challenges/{id}`, veo "1 de 12 libros añadidos"

- [ ] Escenario: Añadir hasta completar la meta
  - **Dado** reto meta=3, ya tengo 2 libros
  - **Cuando** añado el 3º libro
  - **Entonces** se crea, veo "3 de 3 libros añadidos", botón "Añadir libro" se deshabilita/oculta

- [ ] Escenario: No permitir más libros que la meta
  - **Dado** reto meta=2, ya tengo 2 libros
  - **Cuando** intento acceder a `/books/new`
  - **Entonces** redirige a detalle con mensaje "Ya has añadido los 2 libros de tu meta"

- [ ] Escenario: Validación título obligatorio
  - **Dado** estoy en formulario añadir libro
  - **Cuando** dejo título vacío y guardo
  - **Entonces** error "El título es obligatorio", no guarda

- [ ] Escenario: Validación autor obligatorio
  - **Dado** estoy en formulario
  - **Cuando** dejo autor vacío y guardo
  - **Entonces** error "El autor es obligatorio", no guarda

- [ ] Escenario: Límites de caracteres
  - **Dado** ingreso título de 250 chars
  - **Cuando** intento guardar
  - **Entonces** error "Máximo 200 caracteres" (título), similar autor 200

- [ ] Escenario: Estado por defecto
  - **Dado** creo un libro nuevo
  - **Cuando** guardo
  - **Entonces** `status='por_leer'`, `notes=''`, `completed_at=null`

- [ ] Escenario: Múltiples libros en secuencia
  - **Dado** reto meta=3, 0 libros
  - **Cuando** añado 3 libros seguidos
  - **Entonces** cada uno redirige a detalle, contador sube 1→2→3, al 3º botón desaparece

## Fuera de alcance
- Buscar en catálogos externos (Google Books, Open Library) — Won't
- Añadir portada/ISBN/metadatos extra — Could
- Reordenar libros — Could
- Añadir libros después de empezar a leer (sí permitido mientras < meta)

## Notas / Restricciones
- Tabla `books`: `challenge_id` FK, `title` (200), `author` (200), `status` default 'por_leer'
- RLS: via challenge → user
- Server Action: `addBook(challengeId, { title, author })` → insert → revalidatePath
- UI: formulario simple (2 inputs + submit), validación cliente + servidor
- Redirect: a `/challenges/{id}` tras cada libro
- Contador visible en header del reto: "X de Y libros añadidos"