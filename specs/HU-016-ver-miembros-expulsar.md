# HU-016: Ver miembros y expulsar (solo creador)

**Prioridad:** Must
**Rol:** Como creador de una comunidad
**Funcionalidad:** quiero ver la lista de miembros de mi comunidad y poder expulsar a alguno
**Valor:** para mantener control sobre quién participa en la comunidad

## Criterios de aceptación

- [ ] Escenario: Ver lista de miembros
  - **Dado** que soy creador de la comunidad "Leer clásicos" con 5 miembros
  - **Cuando** accedo a la sección de miembros
  - **Entonces** veo la lista con nombres y fecha de unión, indicando quién es el creador

- [ ] Escenario: Expulsar miembro
  - **Dado** que "Carlos" es miembro de mi comunidad
  - **Cuando** hago clic en "Expulsar" junto a su nombre y confirmo
  - **Entonces** Carlos ya no aparece en la lista y no puede ver ni comentar en la comunidad

- [ ] Escenario: Miembro normal no puede ver botón de expulsar
  - **Dado** que soy miembro normal (no creador)
  - **Cuando** accedo a la lista de miembros
  - **Entonces** veo la lista pero no veo el botón de expulsar junto a ningún miembro

## Fuera de alcance

- Ver perfil de otros miembros
- Buscar miembros por nombre
- Transferir rol de creador a otro miembro

## Notas / Restricciones

- Solo el creador (rol `creator`) puede expulsar miembros
- El creador no puede expulsarse a sí mismo
- Al expulsar se elimina el registro de `community_members`
- RLS: cualquier miembro puede ver la lista, pero la acción de expulsar es server-side solo para creators

## Plan de Ejecución

Esta HU está cubierta dentro del plan de HU-012 (T6, T13).
