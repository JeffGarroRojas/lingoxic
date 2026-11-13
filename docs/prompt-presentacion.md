# Prompt para generar la presentación Lingoxic × ABA

> Copia y pega este prompt tal cual en **Gamma → Create → Website / Web page** (NO en Presentation). Es una landing web animada one-page, coordinada con `guion-reunion.html` (lo que dices) y `cotiABA.html` (lo que dejas impreso). Si Gamma solo te deja hacer Deck, usa el mismo prompt pero elige "Presentation 16:9".

---

## Prompt para pegar en Gamma (Web)

```
Crea una página web one-page scroll para Lingoxic × ABA, estilo landing corporativa tech. Paleta azul #0ea5e9 → #2563eb, blanco #f8fafc, gris oscuro #0f172a, gris medio #64748b. Tipografía Inter/Helvetica. Usa iconos lucide (sparkles, layers, book-open, user-check, cpu, credit-card, calendar, shield-alert) en cada sección, NO emojis. Cada sección con topbar azul de 6px arriba y animación fadeUp + scroll-reveal al entrar, progress bar superior al hacer scroll. Footer en cada sección: "Lingoxic · lingoxic.web.app · Confidencial · 27 ago 2026 · Vigencia 15 días".

Secciones en orden (mismo contenido que docs/cotiABA.html y docs/guion-reunion.html ya coordinados):

1. Hero: Lingoxic para ABA — App web de inglés alineada al currículo MEP · Piloto máx. 50 usuarios | Cuerpo: PWA instalable · A1–B2 · Datos en el navegador · Sin servidores que ABA mantenga | Objetivo: validar con estudiantes reales y acordar siguientes pasos | Meta: Presentado por Jefferson Garro Rojas (fundador Lingoxic) con Roberto Garro (comercial) y Esteban Cordero (técnico)

2. Qué es Lingoxic: PWA en lingoxic.web.app que se instala con un toque, niveles A1 a B2 (Principiante a Intermedio Alto) | Sin backend: datos viven en el celular (IndexedDB Dexie) — rápida, privada, barata | Onboarding 3 pasos: nombre + test corto 32Q → define nivel inicial | Público: secundaria costarricense | Propuesta: contenido MEP + práctica ilimitada con IA + seguimiento sin servidores

3. Con qué está hecha — y por qué le conviene a ABA: Tabla 3 columnas: Capa | Tecnología | Qué aporta — React 18 + Vite | Carga instantánea — Tailwind | Diseño pro + modo oscuro — IndexedDB vía Dexie (local) | Sin costo de BD, offline — Modelos de IA | Corrige y genera contenido — vite-plugin-pwa | Instalable, autoUpdate | Texto debajo: Firebase Hosting lingoxic.web.app — sin servidores que ABA mantenga. Todo el progreso queda en el celular con caché local para no re-pagar IA.

4. Qué enseña — 7 unidades MEP: Chips: A1 Mi Perfil | A2 Compras Tecnológicas | A2 Estilos de Vida Saludables | A2 Viajes Seguros | B1 Variedad Cultural | B1 Mercado Laboral | B2 Global Competence | KPIs en pills: 49 vocab + fonética | 51 gramática | 11 listening TTS | 18 speaking · 45 práctica · 32 diagnóstico | Inventario: ~117 bloques de lección — todo listo | 2 imágenes lado a lado: docs/screenshots/learn.png (unidades) y docs/screenshots/lesson.png (lección To Be) — borde redondeado 8px + sombra | Ejemplos en callouts: "I am a student at Liceo de Costa Rica." / "She is very friendly and intelligent." — Tip: "No confundas it’s con its." | Listening TTS: "Good afternoon, sir. I bought this laptop but it does not turn on." / "Hello, doctor. I have a headache..."

5. Qué hace el estudiante — flujo en 1 min: Flujo horizontal: Panel (saludo/racha/nivel) → Unidades (7, se desbloquea la siguiente) → Lección (lee, escucha, marca completar) → Habilidades (Listening TTS, Reading, Writing, Speaking tutor) → Repaso (Vocabulario filtrable, Gramática verde/rojo, Práctica 10Q) → Evaluación (Quiz con % mínimo, Simulacro 100Q 60min, Test A1–B2) → Progreso (gráfico) | 3 imágenes en fila: docs/screenshots/dashboard.png, docs/screenshots/vocabulary.png, docs/screenshots/listening.png | Callout: Ej. Writing con IA: elige tema, escribe y recibe corrección en español. Sidebar móvil como overlay — se entiende en 2 minutos. Audio se detiene al navegar.

6. IA y offline — sin sorpresas: 2 columnas: Izq: "IA gasta tokens según para qué se use y es costo directo de ABA — texto, imágenes y video no gastan lo mismo." | Controles: límite por sesión (20) + caché local + contador visible en Ajustes | Der: Offline-first: lecciones/vocab/gramática/quizzes sin internet — solo Writing/Speaking con IA necesitan conexión | PWA autoUpdate con guard si hay actividad (ExamSim/Quiz) · TTS nativo con fallback | Nota: Estabilidad — cada unidad con icon/color y test que bloquea deploy si falta

7. Modelo comercial — Retainer + Tarifa: Título: Retainer @ ₡3.500/h — Jornada 4 h/día | Tabla retainer: 10h/40h ₡140.000 | 12.5h/50h ₡175.000 | 15h/60h ₡210.000 | 17h/68h ₡238.000 | 20h/80h ₡280.000 | Nota: Piloto arranca ~10h/sem (₡140k/mes) — Incluye fases 1-2, revisión de contenido y soporte (caídas mismo día) · Montos en CRC, sin consumo IA | Debajo: Tarifa piloto ₡2.500/u/mes · Post-piloto ₡4.000/u/mes · Máx. 50 · Fórmula: piloto usuarios×meses×2.500 · post usuarios×meses×4.000 | Tabla tarifa: PILOTO (máx.) 50 | 2 meses ₡250.000 | 3 meses ₡375.000 | Duración: Según lo que requiera el ABA y podamos implementar

8. Cronograma estimado — según lo que requiera el ABA y podamos implementar: Párrafo: No hay plazo cerrado: se acuerda directamente con ABA según alcance y material que brinde (logo, libro de marca, temario, videos). | Lista: Preparación (recolección material por unidad) | Marca ABA (nombre/logo) | Usuarios, analytics y calibración (invitaciones, tablero, test) | Contenido por unidades (según complejidad) | Piloto con usuarios reales — duración según lo que requiera ABA y podamos implementar | Nota: Interfaz mejorada en paralelo si entregan libro de marca. Cada fase valida y define el siguiente bloque.

9. Qué NO está incluido + Cierre: Izq: Qué NO: Migración a BD nube (login real, panel) → se define después del piloto · Mantenimiento post-retainer y dominio → al pasar a comercial · Nuevas funciones fuera del alcance → proyecto aparte | Der: Condiciones: Vigencia 15 días · Retainer por adelantado · Pagos a Jefferson Garro Rojas · Lingoxic propiedad del equipo (licencia de uso) · Marca de ABA sigue siendo de ABA · Datos confidenciales · Piloto no se renueva gratis · Cambios de alcance se cotizan aparte | CTA grande centrado: "¿Avanzamos con piloto de 50 usuarios? — Agendemos fecha de arranque y canal de seguimiento" | Contacto: garrorojasjeffersonlisandro@gmail.com · +506 8539 8594

Instrucciones visuales: 16:9 si es deck, o full-width si es web, sin solapes, tablas con header azul #0ea5e9 y texto blanco, filas alternas #f8fafc, números a la derecha, badges redondeados, boxes con borde izquierdo azul 4px, imágenes con borde #e2e8f0 y sombra suave, animación fadeUp 600ms por elemento, progress bar de 4px.
```

---

## Cómo usarlo en Gamma

1. Abre **Gamma → Create → Website** (elige **Website**, no Presentation). Si solo te deja Deck, pega el mismo prompt eligiendo **Presentation 16:9**
2. Pega el prompt de arriba tal cual
3. Si permite adjuntos, sube `docs/screenshots/` (7 PNG: dashboard, learn, lesson, vocabulary, listening, grammar, progress) y `docs/cotiABA.pdf` como referencia
4. Genera y publica — Gamma te da un link para proyectar en la reunión

> Ya tienes una versión web lista offline en `docs/presentacion-lingoxic-aba.html` (9 slides con animaciones, iconos lucide y capturas reales) y su `docs/presentacion-lingoxic-aba.pptx` / `.pdf` — este prompt es para generar la versión web animada en Gamma si prefieres exponer desde ahí.
