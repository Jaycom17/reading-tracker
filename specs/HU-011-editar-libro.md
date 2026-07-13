# HU-011: Editar título/autor de un libro

**Prioridad:** Could
**Rol:** Como usuario que escribió mal un título o autor
**Funcionalidad:** quiero editar los datos de un libro ya añadido
**Valor:** para corregir typos sin eliminar y volver a añadir

## Criterios de aceptación

- [ ] Escenario: Editar título
  - **Dado** un libro con título "El Hobbitt" (typo)
  - **Cuando** click en editar, corrijo a "El Hobbit" y guardo
  - **Entonces** se actualiza en BD y lista

- [ ] Escenario: Editar autor
  - **Dado** un libro con autor "JRR Tolkien"
  - **Cuando** edito a "J.R.R. Tolkien" y guardo
  - **Entonces** se actualiza

- [ ] Escenario: Validación obligatorios
  - **Dado** estoy editando un libro
  - **Cuando** dejo título vacío e intento guardar
  - **Entonces** muestra error "El título es obligatorio" y no guarda

- [ ] Escenario: Editar libro completado permitido
  - **Dado** un libro en estado "Completado"
  - **Cuando** edito título/autor
  - **Entonces** permite editar (solo no se puede eliminar, HU-010)

- [ ] Escaneo: Cancelar edición
  - **Dado** estoy en modo edición
  - **Cuando** click "Cancelar" o Escape
  - **Entonces** descarta cambios, vuelve a vista lectura

## Fuera de alcance
- Historial de cambios / auditoría
- Editar estado desde modal de edición (usa HU-006 toggle)

## Notas / Restricciones
- Server Action: `updateBook(bookId, { title, author })` → valida required → update → revalidate
- UI: icono lápiz en fila, abre modal con inputs pre-llenados
- RLS: solo libros de retos propios
- No tocar `status`, `completed_at`, `notes` (separados)