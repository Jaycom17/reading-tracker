# HU-013: Unirse a comunidad con código de acceso

**Prioridad:** Must
**Rol:** Como usuario registrado
**Funcionalidad:** quiero unirme a una comunidad de lectura ingresando un código de acceso de 6 caracteres
**Valor:** para poder participar en discusiones de libros con otros lectores

## Criterios de aceptación

- [ ] Escenario: Unirse exitosamente
  - **Dado** que ingreso el código `A3X9K2` de una comunidad existente
  - **Cuando** confirmo unión
  - **Entonces** aparezco como miembro de la comunidad y puedo ver sus libros y discusiones

- [ ] Escenario: Código inexistente
  - **Dado** que ingreso el código `ZZZZZZ` que no corresponde a ninguna comunidad
  - **Cuando** intento unirme
  - **Entonces** recibo un error "Código de acceso no válido"

- [ ] Escenario: Ya soy miembro
  - **Dado** que ya pertenezco a la comunidad con código `A3X9K2`
  - **Cuando** intento unirme de nuevo con el mismo código
  - **Entonces** recibo un mensaje "Ya perteneces a esta comunidad"

## Fuera de alcance

- Unirse mediante link de invitación
- Aprobación del creador para entrar
- Límite de miembros

## Notas / Restricciones

- Cualquier usuario autenticado puede unirse con un código válido
- Un usuario puede pertenecer a múltiples comunidades
- El código se busca en la tabla `communities.access_code`
- Se inserta en `community_members` con rol `member`

## Plan de Ejecución

Esta HU está cubierta dentro del plan de HU-012 (T4, T11).
