# Receptor de eventos (Google Apps Script)

La app manda los eventos de uso a una Web App de Google Apps Script, y la Web App los guarda en una Google Sheet con una fila por evento. Las columnas son `userId`, `type`, `ts`, `localDate`, `screen` y `data`.

## Publicarlo

1. Crear una Google Sheet nueva, por ejemplo "UNLaM-Gym TP5 – eventos", con la cuenta del equipo.
2. En la hoja, ir a **Extensiones → Apps Script**.
3. Borrar el contenido de `Code.gs` y pegar el de [`Code.gs`](Code.gs). Guardar.
4. **Implementar → Nueva implementación**.
   - Tipo: **Aplicación web**.
   - Ejecutar como: **Yo** (la cuenta dueña de la hoja).
   - Quién tiene acceso: **Cualquier persona**.
5. Autorizar los permisos que pide Google: acceso a la hoja.
6. Copiar la **URL de la aplicación web**. Termina en `/exec`.
7. Pegarla en `app/js/config.js`:

   ```js
   export const EVENTS_ENDPOINT = "https://script.google.com/macros/s/XXXX/exec";
   ```

8. Hacer commit y publicar la app.

## Comprobar que funciona

- Abrir la URL `/exec` en el navegador. Tiene que responder `{"ok":true,"service":"unlam-gym-events"}`.
- Abrir la app y navegar un poco. En unos segundos aparece la hoja `eventos` con filas nuevas.
- Desde una terminal:

  ```bash
  curl -L -H "Content-Type: text/plain" \
    -d '{"events":[{"userId":"demo","type":"test","ts":"2026-10-31T10:00:00.000-03:00","localDate":"2026-10-31","screen":"hoy","data":{}}]}' \
    "https://script.google.com/macros/s/XXXX/exec"
  ```

## Notas

- Si se cambia `Code.gs`, hay que ir a **Implementar → Administrar implementaciones → Editar → Nueva versión**. Si no, la URL sigue ejecutando la versión anterior.
- La app envía con `mode: "no-cors"`, así que no puede leer la respuesta. Si el envío falla por falta de red, el lote queda en la cola del celular y se reintenta. En casos raros, por ejemplo cuando se corta la conexión justo después de que Google recibió el lote, se puede repetir una fila. Para limpiar duplicados, filtrar las filas idénticas en `userId` + `type` + `ts`: `ts` tiene milisegundos.
- No se envían datos personales: `userId` es solo `U1`, `U2`, `U3` o `demo`.
