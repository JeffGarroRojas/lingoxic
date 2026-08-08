# Lingoxic

Aplicación web de aprendizaje de inglés para estudiantes costarricenses de secundaria (niveles A1-B2), alineada al currículo MEP. La app funciona **sin backend**: todos los datos del usuario se guardan en el navegador (IndexedDB) y las respuestas de IA se obtienen de Gemini con caché local.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite |
| Estilos | Tailwind CSS (modo oscuro) |
| Estado | Context API (`UserProvider`, `ThemeProvider`) |
| Base de datos | IndexedDB vía Dexie (local, sin servidor) |
| Inteligencia artificial | Google Gemini (`@google/generative-ai`) |
| PWA | `vite-plugin-pwa` (instalable, offline) |
| Iconos | `lucide-react` |
| Animaciones | `framer-motion` |
| Gráficos | `recharts` |
| Autenticación | No hay login real: el usuario se crea en el Onboarding y se persiste en IndexedDB |

## Requisitos

- Node.js 18+ y npm

## Instalación y ejecución

```bash
npm install       # instala dependencias
npm run dev       # servidor de desarrollo (Vite)
npm run build     # build de producción (regenera assets del service worker)
npm run preview   # previsualizar el build
npm test          # tests con Vitest (validación de datos)
```

No hay lint ni typecheck configurados.

## API de Gemini

La app usa la API de Google Gemini. La clave `API_KEY` está definida en `src/services/gemini.js` (hardcodeada). No requiere variable de entorno.

## Arquitectura

```
main.jsx → App.jsx
  ├── App: decide entre <Onboarding/> (sin usuario) y <AnimatedRoutes/> (logueado)
  ├── UserProvider → ThemeProvider
  └── AnimatedRoutes: <Routes> con <Layout/> (Outlet) + rutas lazy
```

### Estructura de carpetas

```
src/
├── main.jsx            # entrada; BrowserRouter
├── App.jsx             # routing + Onboarding (3 pasos) + providers
├── pages/              # 16 páginas cargadas con lazy()
├── components/         # Layout.jsx (sidebar + header) y ui.jsx (kit: Button, Card, Badge...)
├── hooks/              # useUser.jsx (estado central del usuario), useTheme.jsx
├── services/           # firebase.js, db.js (Dexie), gemini.js
├── utils/              # level.js (niveles A1-B2, streakEmoji, genId)
└── data/               # contenido estático (unidades, vocabulario, speaking)
```

## Rutas

| Ruta | Página | Descripción |
|---|---|---|
| `/dashboard` | Dashboard | Home: streak, nivel/XP y tarjetas de acceso |
| `/diagnostic` | Diagnostic | Test de ubicación inicial |
| `/learn` | Learn | Unidades temáticas MEP (bloqueadas por nivel) |
| `/unit/:unitId` | UnitDetail | Lecciones de una unidad + botón quiz |
| `/lesson/:unitId/:lessonId` | LessonDetail | Lección con bloques (explanation/vocabulary/example/grammar/tip) |
| `/quiz/:unitId/:quizId` | QuizPage | Quiz temporizado con % mínimo para aprobar |
| `/listening` | Listening | Comprensión auditiva (speechSynthesis + preguntas MC) |
| `/reading` | Reading | Texto + preguntas de opción múltiple |
| `/writing` | Writing | Escritura corregida por Gemini |
| `/speaking` | Speaking | Lección MC + tutor de chat con Gemini |
| `/vocabulary` | Vocabulary | Glosario con búsqueda y audio |
| `/grammar` | Grammar | Ejercicios MC por tema gramatical |
| `/progress` | Progress | Gráfico de actividad, nivel/XP, streak |
| `/practice` | Practice | Pool mixto de 10 preguntas filtrable por skill |
| `/exam-sim` | ExamSim | Simulacro de 100 preguntas con temporizador |
| `/settings` | Settings | Perfil, tema, límites de IA, reset de progreso |

## Base de datos local (Dexie)

Esquema IndexedDB (tablas: `user`, `examResults`, `aiCache`, `dailyCounters`):

- **user** — objeto único con perfil y progreso: `name`, `level`, `xp`, `completedLessons`, `completedQuizzes`, `weakAreas`, `streak`, `lastActiveDate`.
- **examResults** — resultados de simulacros (`saveExamResult`/`getExamResult`).
- **aiCache** — caché de respuestas Gemini con `expiresAt` (`getCachedAI`/`setCachedAI`).
- **dailyCounters** — contador diario de solicitudes de IA (`getGeminiCount`/`setGeminiCount`).

El usuario NO se sincroniza con un servidor. Firebase (Firestore) se importa como opcional pero el almacenamiento real es IndexedDB.

## Uso de IA (Gemini)

- **Writing**: `correctWriting(text, level)` — evalúa gramática, vocabulario, fluidez y contenido; puntaje y feedback.
- **Speaking**: `evaluateSpeaking(...)` y tutor conversacional `chatWithTutor(message, topic, level, history)`.
- **Límites**: 15 solicitudes por sesión (`LÍMITE_LOCAL` en `GEMINI_CONFIG`) y límite diario (`LÍMITE_GEMINI`), gestionados con los contadores de `dailyCounters`. Las respuestas se cachean para no gastar cuota.

## PWA

La app es instalable y funciona offline (manifest + service worker vía `vite-plugin-pwa`). Después de cambios de build, ejecuta `npm run build` para regenerar los assets del service worker. Las páginas con temporizador/actividad usan `useActivityGuard` para avisar antes de actualizar.

## Tests

`npm test` ejecuta Vitest. Los tests validan datos (`src/data/diagnosticData.test.js`, `grammarData.test.js`, `unitsData.test.js`) y componentes (`src/pages/Dashboard.test.jsx`). Verifican que cada unidad tenga `icon`/`color`, skills válidas y `correctAnswer` en opciones.
