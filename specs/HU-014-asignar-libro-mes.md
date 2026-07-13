# HU-014: Asignar libro del mes (solo creador)

**Prioridad:** Must
**Rol:** Como creador de una comunidad
**Funcionalidad:** quiero asignar un libro mensual con título, autor y fecha de inicio de discusión
**Valor:** para que los miembros sepan qué leer y cuándo empezar a discutir

## Criterios de aceptación

- [ ] Escenario: Asignar libro exitosamente
  - **Dado** que soy creador de la comunidad "Leer clásicos"
  - **Cuando** añado el libro "Cien años de solitude" de Gabriel García Márquez con fecha de discusión 1 de agosto
  - **Entonces** el libro aparece en la lista de libros de la comunidad con estado `asignado` y fecha de discusión 1 agosto

- [ ] Escenario: Miembro intenta asignar libro
  - **Dado** que soy miembro normal (no creador) de la comunidad
  - **Cuando** intento añadir un libro a la comunidad
  - **Entonces** no veo la opción de añadir libro (botón no visible)

- [ ] Escenario: Campos obligatorios vacíos
  - **Dado** que dejo el campo título vacío
  - **Cuando** intento asignar el libro
  - **Entonces** recibo un error de validación "El título es obligatorio"

## Fuera de alcance

- Editar o eliminar un libro ya asignado
- Asignar múltiples libros al mismo mes
- Subir portada del libro
- Buscar libros en catálogos externos

## Notas / Restricciones

- Solo el creador (rol `creator` en `community_members`) puede asignar libros
- El libro se almacena en la tabla `community_books` con FK a `communities`
- Estado inicial: `asignado`
- La fecha de discusión (`discussion_start_date`) define cuándo se habilitan los comentarios

## Plan de Ejecución

Esta HU está cubierta dentro del plan de HU-012 (T7, T13).
