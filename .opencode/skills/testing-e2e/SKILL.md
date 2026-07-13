---
name: testing-e2e
description: >
  Ejecuta tests E2E usando Playwright sobre el servidor local de la aplicación.
  Genera casos de prueba desde criterios de aceptación, levanta el servidor,
  ejecuta los tests (modo headless por defecto) y genera reportes detallados
  en consola y archivo MD. Usar después de implementar tareas del plan de
  ejecución o cuando se pida validación manual.
---

# Testing E2E con Playwright

Ejecuta tests end-to-end sobre la aplicación local, generando casos de prueba
desde los criterios de aceptación de las HUs y proporcionando reportes detallados.

**Idioma:** responde en el idioma del usuario. Los reportes se generan en `specs/`.

## Flujo de trabajo

```
Preparación → Generación → Ejecución → Reporte → Retroalimentación
```

### 1. Preparación

**Verificar entorno:**

- Verificar que Playwright está instalado (`@playwright/test`)
- Si no está, instalarlo: `npm install -D @playwright/test @playwright/browser-chromium`
- Verificar que los browsers están instalados: `npx playwright install chromium`

**Configurar servidor:**

- Verificar si el servidor ya está corriendo en el puerto configurado (default: 3000)
- Si está corriendo, reutilizar la conexión
- Si no está, levantarlo con `npm run dev` en background
- Esperar a que el servidor responda antes de ejecutar tests

**Configuración de Playwright:**

- Crear `playwright.config.ts` si no existe
- Configuración por defecto:
  - `headless: true` (a menos que se pida explícitamente ventana visible)
  - `baseURL: http://localhost:3000`
  - `timeout: 30000` (30 segundos por test)
  - `retries: 1` (reintentar una vez en caso de fallo)
  - `workers: 1` (ejecutar secuencialmente para evitar conflictos)

### 2. Generación de Tests

**Desde criterios de aceptación:**

- Leer la HU objetivo en `specs/`
- Extraer cada escenario Given-When-Then
- Convertir a test Playwright:

```typescript
import { test, expect } from '@playwright/test';

test('nombre del escenario', async ({ page }) => {
  // DADO: estado inicial
  await page.goto('/');
  
  // CUANDO: acción del usuario
  await page.click('button[data-testid="submit"]');
  
  // ENTONCES: verificación
  await expect(page.locator('.mensaje')).toContainText('resultado esperado');
});
```

**Estructura de archivos de test:**

```
tests/
  e2e/
    HU-001-configurar-presupuesto/
      configuracion-inicial.spec.ts
      editar-presupuesto.spec.ts
      validacion-monto.spec.ts
    HU-002-registrar-transacciones/
      registro-ingreso.spec.ts
      registro-gasto.spec.ts
      saldo-insuficiente.spec.ts
```

**Naming de tests:**

- Usar el nombre del escenario de la HU como nombre del test
- Agrupar tests por HU en carpetas
- Un archivo por escenario o varios relacionados

### 3. Ejecución

**Comandos:**

```bash
# Ejecutar todos los tests
npx playwright test

# Ejecutar tests de una HU específica
npx playwright test tests/e2e/HU-001-configurar-presupuesto/

# Ejecutar un test específico
npx playwright test tests/e2e/HU-001-configurar-presupuesto/configuracion-inicial.spec.ts

# Modo headed (ventana visible)
npx playwright test --headed

# Ver reporte HTML generado
npx playwright show-report
```

**Flags importantes:**

- `--headed`: Mostrar navegador (para depuración)
- `--debug`: Modo debug con inspector
- `--reporter=html`: Generar reporte HTML
- `--output=tests-results`: Carpeta de resultados

### 4. Reporte

**Generar reporte MD en la HU:**

Agregar sección al final del archivo de la spec:

```markdown
## Reporte de Testing E2E

**Fecha:** YYYY-MM-DD HH:MM
**Tests ejecutados:** X
**Exitosos:** X
**Fallidos:** X

### Resultados por escenario

| Escenario | Estado | Tiempo | Detalles |
|-----------|--------|--------|----------|
| Configuración inicial | ✅ Pass | 1.2s | - |
| Editar presupuesto | ❌ Fail | 2.1s | Ver detalle |
| Validación monto | ✅ Pass | 0.8s | - |

### Detalle de fallos

#### [Nombre del escenario fallido]

**Error:**
```
Error message o stack trace
```

**Screenshot:** `tests-results/HU-001-nombre-escenario/trace.png`

**Posible causa:** <análisis del error>

**Sugerencia de corrección:** <código o acción sugerida>
```

**Reporte en consola:**

- Resumen ejecutivo al final de la ejecución
- Lista de tests fallidos con links a traces
- Estadísticas de tiempo

### 5. Retroalimentación

**Después de ejecutar:**

1. Mostrar resumen en consola (tests pass/fail)
2. Generar reporte MD en la HU
3. Para cada fallo:
   - Analizar el error (stack trace, mensaje)
   - Identificar el componente/función afectada
   - Sugerir corrección específica con código
   - No corregir automáticamente (solo reportar)

**Formato de retroalimentación:**

```
📊 Resumen de testing E2E
━━━━━━━━━━━━━━━━━━━━━━━━━━
HU-001: Configurar presupuesto mensual
  ✅ Configuración inicial (1.2s)
  ❌ Editar presupuesto (2.1s)
  ✅ Validación monto (0.8s)

Total: 2/3 tests pasaron (66.7%)

❌ FALLOS DETECTADOS:

1. Editar presupuesto existente
   - Archivo: src/components/budget/BudgetForm.tsx:45
   - Error: No se encontró el botón "Actualizar"
   - Causa: El botón no tiene el data-testid esperado
   - Solución: Agregar data-testid="update-budget" al botón

📄 Reporte completo: specs/HU-001-configurar-presupuesto-mensual.md
```

## Configuración

**playwright.config.ts** (se crea si no existe):

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 1,
  workers: 1,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  reporter: [
    ['html', { outputFolder: 'tests-results' }],
    ['list'],
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
    timeout: 120000,
  },
});
```

## Modos de uso

| Situación | Acción |
|-----------|--------|
| Post-implementación | Ejecutar tests de la HU implementada |
| Validación manual | El usuario pide "ejecuta los tests de HU-XXX" |
| Todos los tests | Ejecutar toda la suite de E2E |
| Test específico | Ejecutar un escenario particular |
| Depuración | Modo headed + debug para ver qué falla |

## Anti-patrones (evitar)

- Ejecutar tests sin verificar que el servidor está corriendo
- Generar tests que no corresponden a los criterios de aceptación
- Hardcodear valores que cambien (fechas, IDs específicos)
- Omitir el reporte MD en la spec
- No incluir screenshots en fallos
- Ejecutar tests en paralelo cuando dependen del mismo estado
- Ignorar timeouts o errores de red

## Recursos

- Docs Playwright: https://playwright.dev/docs/intro
- Configuración: `playwright.config.ts` en raíz del proyecto
- Tests generados: `tests/e2e/` organizados por HU
- Reportes: `tests-results/` (HTML) y specs/ (MD)
