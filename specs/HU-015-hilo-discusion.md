# HU-015: Hilo de discusión por libro

**Prioridad:** Must
**Rol:** Como miembro de una comunidad
**Funcionalidad:** quiero comentar sobre un libro asignado en un hilo de discusión encadenado (solo texto, sin imágenes)
**Valor:** para compartir ideas y opiniones con otros lectores de la comunidad

## Criterios de aceptación

- [ ] Escenario: Publicar comentario
  - **Dado** que soy miembro de la comunidad y el libro "Cien años de solitude" tiene fecha de discusión habilitada
  - **Cuando** escribo "Me encantó el inicio, la ambientación es increíble" y envío
  - **Entonces** mi comentario aparece en el hilo con mi nombre y timestamp

- [ ] Escenario: Responder a un comentario
  - **Dado** que hay un comentario de "María" en el hilo
  - **Cuando** hago clic en "Responder" y escribo "Totalmente de acuerdo"
  - **Entonces** mi respuesta aparece indentada debajo del comentario de María

- [ ] Escenario: Discusión no habilitada
  - **Dado** que el libro tiene fecha de discusión para el 1 de agosto y hoy es 20 de julio
  - **Cuando** intento comentar
  - **Entonces** veo un mensaje "La discusión comenzará el 1 de agosto"

- [ ] Escenario: Comentario vacío
  - **Dado** que intento enviar un comentario con texto vacío
  - **Cuando** presiono enviar
  - **Entonces** no se envía y veo un error "El comentario no puede estar vacío"

## Fuera de alcance

- Editar o eliminar comentarios
- Reacciones o likes a comentarios
- Imágenes, enlaces o archivos adjuntos
- Mencionar a otros usuarios con @
- Notificaciones de nuevas respuestas

## Notas / Restricciones

- Texto plano, máximo 2000 caracteres por comentario
- Los comentarios se almacenan en `community_comments` con FK a `community_books`
- Cada comentario puede tener un `parent_id` para encadenar respuestas
- RLS: solo miembros de la comunidad pueden leer y escribir comentarios
- La fecha de discusión se verifica antes de permitir comentar

## Plan de Ejecución

Esta HU está cubierta dentro del plan de HU-012 (T8, T14).
