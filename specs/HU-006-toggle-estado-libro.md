# HU-006: Cambiar estado de libro (Por leer ↔ En progreso ↔ Completado)

**Prioridad:** Must
**Rol:** Como usuario leyendo un libro
**Funcionalidad:** quiero cambiar el estado de un libro con un click
**Valor:** para reflejar mi avance real sin formularios

## Criterios de aceptación

- [ ] Escenario: Por leer → En progreso
  - **Dado** libro "Dune" en estado "Por leer"
  - **Cuando** click en badge gris "Por leer"
  - **Entonces** cambia a amarillo "En progreso", `status='en_progreso'`, `completed_at=null`

- [ ] Escenario: En progreso → Completado
  - **Dado** libro "El Hobbit" en "En progreso"
  - **Cuando** click en badge amarillo "En progreso"
  - **Entonces** cambia a verde "Completado", `status='completado'`, `completed_at=now()`, toast "¡Libro completado! Generar logro" (link (HU-008)

- [ ] Escenario: Completado → En progreso (reabrir)
  - **Dado** libro completado por error
  - **Cuando** click en badge verde "Completado"
  - **Entonces** vuelve a "En progreso", `status='en_progreso'`, `completed_at=null`

- [ ] Escenario: En progreso → Por leer
  - **Dado** libro en "En progreso"
  - **Cuando** click en badge
  - **Entonces** vuelve a "Por leer", `status='por_leer'`, `completed_at=null`

- [ ] Escenario: Ciclo completo por clicks
  - **Dado** libro "Por leer"
  - **Cuando** click 3 veces seguidas
  - **Entonces** Por leer → En progreso → Completado → En progreso

- [ ] Escenario: Actualiza progreso en tiempo real
  - **Dado** reto meta=3, 1 completado (33%)
  - **Cuando** completo segundo libro
  - **Entonces** barra sube a 66%, contador "2/3" sin recargar (SWR/revalidate o Server Action + revalidatePath)

- [ ] Escenario: Validación estado válido
  - **Dado** intento forzar estado inválido via API
  - **Cuando** envío `status='inventado'`
  - **Entonces** 400 Bad Request "Estado inválido"

## Fuera de alcance
- Arrastrar y soltar para cambiar estado
- Historial de cambios de estado
- Confirmación modal al marcar completado (toast basta)

## Notas / Restricciones
- Enum BD: `status` check `('por_leer', 'en_progreso', 'completado')`
- Default: `'por_leer'`
- Server Action: `toggleBookStatus(bookId)` → lee estado actual → calcula siguiente → update → revalidatePath(`/challenges/${challengeId}`)
- UI: badge clicable (cursor pointer), transición color suave
- Estados visuales:
  - `por_leer`: gris, label "Por leer"
  - `en_progreso`: amarillo/ámbar, label "En progreso"
  - `completado`: verde, label "Completado" + fecha formateada
- Al pasar a completado: disparar HU-008 (toast con link a achievement)