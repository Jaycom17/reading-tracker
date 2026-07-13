# HU-002: Crear reto de lectura (nombre, meta, duración)

**Prioridad:** Must
**Rol:** Como usuario autenticado
**Funcionalidad:** quiero crear un reto con nombre, meta numérica de libros y duración en semanas
**Valor:** para definir mi objetivo de lectura y tener un marco temporal claro

## Criterios de aceptación

- [ ] Escenario: Crear reto con datos válidos
  - **Dado** que estoy en `/` (dashboard vacío) y hago click en "Crear reto"
  - **Cuando** completo: nombre "12 libros 2026", meta `12`, duración `52` semanas y guardo
  - **Entonces** se crea el reto en BD, redirige a `/challenges/{id}` y veo el reto en el dashboard

- [ ] Escenario: Presets de duración
  - **Dado** que estoy en el formulario de crear reto
  - **Cuando** abro el selector de duración
  - **Entonces** veo opciones: 2, 4, 8, 12, 16, 24, 32, 40, 48, 52 semanas + input numérico libre

- [ ] Escenario: Duración personalizada
  - **Dado** que estoy en el formulario
  - **Cuando** escribo `30` en el input de semanas (no preset)
  - **Entonces** acepta el valor y guarda duración = 30

- [ ] Escenario: Validación meta > 0
  - **Dado** que estoy en el formulario
  - **Cuando** ingreso meta `0` o negativo e intento guardar
  - **Entonces** muestra error "La meta debe ser mayor a 0" y no guarda

- [ ] Escenario: Validación duración > 0
  - **Dado** que estoy en el formulario
  - **Cuando** ingreso duración `0` o negativo e intento guardar
  - **Entonces** muestra error "La duración debe ser mayor a 0" y no guarda

- [ ] Escenario: Nombre obligatorio
  - **Dado** que estoy en el formulario
  - **Cuando** dejo nombre vacío e intento guardar
  - **Entonces** muestra error "El nombre es obligatorio" y no guarda

## Fuera de alcance
- Editar reto existente (Could - HU-011 related)
- Eliminar reto (Could)
- Múltiples retos simultáneos (soportado por modelo, UI en HU-003)

## Notas / Restricciones
- Tabla `challenges`: `user_id` (FK auth.users), `name`, `goal` (int > 0), `duration_weeks` (int > 0), `created_at`
- RLS: `auth.uid() = user_id`
- Server Action o Route Handler POST `/api/challenges`
- Redirect a detalle del reto tras creación