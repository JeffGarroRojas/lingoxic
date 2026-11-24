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

La app usa la API de Google Gemini. La clave se lee de `VITE_GEMINI_API_KEY` (ver `.env.example`); si falta, las funciones de IA muestran un aviso claro y el resto de la app funciona igual. Las respuestas se cachean en IndexedDB para no gastar cuota.

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

IndexedDB es la fuente de verdad. Si Firebase está configurado, cada cambio del usuario se copia (best-effort) a Realtime Database en `progress/<userId>`; si no hay red o faltan credenciales, la app sigue funcionando igual y no se pierde nada localmente.

## Uso de IA (Gemini)

- **Writing**: `correctWriting(text, level)` — evalúa gramática, vocabulario, fluidez y contenido; puntaje y feedback.
- **Speaking**: `evaluateSpeaking(...)` y tutor conversacional `chatWithTutor(message, topic, level, history)`.
- **Límites**: 15 solicitudes por sesión (`LÍMITE_LOCAL` en `GEMINI_CONFIG`) y límite diario (`LÍMITE_GEMINI`), gestionados con los contadores de `dailyCounters`. Las respuestas se cachean para no gastar cuota.

## PWA

La app es instalable y funciona offline (manifest + service worker vía `vite-plugin-pwa`). Después de cambios de build, ejecuta `npm run build` para regenerar los assets del service worker. Las páginas con temporizador/actividad usan `useActivityGuard` para avisar antes de actualizar.

## Tests

`npm test` ejecuta Vitest. Los tests validan datos (`src/data/diagnosticData.test.js`, `grammarData.test.js`, `unitsData.test.js`) y componentes (`src/pages/Dashboard.test.jsx`). Verifican que cada unidad tenga `icon`/`color`, skills válidas y `correctAnswer` en opciones.

## QA automatizado (Brave)

`npm run qa` recorre la app completa en un navegador real (Brave por CDP) y genera capturas + reporte:

```bash
# 1. Brave con depuración remota (una sola pestaña)
brave --remote-debugging-port=9222

# 2. Dev server o build de producción
npm run dev
npm run qa                 # contra http://127.0.0.1:5173

npm run build && npm run preview
npm run qa:prod            # contra http://localhost:4173 (incluye pruebas offline/PWA)

# 3. OCR de las capturas (detecta textos de error visibles)
npm run qa:ocr
```

Salidas en `/tmp/opencode/qa-full/`:

- `report.json` — pasos, checks, errores de consola, errores JS y requests fallidos.
- `*.png` — captura de cada pantalla y estado.
- `ocr-report.json` — hallazgos de OCR (pantallas con textos sospechosos o casi vacías).

El flujo cubre: onboarding (diagnóstico y desde cero), diagnóstico CEFR, lección, quiz aprobado/reprobado, práctica (mixta y filtrada), simulacro de 100 preguntas, listening con audio, vocabulario, gramática, reading, writing sin IA, speaking (3 modos), progreso, ajustes (tema persistente y reset), vista móvil 390×844 y modo offline en producción.

## Variables de entorno

Todas son opcionales. Copia `.env.example` a `.env` si quieres habilitar IA o Firebase:

- `VITE_GEMINI_API_KEY` — sin ella, Writing/Speaking muestran un aviso y el resto funciona.
- `VITE_FIREBASE_*` — proyecto, API key, auth domain, database URL y app id. Sin ellas la app funciona 100 % local (IndexedDB) y no intenta conectar.
- `VITE_FORMSPREE_ENDPOINT` / `VITE_REPORT_EMAIL` — destino del botón "Reportar error".

