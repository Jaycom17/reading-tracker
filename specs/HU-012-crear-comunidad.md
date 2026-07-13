# HU-012: Crear comunidad de lectura

**Prioridad:** Must
**Rol:** Como usuario registrado
**Funcionalidad:** quiero crear una comunidad de lectura con nombre y descripción, y recibir un código de acceso único de 6 caracteres
**Valor:** para poder invitar a otros usuarios a discutir libros juntos

## Criterios de aceptación

- [ ] Escenario: Crear comunidad exitosamente
  - **Dado** que estoy autenticado en la app
  - **Cuando** envío el formulario con nombre ("Leer clásicos") y descripción ("Leemos un clásico cada mes")
  - **Entonces** se crea la comunidad, se genera un código alfanumérico de 6 caracteres (ej: `A3X9K2`) y soy asignado como creador y miembro

- [ ] Escenario: Nombre duplicado
  - **Dado** que ya existe una comunidad con el nombre "Leer clásicos"
  - **Cuando** intento crear otra comunidad con el mismo nombre
  - **Entonces** recibo un error "Ya existe una comunidad con ese nombre"

- [ ] Escenario: Campos obligatorios vacíos
  - **Dado** que dejo el campo nombre vacío
  - **Cuando** intento crear la comunidad
  - **Entonces** recibo un error de validación "El nombre es obligatorio"

## Fuera de alcance

- Subir imagen/cover para la comunidad
- Editar nombre o descripción después de crearla
- Definir límite de miembros al crear

## Notas / Restricciones

- El código de acceso es alfanumérico mayúsculas + dígitos, 6 caracteres
- El código debe ser único (verificar contra la tabla `communities`)
- El creador se almacena como miembro con rol `creator` en la tabla `community_members`
- RLS: solo el creador puede editar la comunidad (no implementado en esta HU, futuro)

## Plan de Ejecución

### Tareas

- [ ] **T1: Migración de base de datos — tablas de comunidades**
  - Crear migración SQL con las 4 tablas nuevas: `communities`, `community_members`, `community_books`, `community_comments`
  - Archivos a crear/modificar: `supabase/migrations/XXXX_create_communities.sql`
  - Pasos:
    1. Crear tabla `communities` (id uuid PK, name text NOT NULL, description text, creator_id uuid FK→auth.users, access_code text UNIQUE NOT NULL, created_at timestamptz)
    2. Crear tabla `community_members` (id uuid PK, community_id uuid FK→communities ON DELETE CASCADE, user_id uuid FK→auth.users, role text CHECK ('creator','member'), joined_at timestamptz, UNIQUE(community_id, user_id))
    3. Crear tabla `community_books` (id uuid PK, community_id uuid FK→communities ON DELETE CASCADE, title text NOT NULL, author text NOT NULL, status text DEFAULT 'asignado', discussion_start_date date, created_at timestamptz)
    4. Crear tabla `community_comments` (id uuid PK, community_book_id uuid FK→community_books ON DELETE CASCADE, user_id uuid FK→auth.users, content text NOT NULL, parent_id uuid SELF FK, created_at timestamptz)
    5. Crear índices: idx_community_members_user, idx_community_members_community, idx_community_books_community, idx_community_comments_book, idx_communities_access_code
    6. Habilitar RLS en las 4 tablas
    7. Crear políticas RLS: members ven su comunidad, creator tiene permisos extra
  - Resultado esperado: 4 tablas creadas con RLS, listas para usar
  - Dependencias: ninguna

- [ ] **T2: Generar tipos TypeScript de la BD**
  - Generar tipos a partir del esquema de Supabase
  - Archivos a crear/modificar: `src/lib/database.types.ts` (nuevo)
  - Pasos:
    1. Ejecutar `supabase generate typescript types` o crear manualmente los tipos basados en el esquema
    2. Definir interfaces: `Community`, `CommunityMember`, `CommunityBook`, `CommunityComment`
    3. Definir union types: `CommunityMemberRole`, `CommunityBookStatus`
  - Resultado esperado: archivo de tipos con todas las tablas y relaciones tipadas
  - Dependencias: T1

- [ ] **T3: Server action — crear comunidad**
  - Implementar server action para crear comunidad + insertar creador como miembro
  - Archivos a crear/modificar: `src/actions/communities.ts` (nuevo)
  - Pasos:
    1. Crear función `createCommunity(name, description)` con 'use server'
    2. Validar nombre no vacío
    3. Generar código alfanumérico de 6 caracteres (función auxiliar)
    4. Verificar que el nombre no exista ya
    5. Insertar en `communities` con `creator_id = user.id`
    6. Insertar en `community_members` con rol `creator`
    7. Llamar `revalidatePath('/')` para actualizar dashboard
    8. Retornar `{ data: community }` o `{ error: message }`
  - Resultado esperado: al llamar createCommunity se crea la comunidad y el usuario queda como creador
  - Dependencias: T1, T2

- [ ] **T4: Server action — unirse a comunidad**
  - Implementar server action para unirse con código de acceso
  - Archivos a crear/modificar: `src/actions/communities.ts` (agregar función)
  - Pasos:
    1. Crear función `joinCommunity(accessCode)`
    2. Buscar comunidad por `access_code`
    3. Si no existe → error "Código de acceso no válido"
    4. Verificar si el usuario ya es miembro → error "Ya perteneces a esta comunidad"
    5. Insertar en `community_members` con rol `member`
    6. Retornar `{ data: community }` o `{ error: message }`
  - Resultado esperado: un usuario puede unirse a una comunidad con código válido
  - Dependencias: T1, T2

- [ ] **T5: Server action — salirse de comunidad**
  - Implementar server action para salirse (no el creador)
  - Archivos a crear/modificar: `src/actions/communities.ts` (agregar función)
  - Pasos:
    1. Crear función `leaveCommunity(communityId)`
    2. Verificar que el usuario no sea el creador → error "El creador no puede salirse"
    3. Eliminar registro de `community_members`
    4. Retornar `{ success: true }` o `{ error: message }`
  - Resultado esperado: un miembro puede salirse, el creador no
  - Dependencias: T1, T2

- [ ] **T6: Server action — expulsar miembro**
  - Implementar server action para expulsar (solo creador)
  - Archivos a crear/modificar: `src/actions/communities.ts` (agregar función)
  - Pasos:
    1. Crear función `removeMember(communityId, userId)`
    2. Verificar que el usuario actual sea el creador
    3. Verificar que no intente expulsarse a sí mismo
    4. Eliminar registro de `community_members`
    5. Retornar `{ success: true }` o `{ error: message }`
  - Resultado esperado: solo el creador puede expulsar miembros
  - Dependencias: T1, T2

- [ ] **T7: Server action — asignar libro del mes**
  - Implementar server action para asignar libro (solo creador)
  - Archivos a crear/modificar: `src/actions/communities.ts` (agregar función)
  - Pasos:
    1. Crear función `assignBook(communityId, title, author, discussionStartDate)`
    2. Verificar que el usuario sea el creador
    3. Validar campos obligatorios (título, autor)
    4. Insertar en `community_books` con status `asignado`
    5. Retornar `{ data: book }` o `{ error: message }`
  - Resultado esperado: el creador puede asignar libros con fecha de discusión
  - Dependencias: T1, T2

- [ ] **T8: Server action — publicar comentario**
  - Implementar server action para publicar comentario en hilo
  - Archivos a crear/modificar: `src/actions/communities.ts` (agregar función)
  - Pasos:
    1. Crear función `postComment(communityBookId, content, parentId?)`
    2. Verificar que el usuario sea miembro de la comunidad
    3. Verificar que `discussion_start_date` <= now()
    4. Validar que content no esté vacío y máximo 2000 caracteres
    5. Insertar en `community_comments`
    6. Retornar `{ data: comment }` o `{ error: message }`
  - Resultado esperado: un miembro puede comentar si la discusión está habilitada
  - Dependencias: T1, T2

- [ ] **T9: Server action — obtener miembros y comentarios**
  - Implementar server actions de lectura para miembros y comentarios
  - Archivos a crear/modificar: `src/actions/communities.ts` (agregar funciones)
  - Pasos:
    1. Crear función `getCommunityMembers(communityId)` → retorna lista con nombres
    2. Crear función `getBookComments(communityBookId)` → retorna árbol de comentarios (con parent_id)
    3. Crear función `getCommunityBooks(communityId)` → retorna libros con fechas
    4. Crear función `getUserCommunities()` → retorna comunidades del usuario (creadas + miembro)
    5. Crear función `getCommunityById(communityId)` → retorna comunidad con datos del creador
  - Resultado esperado: todas las funciones de lectura disponibles
  - Dependencias: T1, T2

- [ ] **T10: Página — crear comunidad (formulario)**
  - Crear formulario de creación de comunidad
  - Archivos a crear/modificar: `src/app/(app)/communities/new/page.tsx` (nuevo)
  - Pasos:
    1. Crear page.tsx como client component
    2. Formulario con campos: nombre (obligatorio), descripción (opcional)
    3. Llamar `createCommunity` al enviar
    4. Mostrar errores de validación
    5. Redirigir al dashboard o a la comunidad creada tras éxito
  - Resultado esperado: formulario funcional que crea comunidades
  - Dependencias: T3

- [ ] **T11: Página — unirse a comunidad (formulario)**
  - Crear formulario para unirse con código
  - Archivos a crear/modificar: `src/app/(app)/communities/join/page.tsx` (nuevo)
  - Pasos:
    1. Crear page.tsx como client component
    2. Formulario con campo: código de acceso (6 caracteres)
    3. Llamar `joinCommunity` al enviar
    4. Mostrar errores (código inválido, ya es miembro)
    5. Redirigir a la comunidad tras éxito
  - Resultado esperado: formulario funcional para unirse con código
  - Dependencias: T4

- [ ] **T12: Dashboard — sección de comunidades**
  - Agregar sección de comunidades al dashboard principal
  - Archivos a crear/modificar: `src/app/(app)/page.tsx` (modificar)
  - Pasos:
    1. Importar `getUserCommunities()` en el server component
    2. Agregar sección "Mis comunidades" (creadas por el usuario)
    3. Agregar sección "Comunidades que sigo" (miembro)
    4. Renderizar tarjetas con nombre, num miembros, libro actual
    5. Si no hay comunidades, mostrar mensaje + botón "Unirse con código"
    6. Agregar botón "Crear comunidad"
  - Resultado esperado: dashboard muestra comunidades del usuario
  - Dependencias: T9, T10, T11

- [ ] **T13: Página — detalle de comunidad**
  - Crear página de detalle con tabs: Libros, Discusión, Miembros
  - Archivos a crear/modificar: `src/app/(app)/communities/[id]/page.tsx` (nuevo)
  - Pasos:
    1. Crear page.tsx como client component
    2. Obtener comunidad + miembros + libros con `getCommunityById`, `getCommunityMembers`, `getCommunityBooks`
    3. Header: nombre de comunidad + código de acceso (visible solo para creador)
    4. Tab "Libros": lista de libros asignados + formulario para asignar (solo creador)
    5. Tab "Discusión": selector de libro + hilo de comentarios
    6. Tab "Miembros": lista de miembros + botón expulsar (solo creador) + botón salir
  - Resultado esperado: página completa de gestión de comunidad
  - Dependencias: T7, T8, T9, T6, T5

- [ ] **T14: Componente — hilo de discusión**
  - Crear componente de hilo de comentarios encadenados
  - Archivos a crear/modificar: `src/app/(app)/communities/[id]/_components/discussion-thread.tsx` (nuevo)
  - Pasos:
    1. Crear componente `DiscussionThread` que reciba `bookId` y `comments`
    2. Renderizar árbol de comentarios con indentación para respuestas
    3. Botón "Responder" en cada comentario que abra input inline
    4. Formulario para nuevo comentario al final del hilo
    5. Verificar si la discusión está habilitada (fecha vs hoy)
    6. Mostrar "La discusión comenzará el X" si no está habilitada
  - Resultado esperado: hilo de twitter-like funcionando con respuestas encadenadas
  - Dependencias: T8

- [ ] **T15: Navegación — actualizar sidebar**
  - Agregar enlace a comunidades en la sidebar
  - Archivos a crear/modificar: `src/app/(app)/_components/sidebar.tsx` (modificar)
  - Pasos:
    1. Agregar ícono de grupo/comunidad
    2. Agregar enlace "Comunidades" a `/` (dashboard) o sección visible
  - Resultado esperado: sidebar incluye navegación a comunidades
  - Dependencias: ninguna

- [ ] **T16: Middleware — proteger rutas de comunidades**
  - Actualizar middleware para proteger rutas `/communities/*`
  - Archivos a crear/modificar: `middleware.ts` (modificar)
  - Pasos:
    1. Agregar `/communities` al matcher de rutas protegidas
    2. Verificar que rutas como `/communities/new`, `/communities/join`, `/communities/[id]` estén protegidas
  - Resultado esperado: usuarios no autenticados son redirigidos a login
  - Dependencias: ninguna

### Orden de implementación

```plaintext
T1 → T2 → T3 → T10
            ↘ T4 → T11
            ↘ T5 → T13
            ↘ T6 ↗
            ↘ T7 ↗
            ↘ T8 → T14
            ↘ T9 ↗
T15 (paralelo)
T16 (paralelo)
T12 (al final, después de T10, T11)
```

### Notas de implementación

- Seguir patrón existente de server actions en `src/actions/` (como `challenges.ts` y `books.ts`)
- Usar `createClient` de `src/lib/supabase/server.ts` para queries server-side
- No usar shadcn/ui (el proyecto no lo tiene integrado) — UI con Tailwind puro
- Seguir convenciones de colores del proyecto: `paper`, `ink`, `gold`, `burgundy`, `sage`
- El código de acceso se genera con `Math.random().toString(36).substring(2, 8).toUpperCase()` o similar
- RLS en communies: solo miembros ven datos, creator tiene permisos extra verificados en server actions
- Los comentarios usan `parent_id` nullable para encadenar respuestas (árbol de 2 niveles max)
