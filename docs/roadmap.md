# Roadmap: Plataforma de Retos de Lectura
Fecha: 2026-07-12

## La idea en una frase
Herramienta personal para trackear un reto de lectura individual y, más adelante, coordinar discusiones de un grupo pequeño alrededor de esos libros.

## La acción core
Agregar un libro al reto y marcarlo como terminado, viendo el contador de progreso subir. Ese es el momento que valida el hábito — todo lo demás (grupos, discusión, historial) existe para servir o extender ese loop, no para reemplazarlo.

## Fase 1 — Lanzamiento
| # | Feature | Por qué va primero | Depende de |
|---|---------|--------------------|------------|
| 1 | Crear un reto personal (nombre, meta, ej. "12 libros en 2026") | Es el contenedor sin el cual no hay nada que trackear | — |
| 2 | Agregar libro al reto (título, autor — manual) | Es la mitad de la acción core: sin libros no hay progreso que marcar | #1 |
| 3 | Marcar libro como "en progreso" / "terminado" | Es la otra mitad de la acción core — el clic que genera la señal de validación | #2 |
| 4 | Ver progreso del reto (contador X/12 + barra de avance) | Cierra el loop: es el feedback que te hace volver la próxima semana | #3 |

Con estas 4 features tenés el Módulo 1 completo y usable por sí solo. Es justo lo que necesitás para tu criterio de éxito: vos trackeando un reto real 4-6 semanas seguidas. El Módulo 2 (comunidades) no entra en esta fase — sin datos de que vos mismo sostenés el hábito individual, coordinar un grupo sería construir sobre un supuesto no probado.

## Fase 2 — Mejora
Una vez el hábito individual esté sostenido, se abre el Módulo 2 completo, en este orden:

1. **Crear un grupo** (nombre, miembros — invitación simple, sin roles) — es el contenedor equivalente al "reto" de la Fase 1, mismo patrón ya validado.
2. **Asignar al grupo un libro + fecha de inicio de discusión** — depende de #1; es lo que le da al grupo algo concreto sobre qué reunirse.
3. **Hilo de comentarios por libro, abierto desde la fecha asignada** — depende de #2; es la acción core del módulo grupal (la discusión real que buscás como segunda señal de éxito).
4. **Historial de libros pasados del grupo** — depende de #3; es valioso solo cuando ya hay al menos una discusión cerrada, así que va al final.

## Backlog
- Elección/votación de libro dentro de la plataforma
- Protección de spoilers o control de quién completó el libro
- Discusión en tiempo real o notificaciones push
- Roles de administrador de grupo, moderación
- Integración con catálogos externos de libros (Google Books, Open Library, etc.)
- Stats avanzadas, recomendaciones, gamificación (streaks, badges) — vanidad clásica: no acerca a la acción core, y sin datos reales de uso no sabés ni qué gamificar
- Cualquier componente de monetización o multiusuario a escala — no aplica, el alcance es vos y tu círculo cercano

## Siguiente paso
La Fase 1 está lista para convertirse en spec — usa /crear-specs y pásale este roadmap como contexto. Como vas con Next.js + Supabase en fines de semana, el spec de Fase 1 debería ser chico a propósito: 4 features, ningún login social ni multiusuario todavía (con que vos puedas entrar y usarlo alcanza para las 4-6 semanas de validación).