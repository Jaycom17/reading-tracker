# HU-010: Eliminar libro (solo si "En progreso" o "Por leer")

**Prioridad:** Should
**Rol:** Como usuario que añadió un libro por error
**Funcionalidad:** quiero eliminar un libro que aún no he completado
**Valor:** para corregir errores sin ensuciar mi historial

## Criterios de aceptación

- [ ] Escenario: Eliminar libro "Por leer"
  - **Dado** un libro en estado "Por leer"
  - **Cuando** hago click en icono eliminar y confirmo
  - **Entonces** el libro se borra de BD, la lista se actualiza, cupo se libera (puedo añadir otro)

- [ ] Escenario: Eliminar libro "En progreso"
  - **Dado** un libro en estado "En progreso"
  - **Cuando** lo elimino
  - **Entonces** se borra, cupo se libera

- [ ] Escenario: NO eliminar libro "Completado"
  - **Dado** un libro en estado "Completado"
  - **Cuando** intento eliminarlo
  - **Entonces** botón eliminar no visible / deshabilitado, tooltip "No se pueden eliminar libros completados"

- [ ] Escenario: Confirmación antes de borrar
  - **Dado** voy a eliminar un libro
  - **Cuando** click en eliminar
  - **Entonces** modal confirma "¿Eliminar 'El Hobbit'? Esta acción no se puede deshacer"

- [ ] Escenario: Actualiza contador cupos
  - **Dado** meta=5, 4 libros (1 completado, 3 por leer)
  - **Cuando** elimino uno "Por leer"
  - **Entonces** veo "4 de 5 libros añadidos" y botón "Añadir libro" habilitado

## Fuera de alcance
- Papelera / recuperar eliminados
- Eliminar en lote

## Notas / Restricciones
- Server Action: `deleteBook(bookId)` → verifica estado ≠ 'completado' → delete → revalidatePath
- RLS: solo libros de retos propios
- UI: icono trash en fila del libro (hover), solo si status !== 'completado'
- Cascade delete en BD ya configurado (books → challenge_id on delete cascade)