# Ejemplos

## Interacción tipo

**Usuario:** Quiero una app para gestionar gastos personales.

**Agente (resumen inicial):** Entiendo que buscas una app para registrar y
consultar gastos personales. ¿Es correcto?

**Agente (pregunta 1):** ¿Quién usará la app?
- Solo yo
- Varios usuarios con cuentas separadas
- Una familia con gastos compartidos
- Otro

**Usuario:** Solo yo.

**Agente (pregunta 2):** ¿Cómo quieres registrar un gasto?
- Monto + categoría + fecha (rápido)
- Monto + categoría + fecha + nota + comprobante
- Otro

… (continúa hasta cubrir actores, flujos, errores, NFR relevantes)

**Agente (confirmación):**

| Campo | Contenido |
|-------|-----------|
| Objetivo | Controlar gastos personales mensuales |
| Actores | Usuario individual |
| MVP | Registrar gasto, categorizar, ver resumen mensual |
| Fuera de MVP | Presupuestos, exportar PDF, multi-moneda |
| HUs propuestas | HU-001 registro, HU-002 categorías, HU-003 resumen |

¿Confirmas este alcance para generar los archivos en `specs/`?

---

## specs/README.md

```markdown
# Backlog — App de gastos personales

| ID | Historia | Prioridad | Estado |
|----|----------|-----------|--------|
| HU-001 | Registro de gastos | Must | Borrador |
| HU-002 | Gestión de categorías | Must | Borrador |
| HU-003 | Resumen mensual | Must | Borrador |

## Alcance MVP

Registrar gastos con categoría y fecha; consultar totales por mes y categoría.

## Fuera de alcance (v1)

Presupuestos, exportación, multi-moneda, usuarios múltiples.
```

---

## specs/HU-001-registro-gastos.md

```markdown
# HU-001: Registrar un gasto

**Prioridad:** Must
**Rol:** Como usuario
**Funcionalidad:** quiero registrar un gasto con monto, categoría y fecha
**Valor:** para llevar un control actualizado de mis finanzas diarias

## Criterios de aceptación

- [ ] Escenario: Registro exitoso
  - **Dado** que estoy en la pantalla principal con categorías configuradas
  - **Cuando** ingreso monto 45.50, selecciono categoría "Comida", fecha hoy y
    guardo
  - **Entonces** el gasto aparece en el listado del día con esos datos y el
    total del día se actualiza

- [ ] Escenario: Monto inválido
  - **Dado** que estoy registrando un gasto
  - **Cuando** ingreso monto 0 o un valor no numérico y guardo
  - **Entonces** veo el mensaje "Ingresa un monto mayor a 0" y el gasto no se
    guarda

- [ ] Escenario: Sin categorías disponibles
  - **Dado** que no existe ninguna categoría creada
  - **Cuando** intento registrar un gasto
  - **Entonces** se me redirige a crear al menos una categoría antes de
    continuar

## Fuera de alcance

- Adjuntar comprobante (foto/PDF)
- Gastos recurrentes automáticos

## Notas / Restricciones

- Monto: máximo 2 decimales, moneda única (configurada en perfil)
- Fecha por defecto: día actual; editable hasta 30 días atrás
```

---

## specs/HU-003-resumen-mensual.md

```markdown
# HU-003: Consultar resumen mensual

**Prioridad:** Must
**Rol:** Como usuario
**Funcionalidad:** quiero ver un resumen de mis gastos del mes actual
**Valor:** para entender en qué categorías gasto más y ajustar hábitos

## Criterios de aceptación

- [ ] Escenario: Resumen con gastos
  - **Dado** que tengo gastos registrados en el mes actual
  - **Cuando** abro la vista de resumen mensual
  - **Entonces** veo el total gastado y un desglose por categoría con monto y
    porcentaje

- [ ] Escenario: Mes sin gastos
  - **Dado** que no tengo gastos en el mes actual
  - **Cuando** abro la vista de resumen mensual
  - **Entonces** veo total 0 y el mensaje "Aún no hay gastos este mes"

## Fuera de alcance

- Comparación con meses anteriores
- Gráficos interactivos

## Notas / Restricciones

- Mes calendario según zona horaria del dispositivo
- Actualización en tiempo real al registrar o eliminar gastos
```
