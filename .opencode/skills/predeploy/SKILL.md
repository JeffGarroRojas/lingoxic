# Pre-deploy: verificación antes de subir a producción

## Cuándo usar
Siempre antes de hacer `npm run deploy` o `npx firebase deploy`. La app ya tuvo 3 bugs de producción:
- `isOnline` y `useNavigate`: variables usadas sin declarar.
- `exercise` usado antes de declararlo (TDZ: "Cannot access before initialization").

Este skill evita repetirlos.

## Pasos obligatorios (en orden)

1. **Scope check** — detecta variables usadas sin declarar:
```bash
node scripts/scope-check.mjs
```
Debe terminar con `✅ Scope check OK`. Si falla, corrige ANTES de continuar.

2. **Tests**:
```bash
npm test
```
Todos deben pasar (`N passed`). **OJO**: los tests NO detectan TDZ en runtime; son una capa, no la única.

3. **Build** (DETECTA errores TDZ como el de producción):
```bash
npm run build
```
Debe terminar con `files generated`. **El build es la red de seguridad final contra TDZ** (esbuild/rollup fallan si una variable se usa antes de inicializarse).

4. **Verificación TDZ manual en archivos recién editados** — si editaste JSX con `const`, revisa el ORDEN: ninguna variable debe usarse en una línea anterior a su `const`. El caso real que rompió producción fue usar `exercise` en `transcription` ANTES de la línea `const exercise = ...`.

5. **Verificar secretos** (no debe salir nada):
```bash
git diff --cached|grep -iE 'AIza|AQ\\.Ab|apiKey.*[=:] *"'
git status --short
```

6. **Solo si los 5 pasos pasan**: hacer commit y `npx firebase deploy --only hosting`.

## Si un paso falla
- Detente, corrige el error, y repite desde el paso 1.
- NUNCA despliegues con scope check fallando, tests rojos, build con errores o TDZ.

## Archivo clave
- `scripts/scope-check.mjs` — analizador de scope (variables sin declarar en componentes). NO detecta TDZ (uso antes de declaración); eso lo cubre `npm run build`.
