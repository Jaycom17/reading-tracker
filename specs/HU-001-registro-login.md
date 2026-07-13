# HU-001: Registro e inicio de sesión (email/password)

**Prioridad:** Must
**Rol:** Como usuario nuevo o recurrente
**Funcionalidad:** quiero registrarme o iniciar sesión con email y contraseña
**Valor:** para acceder a mis retos y libros privados desde cualquier dispositivo

## Criterios de aceptación

- [ ] Escenario: Registro exitoso
  - **Dado** que no tengo cuenta y estoy en `/login`
  - **Cuando** ingreso email válido, contraseña (mín. 8 chars) y confirmo
  - **Entonces** se crea mi usuario en Supabase Auth, se inicia sesión y redirige a `/` (dashboard)

- [ ] Escenario: Login exitoso
  - **Dado** que ya tengo cuenta registrada
  - **Cuando** ingreso email y contraseña correctos en `/login`
  - **Entonces** inicio sesión y redirige a `/`

- [ ] Escenario: Credenciales inválidas
  - **Dado** que estoy en `/login`
  - **Cuando** ingreso email/contraseña incorrectos
  - **Entonces** veo mensaje genérico "Credenciales inválidas" (sin revelar si email existe)

- [ ] Escenario: Acceso sin sesión a rutas protegidas
  - **Dado** que no tengo sesión activa
  - **Cuando** intento acceder a `/` o `/challenges/*`
  - **Entonces** redirige a `/login` con mensaje "Inicia sesión para continuar"

- [ ] Escenario: Registro con email duplicado
  - **Dado** que el email ya está registrado
  - **Cuando** intento registrarme con ese email
  - **Entonces** veo mensaje genérico "Credenciales inválidas" (no enumera emails)

## Fuera de alcance
- Recuperación de contraseña (Fase 2)
- Login social (Google, GitHub, etc.) — Won't
- Verificación de email — Won't
- Roles/permisos avanzados — Won't

## Notas / Restricciones
- Supabase Auth con email/password habilitado
- RLS en todas las tablas: usuario solo ve sus datos (`auth.uid() = user_id`)
- Middleware protege todas las rutas `/` y `/challenges/*`
- Cookies httpOnly para sesión (server-side)
- Deshabilitar registro público en Supabase Dashboard (solo tú creas cuenta inicial) o gatear con invite code