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
| `users/<deviceId>` | Registro de dispositivo del control de acceso (códigos ABA/MEP). |
| `access` | Estado global del código de academia (`active`, `academyFirstUsedAt`). |

Reglas en `docs/rtdb-rules.json`.

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
