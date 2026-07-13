# HU-017: Salirse de una comunidad

**Prioridad:** Must
**Rol:** Como miembro de una comunidad (no creador)
**Funcionalidad:** quiero poder salirme de una comunidad de lectura
**Valor:** para dejar de participar si ya no me interesa el grupo

## Criterios de aceptación

- [ ] Escenario: Salirse exitosamente
  - **Dado** que soy miembro de la comunidad "Leer clásicos"
  - **Cuando** hago clic en "Salir de la comunidad" y confirmo
  - **Entonces** dejo de aparecer como miembro y no puedo ver ni comentar en la comunidad

- [ ] Escenario: Creador intenta salirse
  - **Dado** que soy el creador de la comunidad
  - **Cuando** intento salirme
  - **Entonces** veo un mensaje "El creador no puede salirse. Debe transferir la propiedad o eliminar la comunidad" (eliminar no implementado en MVP)

- [ ] Escenario: Confirmación antes de salir
  - **Dado** que hago clic en "Salir de la comunidad"
  - **Cuando** aparece el diálogo de confirmación
  - **Entonces** debo confirmar antes de que se ejecute la acción

## Fuera de alcance

- Eliminar la comunidad (solo el creador podría en futuro)
- Transferir propiedad de la comunidad
- Re-automáticamente después de salirse

## Notas / Restricciones

- El creador no puede salirse (debe haber al menos un creator)
- Se elimina el registro de `community_members`
- Los comentarios previos del usuario se mantienen en el hilo

## Plan de Ejecución

Esta HU está cubierta dentro del plan de HU-012 (T5, T13).
