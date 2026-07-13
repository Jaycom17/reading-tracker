# Spec: Retos de Lectura — Fase 1 (Reto individual)
Fecha: 2026-07-12

## Overview
Una app personal para trackear retos de lectura propios. Vos creás un reto (ej. "12 libros en 2026"), le agregás los libros que pensás leer, y marcás cada uno como terminado a medida que avanzás. La app te muestra el progreso para que el reto se sienta vivo y sigas volviendo. Es la base de la plataforma completa; el módulo de comunidades de lectura (grupos, discusión) queda para la Fase 2, una vez que este hábito individual esté sostenido.

## Usuarios objetivo
Vos. Hoy trackeás esto a medias con Goodreads (no encaja del todo con cómo armás tus retos) y notas sueltas. No hay otro usuario en esta fase — es una herramienta de un solo usuario con login, pensada para que puedas entrar tanto desde la compu como desde el celular.

## Alcance

### La v1 SÍ hace
1. **Login simple** (email/password) para poder acceder desde cualquier dispositivo.
2. **Crear un reto** (nombre y meta, ej. "12 libros en 2026") — podés tener varios retos activos en paralelo.
3. **Agregar libros a un reto** (título y autor, cargados a mano — sin buscar en catálogos externos).
4. **Marcar un libro como "en progreso" o "terminado"**, y ver el progreso del reto (contador X/12 + barra de avance).

### La v1 NO hace
- No integra catálogos externos de libros (Google Books, Open Library, etc.) — el título y autor se escriben a mano.
- No tiene grupos, discusión ni nada del módulo de comunidades (eso es Fase 2).
- No tiene recuperación de contraseña avanzada, ni login social (Google, etc.) — solo email/password básico.
- No tiene notificaciones, recordatorios ni gamificación (streaks, badges).
- No es multiusuario a escala: está pensada para vos, no para que se registre gente nueva libremente.

## Comportamiento esperado
1. Entrás a la app y ves la pantalla de login. Si es tu primera vez, te registrás con email y contraseña.
2. Una vez adentro, ves la lista de tus retos activos (vacía si es tu primera vez) y un botón para crear uno nuevo.
3. Creás un reto ingresando un nombre y una meta numérica (ej. "12" libros). El reto aparece en tu lista con progreso "0/12".
4. Entrás al reto y agregás un libro con título y autor. El libro queda en estado "en progreso" por defecto.
5. A medida que avanzás, marcás el libro como "terminado". El contador y la barra de progreso del reto se actualizan al instante (ej. "3/12").
6. Podés repetir el proceso para crear otro reto en paralelo (ej. uno de no-ficción) sin que interfiera con el primero.

## Errores y seguridad
- **Agregar un libro sin reto creado:** no es posible — la app no muestra la opción de agregar libros hasta que exista al menos un reto. Si no hay retos, la única acción disponible es "crear reto".
- **Login fallido:** mensaje claro de que el email o contraseña no coinciden, sin dar pistas de cuál de los dos está mal (buena práctica básica de seguridad).
- **Meta del reto inválida** (ej. vacía o negativa): la app no deja guardar el reto hasta que la meta sea un número positivo.
- **Campos vacíos al agregar libro** (título o autor en blanco): la app no permite guardar el libro hasta completar ambos.
- Tus datos (retos, libros) son privados a tu cuenta — nadie más los ve, porque no hay módulo de grupos todavía.

## Éxito
Que vos mismo uses al menos un reto de forma continua durante 4-6 semanas seguidas: agregando libros y marcándolos como terminados sin abandonar la app. Si a las 2 semanas ya no volviste a marcar progreso, la señal es que algo en el flujo no está funcionando.

## V2 (opcional)
Todo el Módulo 2 de la Fase 2 del roadmap:
- Crear grupos de lectura (nombre, miembros por invitación simple).
- Asignar al grupo un libro + fecha de inicio de discusión.
- Hilo de comentarios por libro, abierto desde la fecha asignada.
- Historial de libros pasados del grupo.

Y del backlog general: elección/votación de libro, protección de spoilers, notificaciones, roles/moderación, integración con catálogos externos, stats avanzadas y gamificación, monetización o multiusuario a escala.