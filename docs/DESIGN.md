# Literary Warmth — Design System

## Filosofía

Reading Tracker es un diario de lectura personal. El diseño "Literary Warmth" evoca la calidez de una librería independiente de lujo: acogedor, culto y refinado. Cada detalle — desde la tipografía serif en titulares hasta los acentos dorados — está pensado para hacer que seguir tu progreso de lectura se sienta tan placentero como leer un buen libro.

---

## Paleta de Colores

### Colores base

| Variable         | Hex       | Uso                                              |
|------------------|-----------|--------------------------------------------------|
| `--color-paper`  | `#FDF8F3` | Fondo de página principal (crema cálido)         |
| `--color-paper-dark` | `#F5F0E8` | Fondo de formularios y contenedores secundarios  |
| `--color-ink`    | `#1A1A2E` | Texto principal, sidebar, botones primarios      |
| `--color-ink-light` | `#6B6B7D` | Texto secundario, metadatos, placeholders        |

### Acentos

| Variable            | Hex       | Uso                                              |
|---------------------|-----------|--------------------------------------------------|
| `--color-gold`      | `#C9A84C` | Acento principal — hover, barras de progreso     |
| `--color-gold-light`| `#E8D5A3` | Fondos sutiles, selection highlight              |
| `--color-gold-dark` | `#A88A2C` | Hover de links, versión más contrastada del oro  |
| `--color-burgundy`  | `#7A2E3B` | Alertas, errores, "tiempo agotado"               |
| `--color-sage`      | `#8A9A7B` | Estados completados, logros, éxito               |
| `--color-sage-light`| `#C5D0B8` | Fondos sutiles de éxito                          |

### Neutros

| Variable                 | Hex       | Uso                                              |
|--------------------------|-----------|--------------------------------------------------|
| `--color-warm-gray`      | `#DDD5CB` | Bordes de inputs y cards                         |
| `--color-warm-gray-light`| `#E8E0D8` | Separadores y fondos de iconos decorativos       |

### Sidebar (fondo oscuro)

| Elemento     | Clase          | Efecto                                           |
|--------------|----------------|--------------------------------------------------|
| Background   | `bg-ink`       | `#1A1A2E`                                        |
| Texto nav    | `text-paper/60`| Blanco crema al 60%                               |
| Hover nav    | `hover:text-gold hover:bg-gold/8` | Texto dorado + fondo dorado 8%      |
| Borders      | `border-white/10` | Blanco al 10% para separadores                |
| Pattern      | Radial dots gold 3% | Puntos dorados apenas visibles como textura  |

### Opacidades estándar

- Bordes sutiles: `/40` o `/50`
- Bordes de input: opacidad completa
- Fondos de estado: `/8` o `/10` (badges)
- Placeholders: `/50`

---

## Tipografía

| Rol           | Font               | Weight  | Clase CSS              |
|---------------|---------------------|---------|------------------------|
| Títulos (h1-h3) | Playfair Display  | 600–700 | `font-serif`           |
| Cuerpo        | Plus Jakarta Sans   | 400–500 | `font-sans`            |
| Metadatos     | Plus Jakarta Sans   | 400     | `text-sm text-ink-light` |
| Badges        | Plus Jakarta Sans   | 500     | `text-xs font-medium`  |

Playfair Display es una serif elegante con un carácter literario distintivo. Plus Jakarta Sans es una sans moderna, limpia y legible que contrasta sin competir.

---

## Componentes

### Botones

| Tipo               | Clases base                                              | Hover                           |
|--------------------|----------------------------------------------------------|---------------------------------|
| **Primario**       | `bg-ink text-paper rounded-lg font-medium`               | `hover:bg-gold hover:text-ink` |
| **Secundario**     | `bg-warm-gray text-ink rounded-lg font-medium`           | `hover:bg-ink hover:text-paper`|
| **Éxito**          | `bg-sage text-white rounded-lg font-medium`              | `hover:bg-sage/80`             |
| **Link**           | `text-ink-light`                                         | `hover:text-gold-dark`         |
| **Row de sidebar** | `text-paper/60`                                          | `hover:text-gold hover:bg-gold/8` |
| **Deshabilitado**  | `disabled:opacity-50 disabled:hover:bg-ink disabled:hover:text-paper` | Sin cambios       |

Regla general: los botones siempre tienen `transition-all`. Los hover son cambios de color completos (no solo opacidad), para máxima visibilidad.

### Inputs

| Estado    | Clases                                                |
|-----------|-------------------------------------------------------|
| Default   | `bg-white border border-warm-gray rounded-lg text-ink placeholder-ink-light/50` |
| Focus     | `focus:ring-2 focus:ring-gold/30 focus:border-gold focus:outline-none` |
| Textarea  | Mismas clases + `resize-none`                         |

Los inputs siempre usan `bg-white` (incluso dentro de formularios con `bg-paper-dark`) para garantizar máximo contraste.

### Formularios

| Elemento     | Clase base                        |
|--------------|-----------------------------------|
| Contenedor   | `bg-paper-dark rounded-xl border border-warm-gray/60 p-8` |
| Labels       | `block text-sm font-medium text-ink mb-1.5` |
| Espaciado    | `space-y-6` entre campos          |
| Footer       | `flex items-center justify-between pt-4 border-t border-warm-gray/40` |

### Cards

| Tipo               | Clases base                                      | Hover                           |
|--------------------|--------------------------------------------------|---------------------------------|
| Challenge card     | `bg-white rounded-xl border border-warm-gray/50` | `hover:border-gold hover:shadow-lg hover:shadow-gold/8` |
| Book card          | `bg-white rounded-xl border border-warm-gray/50 p-5` | `hover:border-gold/60`     |
| Empty state        | `text-center py-16 bg-white rounded-xl border border-warm-gray/50` | — |

### Progress Bar

| Elemento     | Clases                                                |
|--------------|-------------------------------------------------------|
| Track        | `h-2 (o h-3) bg-warm-gray/60 rounded-full overflow-hidden` |
| Fill         | `h-full rounded-full transition-all duration-700 ease-out` |
| Fill color   | `bg-gold` (en curso) / `bg-sage` (completado)         |

### Sidebar

| Elemento         | Clases                                                |
|------------------|-------------------------------------------------------|
| Contenedor       | `w-64 shrink-0 bg-ink min-h-screen flex flex-col`     |
| Patrón de fondo  | Radial dots gold 3%, 24px spacing (solo decorativo)   |
| Logo             | `w-10 h-10 rounded-lg bg-gold/15` + icono dorado      |
| Nav items        | `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all` |
| User avatar      | `w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center text-gold` |

### Estados de libro (badges)

| Estado       | Clases base                        | Significado     |
|--------------|------------------------------------|-----------------|
| Por leer     | `bg-warm-gray/60 text-ink-light`   | No empezado     |
| Leyendo      | `bg-gold/10 text-gold-dark`        | En progreso     |
| Completado   | `bg-sage/10 text-sage`             | Terminado       |

### Círculo de cambio de estado (toggle button)

| Estado       | Clases                                                |
|--------------|-------------------------------------------------------|
| Por leer     | `border-warm-gray text-ink-light/40 hover:border-gold hover:text-gold hover:bg-gold/5` |
| Leyendo      | `border-gold text-gold-dark`                          |
| Completado   | `bg-sage border-sage text-white`                      |

Transition: `transition-all` en todos los casos.

---

## Layout

### Estructura general

```
+----------------------------------+
| Sidebar (w-64) | Main content     |
| bg-ink         | flex-1           |
|                | p-8 lg:p-10      |
+----------------------------------+
```

- Sidebar fijo a la izquierda, 256px
- Contenido principal con padding responsive
- Las páginas de auth (login) no tienen sidebar — layout de ancho completo

### Login
Split screen en desktop (50/50):
- Lado izquierdo: brand en `bg-ink` con textura de puntos
- Lado derecho: formulario centrado en `bg-paper`, `max-w-sm`

### Dashboard
- Encabezado con título + botón de acción (oculto en móvil, reemplazado por FAB)
- Grid responsive: 1 col móvil, 2 tablet, 3 desktop
- Cards con animación fade-in-up escalonada (`animation-delay`)

### Detalle de reto
- Columna única, `max-w-4xl`
- Header con nombre + acciones
- Progress card con métricas
- Lista de books como cards apiladas

### Formularios (crear reto / añadir libro)
- Columna única, `max-w-2xl`
- Contenedor `bg-paper-dark` para que inputs blancos destaquen

---

## Animaciones

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}
```

Usada en las cards del dashboard con `animation-delay: ${index * 0.1}s` para efecto escalonado.

No hay animaciones superfluas. La única animación es la entrada de las cards — suficiente para dar vida sin distraer.

---

## Achievement Image (OG)

Las imágenes de logro comparten la paleta del diseño general:

| Elemento           | Estilo                                               |
|--------------------|------------------------------------------------------|
| Background         | Gradiente `#FDF8F3` → `#F5F0E8` → `#EDE4D8`        |
| Card               | Blanco 70% opacidad, borde dorado 20%, shadow suave  |
| Icono              | Estrella ★ sobre círculo gradiente gold              |
| Heading            | Playfair Display, ink, 36–40px                       |
| Título libro/reto  | Playfair Display, burgundy, 26–28px                  |
| Metadatos          | Plus Jakarta Sans, ink-light                         |
| Footer             | Avatar inicial + "Reading Tracker"                   |
| Dimensiones        | 1200×630px                                           |

---

## Tokens CSS

Definidos en `globals.css` mediante `@theme inline {}` y accesibles como clases utilitarias de Tailwind (ej: `bg-paper`, `text-gold`, `border-warm-gray`).

```css
@theme inline {
  --color-paper: #FDF8F3;
  --color-paper-dark: #F5F0E8;
  --color-ink: #1A1A2E;
  --color-ink-light: #6B6B7D;
  --color-gold: #C9A84C;
  --color-gold-light: #E8D5A3;
  --color-gold-dark: #A88A2C;
  --color-burgundy: #7A2E3B;
  --color-sage: #8A9A7B;
  --color-sage-light: #C5D0B8;
  --color-warm-gray: #DDD5CB;
  --color-warm-gray-light: #E8E0D8;
  --font-serif: var(--font-playfair);
  --font-sans: var(--font-plus-jakarta);
}
```

---

## Principios de diseño

1. **Contraste ante todo** — inputs blancos sobre fondos ligeramente distintos, hovers con cambios de color completos, texto siempre legible
2. **Menos es más** — una sola animación (fadeInUp), sin decoraciones innecesarias, el contenido es el protagonista
3. **Cohesión** — todos los elementos usan la misma paleta, tipografía y lenguaje visual
4. **Calidez** — la paleta crema+dorado+burdeos evita el frío "tech" y se siente literaria
5. **Hovers visibles** — todo elemento interactivo cambia de estado de forma clara e inmediata
