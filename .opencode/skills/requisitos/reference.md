# Referencia — Elicitación y calidad

## Banco de preguntas

Adapta al contexto; no uses la lista como cuestionario rígido.

### Actores y contexto

- ¿Quiénes usan el sistema y con qué objetivo?
- ¿Hay roles con permisos distintos?
- ¿El usuario trabaja solo o en equipo/organización?
- ¿Hay administradores u operadores internos?

### Flujos funcionales

- ¿Cuál es la acción más frecuente e importante?
- ¿Cuál es el flujo paso a paso del happy path?
- ¿Qué pasa si el usuario cancela a mitad de camino?
- ¿Qué validaciones de datos son obligatorias?
- ¿Hay estados del objeto (borrador, publicado, archivado)?
- ¿Se necesita historial o auditoría de cambios?

### Errores y excepciones

- ¿Qué errores son recuperables vs. fatales?
- ¿Qué mensaje debe ver el usuario en cada caso?
- ¿Hay reintentos automáticos o acción manual?

### Datos e integraciones

- ¿Qué datos se crean, leen, actualizan o eliminan?
- ¿Hay importación/exportación (CSV, API, webhooks)?
- ¿Depende de servicios externos (pagos, email, auth)?

### No funcionales (preguntar solo si aplica)

- Volumen: usuarios concurrentes, registros esperados
- Rendimiento: tiempos de respuesta aceptables
- Seguridad: autenticación, permisos, datos sensibles, cumplimiento
- Disponibilidad: 24/7 vs. horario laboral
- Dispositivos: web móvil, desktop, app nativa
- Idioma: mono vs. multi-idioma
- Accesibilidad: requisitos WCAG u otros

### Alcance y prioridad

- ¿Qué es imprescindible para la primera versión usable?
- ¿Qué puede esperar a una segunda iteración?
- ¿Hay fecha límite o restricción de presupuesto/equipo?

---

## Cuándo dividir una historia

Divide si la historia:

- Tiene más de un flujo principal independiente
- Mezcla lectura y escritura sin relación directa
- Incluye "y también" más de una vez en el título
- Requeriría más de 5–8 criterios de aceptación para cubrirse bien
- Bloquea estimación porque el alcance es difuso

Mantén junta si:

- Los escenarios son variantes del mismo flujo
- Separarla crearía dependencia artificial entre HUs

---

## Tamaño orientativo por historia

| Señal | Acción |
|-------|--------|
| 1 flujo, 2–4 escenarios | Tamaño adecuado |
| 5+ escenarios heterogéneos | Dividir |
| "Como usuario quiero gestionar X" (X muy amplio) | Dividir por subcapacidad |

---

## Glosario

| Término | Definición en esta skill |
|---------|--------------------------|
| Historia de usuario | Requisito funcional desde la perspectiva del usuario |
| Criterio de aceptación | Condición verificable que define "terminado" |
| MVP | Mínimo conjunto Must para entregar valor usable |
| Épica | Agrupación de historias; no se escribe como HU salvo petición |
| Supuesto | Decisión tomada por falta de información; debe declararse |

---

## Formato specs/README.md

```markdown
# Backlog — <nombre del producto>

| ID | Historia | Prioridad | Estado |
|----|----------|-----------|--------|
| HU-001 | <título corto> | Must | Borrador |

## Alcance MVP

<1–3 oraciones>

## Fuera de alcance (v1)

- <ítem>

## Supuestos

- <supuesto documentado>

## Riesgos abiertos

- <riesgo o pregunta pendiente>
```

Estados válidos: `Borrador`, `Revisada`, `Aprobada`, `En desarrollo`, `Hecha`,
`Deprecada`.
