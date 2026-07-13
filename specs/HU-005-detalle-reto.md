# HU-005: Ver detalle del reto y lista de libros

**Prioridad:** Must
**Rol:** Como usuario dentro de un reto
**Funcionalidad:** quiero ver la lista de mis libros con sus estados y progreso
**Valor:** para saber qué leer y qué llevo completado

## Criterios de aceptación

- [ ] Escenario: Ver lista completa en detalle
  - **Dado** reto "12 libros 2026" con 4 libros: 1 completado, 2 en progreso, 1 por leer
  - **Cuando** entro a `/challenges/{id}`
  - **Entonces** veo:
    - Header: nombre + "3/12 completados" + barra 25% + "Semana 12 de 52"
    - Lista: cada libro con título, autor, badge estado, fecha completado (si aplica)
    - Botón "Añadir libro" (si < meta libros añadidos)

- [ ] Escenario: Libro completado muestra fecha
  - **Dado** libro "El Hobbit" completado el 15/03/2026
  - **Cuando** lo veo en la lista
  - **Entonces** veo badge verde "Completado" + "15 mar 2026" pequeño

- [ ] Escenario: Libro en progreso sin fecha
  - **Dado** libro "1984" en progreso
  - **Cuando** lo veo
  - **Entonces** badge amarillo "En progreso", sin fecha

- [ ] Escenario: Libro por leer
  - **Dado** libro "Dune" por leer
  - **Cuando** lo veo
  - **Entonces** badge gris "Por leer"

- [ ] Escenario: Notas visibles
  - **Dado** libro con notas "Página 50 - *capítulo 3*"
  - **Cuando** veo la lista
  - **Entonces** notas renderizadas en Markdown bajo el título (truncadas a 2 líneas, expandible)

- [ ] Escenario: Acciones por libro
  - **Dado** estoy en la lista
  - **Cuando** paso ratón / touch en un libro
  - **Entonces** veo: toggle estado (HU-006), editar (HU-011), eliminar (HU-010 si aplica), notas (HU-007)

## Fuera de alcance
- Ordenar/filtar lista (por defecto: fecha creación)
- Búsqueda en lista
- Vista de tarjetas vs lista (solo lista)

## Notas / Restricciones
- Server Component por defecto (fetch challenge + books en server)
- Barra progreso: `(completed_books / goal) * 100`
- Semana actual: `Math.min(Math.ceil((now - created_at) / (7*24*60*60*1000)), duration_weeks)`
- RLS: solo books de challenges propios
- Botón "Añadir libro" → `/challenges/{id}/books/new` (HU-004)