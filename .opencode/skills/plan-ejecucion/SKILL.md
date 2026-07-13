---
name: plan-ejecucion
description: >
  Genera planes de ejecución técnicos a partir de historias de usuario en specs/.
  Desglosa cada HU en tareas de implementación concretas con orden recomendado,
  listas para que la IA programme la solución. Usar después de la skill de
  requisitos o de forma independiente sobre specs existentes.
---

# Planificador de Ejecución

Convierte historias de usuario en planes de ejecución técnicos detallados.
Cada plan desglosa la spec en pasos de implementación concretos que la IA
seguirá para programar la solución.

**Idioma:** responde en el idioma del usuario. Los archivos en `specs/` usan el
mismo idioma de la conversación.

## Flujo de trabajo

```
Lectura → Análisis → Desglose → Generación → Validación
```

### 1. Lectura

- Lee la spec objetivo en `specs/` (una o varias HU según el caso).
- Si el usuario no indica qué HU planificar, pregunta cuáles o si desea
  planificar todas las pendientes.
- Identifica dependencias entre HUs si hay varias.

### 2. Análisis

Para cada HU, extrae:

- **Criterios de aceptación**: qué debe funcionar (Given-When-Then).
- **Fuera de alcance**: qué NO implementar.
- **Notas/Restricciones**: dependencias, reglas de negocio, NFR.
- **Contexto del proyecto**: analiza el repositorio actual (estructura,
  stack, librerías, convenciones) para adaptar el plan al código existente.

### 3. Desglose

Genera tareas técnicas siguiendo este orden lógico:

1. **Modelado de datos**: esquemas, tipos, interfaces, migraciones
2. **Lógica de negocio**: servicios, utilidades, validaciones
3. **API/Endpoints**: rutas, controladores, middlewares
4. **Componentes UI**: componentes React, layouts, estilos
5. **Integración**: conexión frontend-backend, estado, efectos
6. **Testing**: tests unitarios, de integración, E2E
7. **Ajustes finales**: validación manual, refactorizaciones menores

**Reglas de desglose:**

- Cada tarea debe ser ejecutable en una sola sesión de IA (máx ~100 líneas
  de código por tarea).
- Si una tarea es demasiado grande, divídela en sub-tareas numeradas.
- Incluye dependencias explícitas entre tareas cuando aplique.
- Usa verbos de acción: "Crear", "Implementar", "Configurar", "Agregar",
  "Modificar", "Validar".

### 4. Generación

Agrega el plan al **mismo archivo de la spec**, después de la sección
"Fuera de alcance" (antes de "Notas / Restricciones" si existe, o al final).

**Plantilla obligatoria** del plan:

```markdown
## Plan de Ejecución

### Tareas

- [ ] **T1: [Título conciso de la tarea]**
  - Descripción breve de qué hacer
  - Archivos a crear/modificar: `ruta/archivo.ts`
  - Pasos:
    1. Primer paso concreto
    2. Segundo paso concreto
    3. ...
  - Resultado esperado: qué debe funcionar al completar esta tarea
  - Dependencias: T# (si aplica)

- [ ] **T2: [Título conciso de la tarea]**
  ...

### Orden de implementación

```plaintext
T1 → T2 → T3 → T4
         ↘ T5 → T6
```

### Notas de implementación

- <consideraciones técnicas relevantes>
- <convenciones del proyecto a seguir>
- <puntos de atención o decisiones técnicas>
```

### 5. Validación

Tras generar el plan, verifica:

- [ ] ¿Cada criterio de aceptación tiene al menos una tarea que lo cubra?
- [ ] ¿Las tareas tienen orden lógico (datos → lógica → UI → integración)?
- [ ] ¿Los archivos mencionados existen o son coherentes con la estructura?
- [ ] ¿Hay tareas que excedan el alcance de la HU (fuera de alcance)?
- [ ] ¿Las dependencias entre tareas son correctas?

Informa al usuario: número de tareas, orden recomendado, y sugiere iniciar
la ejecución con la primera tarea.

## Modos de uso

| Situación | Acción |
|-----------|--------|
| Post-requisitos | La skill de requisitos genera las HUs; esta skill planifica la más prioritaria o todas |
| HU específica | El usuario indica el ID (ej: "planifica HU-003") |
| Múltiples HUs | Planifica todas las HUs pendientes, respetando dependencias |
| HU existente | Re-planifica una HU que ya tiene plan (reemplaza o actualiza) |
| Solo的部分 | Planificar solo partes específicas de una HU (ej: "solo la parte de UI") |

## Anti-patrones (evitar)

- Generar el plan sin leer la spec completa
- Tareas vagas como "Implementar la funcionalidad"
- Mezclar tareas de múltiples HUs en un solo plan (salvo que se pida explícitamente)
- Incluir estimación de tiempo o story points
- Omitir la dependencia entre tareas
- Generar pasos de implementación que excedan el alcance de la HU
- Agregar secciones no solicitadas (testing E2E completo, deployment, etc.)

## Recursos

- Formato de specs: ver `specs/HU-*.md` para ejemplos
- Skill complementaria: [requisitos](../requisitos/SKILL.md) para generar las HUs
