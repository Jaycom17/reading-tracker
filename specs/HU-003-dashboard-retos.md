# HU-003: Dashboard con lista de retos y progreso

**Prioridad:** Must
**Rol:** Como usuario autenticado
**Funcionalidad:** quiero ver mis retos con progreso (X/Y completados + barra %) en el dashboard
**Valor:** para tener visión general y acceder rápido a cada reto

## Criterios de aceptación

- [ ] Escenario: Dashboard con retos existentes
  - **Dado** que tengo 2 retos: "12 libros 2026" (3/12 completados) y "No-ficción 2026" (1/6 completados)
  - **Cuando** accedo a `/`
  - **Entonces** veo ambas tarjetas con: nombre, meta, duración, progreso "3/12" + barra 25%, "1/6" + barra 17%, y botón "Entrar"

- [ ] Escenario: Dashboard vacío (primer uso)
  - **Dado** que no tengo retos creados
  - **Cuando** accedo a `/`
  - **Entonces** veo mensaje "Aún no tienes retos. Crea tu primer reto para empezar" y botón "Crear reto" prominente

- [ ] Escenario: Estados temporales del reto
  - **Dado** un reto con duración 4 semanas creado hace 6 semanas
  - **Cuando** veo el dashboard
  - **Entonces** muestra badge "Finalizado (tiempo agotado)" junto al progreso

- [ ] Escenario: Navegar a detalle
  - **Dado** que estoy en el dashboard
  - **Cuando** hago click en "Entrar" o en la tarjeta del reto
  - **Entonces** navego a `/challenges/{id}`

## Fuera de alcance
- Filtrar/ordenar retos (solo 1-2 en Fase 1)
- Estadísticas agregadas cross-reto (Fase 2)

## Notas / Restricciones
- Query: `GET /api/challenges` → lista retos del usuario + count libros completados por reto
- Cálculo %: `completed_count / goal * 100`
- Server Component por defecto (Next.js App Router)
- Tarjetas con Tailwind + shadcn/ui Card