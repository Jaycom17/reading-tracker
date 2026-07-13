# HU-009: Imagen de logro al completar el reto

**Prioridad:** Must
**Rol:** Como usuario que alcanza la meta de mi reto
**Funcionalidad:** quiero generar una imagen de logro del reto completo
**Valor:** para celebrar y compartir el hito de cumplir mi objetivo de lectura

## Criterios de aceptación

- [ ] Escenario: Generar imagen al completar reto
  - **Dado** un reto con todos los libros en "Completado" (ej. 12/12)
  - **Cuando** navego a `/challenges/{id}/achievement` (sin book_id)
  - **Entonces** se genera PNG con:
    - "¡Reto completado!" (título grande)
    - Nombre del reto: "12 libros en 2026"
    - Meta: "12 libros"
    - Duración: "52 semanas"
    - Fecha de finalización: "Completado el 15/11/2026"
    - Lista de libros completados (títulos, opcional si caben)
    - Mi identificador (email/iniciales)

- [ ] Escenario: Botón visible solo al 100%
  - **Dado** reto con progreso < 100%
  - **Cuando** estoy en detalle del reto
  - **Entonces** NO veo botón/enlace "Generar logro del reto"

- [ ] Escenario: Botón visible al 100%
  - **Dado** reto con 12/12 completados
  - **Cuando** estoy en detalle del reto
  - **Entonces** veo botón "Generar logro del reto" prominente

- [ ] Escenario: Descargar y compartir
  - **Dado** imagen de logro de reto generada
  - **Cuando** click "Descargar"
  - **Entonces** descarga `logro-reto-{nombre-reto}-{fecha}.png`

## Fuera de alcance
- Animación / video del progreso
- Comparativa con retos anteriores
- Certificado PDF

## Notas / Restricciones
- Misma ruta `/challenges/[id]/achievement` que HU-008, sin `book_id`
- Detección automática: si `challenge.completed_books === challenge.goal` → modo reto
- Lógica compartida con HU-008 (componente generador único)
- Verificación servidor: solo generar si user_id coincide y progreso = 100%
- Cache: `no-store`