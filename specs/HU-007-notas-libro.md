# HU-007: Notas por libro (Markdown, no afecta progreso)

**Prioridad:** Must
**Rol:** Como usuario leyendo un libro
**Funcionalidad:** quiero añadir/editar notas en Markdown por libro
**Valor:** para recordar página actual, capítulo, impresiones sin ensuciar el tracking

## Criterios de aceptación

- [ ] Escenario: Añadir nota a libro en progreso
  - **Dado** un libro en estado "En progreso"
  - **Cuando** hago click en icono de nota / expando zona de notas
  - **Entonces** veo editor de texto plano con preview Markdown, guardo "Página 45, cap. 3", y persiste

- [ ] Escenario: Ver nota guardada
  - **Dado** un libro con nota "Página 120, mitad libro"
  - **Cuando** veo el libro en la lista
  - **Entonces** veo la nota renderizada (Markdown → HTML) bajo título/autor, colapsable

- [ ] Escenario: Editar nota existente
  - **Dado** libro con nota previa
  - **Cuando** edito y guardo
  - **Entonces** se actualiza en BD y UI

- [ ] Escenario: Notas no afectan progreso
  - **Dado** libro "Por leer" con nota larga
  - **Cuando** miro barra de progreso del reto
  - **Entonces** el % no cambia (solo cuenta estado "Completado")

- [ ] Escenario: Límite caracteres
  - **Dado** estoy escribiendo nota
  - **Cuando** supero 5000 caracteres
  - **Entonces** bloquea input y muestra contador "5000/5000"

- [ ] Escenario: Render Markdown básico
  - **Dado** nota con `**negrita**`, `_cursiva_`, `~tachado~`, `- lista`, `> cita`
  - **Cuando** se renderiza
  - **Entonces** se ve formateado correctamente (sin HTML raw, sanitizado)

## Fuera de alcance
- Adjuntar imágenes/archivos en notas
- Búsqueda en notas
- Exportar notas

## Notas / Restricciones
- Columna `notes` en `books` (text, default '', max 5000 chars)
- Librería Markdown ligera: `react-markdown` + `rehype-sanitize` (solo client component para preview)
- Editor: textarea nativo + preview toggle
- Notas editables en cualquier estado del libro
- Server Component para lista, Client Component solo para editor/preview