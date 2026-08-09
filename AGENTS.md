# Lingoxic

Aplicación web de aprendizaje de inglés (niveles A1-B2), orientada al currículo MEP de Costa Rica. React + Vite + Tailwind, SPA con datos locales en IndexedDB (Dexie) y caché de IA en Gemini. Sin backend: la "base de datos" es el navegador del usuario. Firebase SDK se importa pero es opcional (sincronización Firestore degradada).

## Comandos

```bash
npm run dev        # dev server Vite
npm run build      # build producción (también regenera assets del SW)
npm run preview    # preview del build
npm test           # vitest run (tests de datos + componentes)
npm run deploy     # npm run build && firebase deploy --only hosting
```

**Chequeos obligatorios al terminar un cambio**: `npm test` (vitest, validación de datos: unidades con `icon`/`color`, skills válidas, correctAnswer en opciones) y `npm run build`. No hay lint ni typecheck configurados.

## Reglas de estabilidad (PWA)

- **Crash de Dashboard**: toda unidad en `unitsData.js` DEBE tener `icon` (string) y `color` (gradiente `from-*`) — el Dashboard hace `u.color.split(" ")` y se cae si falta (crash real ocurrido en producción). Además, Dashboard/Learn/UnitDetail tienen fallback `|| "from-sky-500 to-blue-500"` y el test `unitsData.test.js` bloquea el deploy si falta.
- **Actualización del SW**: las páginas con temporizador/actividad en curso (ExamSim, QuizPage, Diagnostic) usan `useActivityGuard(active)` (de `src/hooks/useActivityGuard.jsx`). Al pulsar "Actualizar" en el banner PWA, `App.jsx` muestra confirmación si hay actividad en curso.
- Los tests en `src/data/*.test.js` y `src/pages/Dashboard.test.jsx` son la red de seguridad: ejecútalos antes de cada deploy.

## Arquitectura general

```
main.jsx → App.jsx
  ├── App: decide entre <Onboarding/> (sin usuario) y <AnimatedRoutes/> (logueado)
  ├── UserProvider → ThemeProvider
  └── AnimatedRoutes: <Routes> con <Layout/> (Outlet) + 15 rutas lazy
```

- **Entrada**: `src/main.jsx` → renderiza `src/App.jsx` (con `BrowserRouter` en main).
- **Flujo de autenticación**: no hay login real. El "usuario" es un objeto local creado en el Onboarding (nombre + nivel objetivo). `useUser()` devuelve `user` (null si no existe) → si es null se muestra `Onboarding`, si existe `AnimatedRoutes`.
- **Providers** en `App.jsx`: `UserProvider` → `ThemeProvider`.

## Estructura de archivos

- `src/pages/` — 15 páginas, todas cargadas con `lazy()` desde `src/App.jsx`.
- `src/components/` — `Layout.jsx` (sidebar + header + Outlet), `ui.jsx` (componentes reutilizables: Button, Card, Badge, ProgressBar, LevelBadge, SkillBadge, EmptyState, Modal, etc.).
- `src/hooks/` — `useUser.jsx` (contexto + toda la lógica de estado del usuario), `useTheme.jsx` (dark/light).
- `src/services/` — `firebase.js` (SDK, `db`/`auth` inicializados), `db.js` (capa Dexie), `gemini.js` (cliente de IA).
- `src/utils/` — `level.js` (niveles A1/B1/B2 con colores, `streakEmoji`, `genId`).
- `src/data/` — contenido estático (ver abajo).

## Onboarding (en `App.jsx`, paso previo al login)

Flujo de 3 pasos con estado `step`: `welcome` → `name` → `test`.
- `welcome`: pantalla inicial con botón "Comenzar ahora".
- `name`: input para capturar el nombre (obligatorio para avanzar).
- `test`: test de ubicación (`PLACEMENT_QUESTIONS` importado de `src/data/`), avanza por preguntas y al terminar crea el usuario con `createUser` + `syncUserToFirestore` y fija el nivel inicial.

Si `user` ya existe (persistido en IndexedDB), `App` salta directo a `<AnimatedRoutes/>`.

## Rutas (mapa completo)

| Ruta | Página | Notas |
|---|---|---|
| `/dashboard` | Dashboard | Home, tarjetas de acceso a secciones, streak, nivel |
| `/learn` | Learn | Lista de unidades temáticas MEP (6), bloqueadas por nivel previo |
| `/unit/:unitId` | UnitDetail | Lecciones de una unidad + botón quiz |
| `/lesson/:unitId/:lessonId` | LessonDetail | Lección con bloques: explanation/vocabulary/example/grammar/tip |
| `/quiz/:unitId/:quizId` | QuizPage | Quiz temporizado, % mínimo para aprobar, da XP |
| `/listening` | Listening | TTS (speechSynthesis) + preguntas de opción múltiple |
| `/reading` | Reading | Texto + preguntas MC con verificación |
| `/writing` | Writing | Escribe texto, Gemini corrige y evalúa |
| `/speaking` | Speaking | Modo lección (quiz MC) + tutor de chat con Gemini |
| `/vocabulary` | Vocabulary | Glosario con búsqueda, filtro por unidad, audio |
| `/grammar` | Grammar | Ejercicios MC por tema gramatical con feedback inmediato |
| `/progress` | Progress | Gráfico (recharts), nivel/XP, streak |
| `/practice` | Practice | Pool mixto quiz+gramática, filtra por skill, 10 preguntas |
| `/exam-sim` | ExamSim | Simulacro de 100 preguntas con temporizador, guarda resultado |
| `/settings` | Settings | Perfil, tema, requests IA restantes, reset de progreso |
| `*` | → Navigate `/dashboard` | Fallback |

### Detalle por página

- **Dashboard** — saluda por nombre, muestra streak (`Flame`), nivel/XP y tarjetas de acceso a cada sección.
- **Learn** — lista las 6 unidades MEP; desbloquea la siguiente al completar la anterior (vía `completedLessons`); barra de progreso por unidad.
- **UnitDetail** — lee `unitsData.js` por `unitId`, lista lecciones con check de completado y botón al quiz.
- **LessonDetail** — renderiza bloques en orden (explanation → vocabulary → example → grammar → tip); "Completar" llama `completeLesson(lessonId)` y da XP.
- **QuizPage** — quiz temporizado por pregunta; exige % mínimo para aprobar; al aprobar `completeQuiz(quizId)` + XP.
- **Listening** — `speechSynthesis` (TTS) lee el script; preguntas MC con verificación.
- **Reading** — texto de comprensión + preguntas MC con feedback.
- **Writing** — elige tema, escribe texto; Gemini lo corrige con `correctWriting` (puntaje + feedback, en caché).
- **Speaking** — dos modos: lección MC de `speakingData` y tutor de chat con `chatWithTutor` (historial en estado).
- **Vocabulary** — búsqueda, filtro por unidad, audio (MP3 o fallback TTS).
- **Grammar** — temas de `grammarData.js`, ejercicios MC con feedback verde/rojo inmediato.
- **Progress** — gráfico `recharts` de actividad/XP, nivel, streak, unidades completadas.
- **Practice** — pool mixto (quiz + gramática) de 10 preguntas, filtro por skill, da XP.
- **ExamSim** — simulacro de 100 preguntas con temporizador; guarda con `saveExamResult`.
- **Settings** — edita nombre/nivel, tema dark/light, límites IA restantes, `resetProgress()` con confirmación.

## Componentes (`src/components/`)

### `ui.jsx` — kit reutilizable
- `cn(...classes)` — utilidad de merge de clases.
- `Button` — variantes `primary`/`secondary`/`ghost`/`danger`, tamaños `sm`/`md`/`lg`.
- `Card`, `Badge`, `ProgressBar`, `LevelBadge`, `SkillBadge` (skills: reading/listening/writing/speaking con colores), `EmptyState`, `Modal`.

### `Layout.jsx` — shell de las rutas autenticadas
- Sidebar colapsable con navegación a todas las rutas (iconos `lucide-react`, `NavLink`).
- Header sticky con streak (`Flame`), nivel, y toggle de tema.
- Renderiza `<Outlet/>` dentro de `AnimatedRoutes`; en móvil sidebar como overlay.

## Servicios

### `src/services/db.js` — capa Dexie (IndexedDB)

Esquema (versiones ~3): tablas `user`, `examResults`, `aiCache`, `dailyCounters`.

Funciones clave:
- `getUser()` / `saveUser(user)` / `updateUser(patch)` — la tabla `user` guarda un único objeto (se lee con `db.user.toArray()[0]`).
- `getCachedAI(prompt)` / `setCachedAI(prompt, response)` — caché de respuestas Gemini por hash del prompt (clave `ai_<hash>` en `aiCache`, con `expiresAt`).
- `getGeminiCount()` / `setGeminiCount(n)` — contador de solicitudes de IA en `dailyCounters` (fecha con `todayStr()`).
- `saveExamResult(result)` / `getExamResult()` — simulacros en `examResults`.
- `todayStr()` — fecha actual como clave de día (ISO, `YYYY-MM-DD`).

### `src/services/gemini.js` — cliente Gemini

- `callGemini(prompt)` — wrapper con manejo de errores y `ERROR_MESSAGES` en español. Comprueba límites de sesión (`MAX_REQUESTS_PER_SESSION`) y diario antes de llamar a la API; devuelve el mensaje de error correspondiente si se excede.
- `correctWriting(text, level)` — evalúa 4 criterios (gramática, vocabulario, fluidez, contenido) y devuelve feedback + puntaje.
- `evaluateSpeaking(...)` — evalúa habla.
- `chatWithTutor(message, topic, level, history)` — tutor conversacional.
- Límites: sesión (`LÍMITE_SESION`) y diario (`LÍMITE_GEMINI`), gestionados con `getGeminiCount`/`setGeminiCount`.

### `src/services/firebase.js`

Importa Firebase SDK e inicializa `db` (Firestore) y `auth`. Se usa `syncUserToFirestore` de forma degradada/opcional; el almacenamiento real es IndexedDB.

## Hook `useUser` (estado central)

`UserProvider` crea y persiste en IndexedDB el objeto usuario. Forma:

```
{ name, level (objetivo), xp, completedLessons: [], completedQuizzes: [],
  weakAreas: [], streak, lastActiveDate, ... }
```

Métodos expuestos por `useUser()`:
- `completeLesson(lessonId)` — añade a `completedLessons` y da XP.
- `completeQuiz(quizId)` — añade a `completedQuizzes`, da XP.
- `addXp(n)`, `updateWeakAreas(...)`, `resetProgress()` — reset limpio del usuario.
- `createUser(user)` / `updateUser(patch)` — persistencia en Dexie.
- El estado es local; los cambios se propagan vía contexto React (no usa `useLiveQuery`).

## Datos estáticos (`src/data/`)

- `unitsData.js` — 6 unidades temáticas MEP (p.ej. `my-profile`, `safe-travels`). Cada unidad tiene `lessons[]` con bloques de tipo: `explanation`, `vocabulary`, `example`, `grammar`, `tip` (consejo para examen MEP). Incluye lecturas (`reading-1`, etc.) y quizzes por unidad.
- `vocabularyData.js` — glosario por unidad: `word`, `translation`, `definition`, `example`, `phonetic`.
- `speakingData.js` — prompts de conversación con `options` y `explanation` en español.
- `grammarData.js` — temas gramaticales con `level` (A1), `description`, `explanation`, ejercicios.
- `practiceData.js` — preguntas de práctica con `level`.
- `listeningData.js` — scripts + preguntas para listening (TTS).

## Convenciones

- **React Query** para fetching/cache de datos remotos (mínimo uso; la mayoría del estado es local).
- **Tailwind CSS** con modo oscuro (`dark:` classes) gestionado por `useTheme`.
- Los prompts de IA (Gemini) están en **español**, aunque el contenido didáctico sea en inglés.
- El estado del usuario se persiste en IndexedDB, no en el servidor.
- Iconos vía `lucide-react`; animaciones vía `framer-motion`; charts vía `recharts`.

## Reglas anti-congelamiento (modelo DeepSeek)

El modelo se congela o corta la respuesta a mitad de tarea por agotar output tokens. Para evitarlo:

1. **Nunca reescribas un archivo completo** al editar. Usa `edit` para cambios puntuales o muestra solo las funciones afectadas con `// ... resto igual ...`.
2. **Fragmenta**: si el cambio requiere >40 líneas, entrégalo en bloques. Termina el bloque con `[BLOQUE N COMPLETADO] Escribe 'sigue' para el Bloque N+1`.
3. **Cortes limpios**: si calculas que vas a quedarte sin tokens, detente al final de la última función completa y avisa que continuarás en el próximo mensaje.
4. **Cero verbosidad**: sin introducciones ni explicaciones teóricas. Solo el cambio, directo.

## Regla de oro: montos monetarios (docs/ y propuestas)

Los precios son CRÍTICOS para la negociación con American Business Academy. Antes de escribir cualquier número de dinero en `docs/` u otros archivos:

1. **Verifica la fórmula base** (definida en `docs/propuesta-lingoxic.md`): la tarifa es **250 CRC/estudiante/mes** (anual: 3.000 CRC/usuario/año).
   - 50 usuarios × 2 meses = 25.000 CRC (NO 100.000).
   - 500 usuarios × 3.000 CRC/año = 1.500.000 CRC.
2. **Recalcula en cada edición**: nunca copies un monto de memoria; recalcula la multiplicación y confirma con grep que no queden montos obsoletos.
3. **Si tienes dudas, pregunta al usuario antes de escribir el número.**

## PWA

La app es instalable (manifest + service worker vía `vite-plugin-pwa`). Tras cambios de build, `npm run build` regenera los assets del SW.
