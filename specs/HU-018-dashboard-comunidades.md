# HU-018: Dashboard de comunidades

**Prioridad:** Must
**Rol:** Como usuario registrado
**Funcionalidad:** quiero ver en mi dashboard las comunidades que he creado y las que soy miembro
**Valor:** para acceder rápidamente a todas mis comunidades de lectura

## Criterios de aceptación

- [ ] Escenario: Ver comunidades creadas
  - **Dado** que he creado 2 comunidades ("Leer clásicos", "Sci-Fi mensual")
  - **Cuando** accedo al dashboard
  - **Entonces** veo una sección "Mis comunidades" con las 2 comunidades y el número de miembros en cada una

- [ ] Escenario: Ver comunidades donde soy miembro
  - **Dado** que soy miembro de 1 comunidad creada por otro usuario ("Poesía latinoamericana")
  - **Cuando** accedo al dashboard
  - **Entonces** veo una sección "Comunidades que sigo" con esa comunidad

- [ ] Escenario: Acceder a comunidad
  - **Dado** que veo la comunidad "Leer clásicos" en mi dashboard
  - **Cuando** hago clic en ella
  - **Entonces** navego al detalle de la comunidad con lista de libros y discusiones

- [ ] Escenario: Sin comunidades
  - **Dado** que no he creado ni soy miembro de ninguna comunidad
  - **Cuando** accedo al dashboard
  - **Entonces** veo un mensaje "No perteneces a ninguna comunidad" con un botón "Unirse con código"

## Fuera de alcance

- Notificaciones de nueva actividad en comunidades
- Buscar comunidades públicas
- Estadísticas de actividad por comunidad

## Notas / Restricciones

- El dashboard muestra secciones separadas: "Mis comunidades" (soy creador) y "Comunidades que sigo" (soy miembro)
- Cada tarjeta muestra: nombre de la comunidad, número de miembros, libro actual asignado (si hay)
- Navegación a `/communities/[id]` para ver detalle

## Plan de Ejecución

Esta HU está cubierta dentro del plan de HU-012 (T12).
