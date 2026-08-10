# Pre-deploy: verificación antes de subir a producción

## Cuándo usar
Siempre antes de hacer `npm run deploy` o `npx firebase deploy`. La app ya tuvo 2 bugs de producción por variables usadas sin declarar (`isOnline`, `useNavigate`). Este skill evita repetirlo.

## Pasos obligatorios (en orden)

1. **Scope check** — detecta variables usadas sin declarar (el bug que rompió producción 2 veces):
   ```bash
   node scripts/scope-check.mjs
   ```
   Debe terminar con `✅ Scope check OK`. Si falla, corrige los errores ANTES de continuar.

2. **Tests**:
   ```bash
   npm test
   ```
   Todos deben pasar (`N passed`).

3. **Build**:
   ```bash
   npm run build
   ```
   Debe terminar con `files generated`.

4. **Verificar secretos** (no debe salir nada):
   ```bash
   git diff --cached | grep -iE 'AIza|AQ\\.Ab|apiKey.*[=:] *"'
   git status --short
   ```

5. **Solo si los 4 pasos pasan**: hacer commit y `npx firebase deploy --only hosting`.

## Si un paso falla
- Detente, corrige el error, y repite desde el paso 1.
- NUNCA despliegues con scope check fallando o tests rojos.

## Archivo clave
- `scripts/scope-check.mjs` — analizador de scope (variables sin declarar en componentes).
