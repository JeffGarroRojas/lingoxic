# Firebase (estado operativo)

Proyecto: **lingoxic** (`919601261177`)
App web: **LinGoXiC Web** (`1:919601261177:web:ce5cb1b0c3866bc28142a8`)
Realtime Database: `https://lingoxic-default-rtdb.firebaseio.com`
Hosting: `https://lingoxic.web.app`

## Variables (`.env`, no se commitea)

```env
VITE_FIREBASE_PROJECT_ID=lingoxic
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=lingoxic.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://lingoxic-default-rtdb.firebaseio.com
VITE_FIREBASE_APP_ID=1:919601261177:web:ce5cb1b0c3866bc28142a8
```

Sin ellas la app arranca en modo 100 % local (IndexedDB) y no intenta conectar.

## Rutas en la base de datos

| Ruta | Contenido |
|---|---|
| `progress/<userId>` | Copia del progreso: nombre, nivel, XP, racha, lecciones/quizzes, áreas débiles, diagnóstico, `updatedAt`. |
| `users/<userId>` | Registro de quién entra: nombre, nivel, dispositivo, agente y `lastSeen`. |
| `entries/<entryId>` | Bitácora append-only de entradas (`userId`, `name`, `level`, `at`, `deviceId`, `agent`). |

Las reglas no permiten lectura desde el cliente (`.read: false`): la consulta se hace desde la consola o con el CLI (`firebase database:get`), que omite reglas.

```bash
# Ver la bitácora de entradas
npx firebase database:get /entries --project lingoxic | tail -1

# Ver usuarios registrados
npx firebase database:get /users --project lingoxic | tail -1
```

## Registro de entradas

- `users/<userId>`: perfil de quien entra (nombre, nivel, dispositivo, `lastSeen`).
- `entries/<entryId>`: bitácora append-only, una por sesión de navegador.
- Las reglas tienen `.read: false`; se consultan con el CLI/consola (omiten reglas).

## Ver el registro de entradas

```bash
npm run registro                # tabla: fecha, nombre, nivel, dispositivo, usuario
npm run registro -- --csv       # CSV para Excel/Sheets
npm run registro -- --json      # JSON crudo
```

## Activar App Check (anti-abuso de Firebase)

El cliente ya soporta App Check; falta crear la site key y forzarlo:

1. Crea una clave **reCAPTCHA v3** en https://www.google.com/recaptcha/admin/create con los dominios:
   `lingoxic.web.app`, `lingoxic.firebaseapp.com`, `localhost`.
2. Copia la *site key* a `.env`: `VITE_RECAPTCHA_SITE_KEY=...` y ejecuta `npm run deploy`.
3. En Firebase Console → **App Check** → Realtime Database → registra el proveedor reCAPTCHA v3 y pulsa **Enforce**.
4. Verifica en producción que la app sigue escribiendo en `progress/` y `entries/`.

## Protección de la clave de IA

La clave de Gemini (`VITE_GEMINI_API_KEY`) está en un proyecto propio (`lingoxic`) y **restringida por HTTP referrer**:

- `https://lingoxic.web.app/*`
- `https://lingoxic.firebaseapp.com/*`
- `http://localhost:5173/*`, `http://127.0.0.1:5173/*`
- `http://localhost:4173/*`, `http://127.0.0.1:4173/*`

Desde otro dominio o sin referrer, Google responde **403**. Si la clave se filtra, se rota en Google Cloud → APIs y servicios → Credenciales (clave `lingoxicweb2026`).

Protección adicional recomendada:

1. Activar **App Check** con reCAPTCHA v3 (variable `VITE_RECAPTCHA_SITE_KEY`) y luego forzarlo en Firebase Console para RTDB.
2. Si se necesita ocultar la clave por completo, mover las llamadas a una Cloud Function proxy (requiere plan Blaze).

## Comandos

```bash
# Reglas de la base de datos
npx firebase deploy --only database --project lingoxic

# Build + hosting
npm run build
npx firebase deploy --only hosting --project lingoxic

# Ver la copia central de un usuario
npx firebase database:get /progress --project lingoxic
```

## Notas

- IndexedDB sigue siendo la fuente de verdad; la nube es una copia best-effort. Sin red, la app funciona y sincroniza en el siguiente cambio (no hay cola persistente entre recargas).
- Firestore quedó fuera: la API está deshabilitada en el proyecto y no se usa.
- No hay autenticación de usuarios finales (el `userId` es local). Las reglas permiten lectura del progreso; para producción con datos sensibles conviene activar Firebase Auth o reglas por token.
