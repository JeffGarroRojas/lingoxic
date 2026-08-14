# Guion de presentación - Lingoxic

**Autor:** Jeff Garro Rojas
**Reunión:** American Business Academy (ABA)
**Uso:** guía cronológica para presentar la app

---

## 1. Apertura (30 segundos)

> "LinGoXiC es una aplicación web de aprendizaje de inglés para estudiantes de
> secundaria, alineada al currículo del MEP. Funciona sin instalación, sin
> descargas y sin perder el progreso: se abre en cualquier navegador y se puede
> instalar en el teléfono como una app normal."

**Qué no decir:** "es como Duolingo" (es más: está alineada al examen MEP).

---

## 2. Stack tecnológico (1 minuto)

- **Frontend:** React + Vite (rápido, moderno).
- **Estilos:** Tailwind CSS con modo claro/oscuro.
- **IA:** Google Gemini (tutor, corrección, evaluación) con caché local para no
  gastar de más.
- **Almacenamiento:** IndexedDB en el navegador (progreso sin servidor) +
  Firebase Realtime Database para el control de acceso de usuarios.
- **PWA:** instalable, funciona sin internet (lecciones, quizzes y simulacro
  funcionan offline).
- **Hosting:** Firebase Hosting (CDN global, gratis en el volumen actual).

**Frase clave:** "No necesitan pagar servidores potentes: la app usa el
navegador del estudiante como base de datos local."

---

## 3. Demo guiada (módulo a módulo)

### 3.1 Primer acceso
- Pantalla de bienvenida con el nombre de la app.
- Se pide **nombre + código de acceso** (ABA recibe su propio código).
- Test de diagnóstico de 45 preguntas → ubica el nivel A1-B2 automáticamente.
- Opción de saltar el test y empezar en A1.

### 3.2 Dashboard (inicio)
- Saludo con el nombre del estudiante.
- Streak (racha de días), XP y nivel actual.
- Acceso directo a cada sección (aprender, escuchar, leer, escribir, hablar,
  vocabulario, gramática, práctica, simulacro).

### 3.3 Aprender (unidades temáticas MEP)
- 6 unidades alineadas al programa MEP (Mi Perfil, Compras Tecnológicas,
  Estilos de Vida Saludables, Viajes Seguros, Variedad Cultural, Mercado
  Laboral).
- 31 lecciones con bloques: explicación → vocabulario → ejemplos → gramática →
  tip para el examen MEP.
- Navegación por slides con botón "Siguiente" (como Flexa).
- Las lecciones se desbloquean en orden; completar una lección da +50 XP.

### 3.4 Quizzes
- 14 quizzes por unidad, con % mínimo para aprobar.
- Temporizados, con retroalimentación inmediata (verde/rojo).
- Aprobar da XP y desbloquea la siguiente unidad.

### 3.5 Escucha (Listening)
- Audio con voz natural en inglés (Google US English) + preguntas de opción
  múltiple con verificación.

### 3.6 Lectura (Reading)
- Textos de comprensión con preguntas de opción múltiple y feedback.

### 3.7 Escritura (Writing)
- **IA:** el estudiante escribe y Gemini corrige gramática, vocabulario,
  fluidez y contenido, con puntaje /10 y sugerencias.

### 3.8 Conversación (Speaking)
- **IA:** dos modos:
  - Lección: preguntas de opción múltiple para practicar.
  - Tutor: chat real con la IA que conversa en inglés, corrige y pregunta.

### 3.9 Vocabulario
- 49 palabras con traducción, definición, ejemplo y audio.

### 3.10 Gramática
- 46 temas gramaticales con ejercicios de opción múltiple y feedback
  inmediato.

### 3.11 Práctica Rápida
- Pool mixto de 10 preguntas (quiz + gramática) filtrable por habilidad.

### 3.12 Simulacro
- **100 preguntas** tipo examen MEP con temporizador.
- Guarda el resultado y lo muestra en Progreso.

### 3.13 Progreso
- Gráfico de actividad, nivel, XP, streak y unidades completadas.

---

## 4. Qué se puede hacer hoy (ya funciona)

- Estudiar las 6 unidades MEP con lecciones y quizzes.
- Practicar las 4 habilidades (escuchar, leer, escribir, hablar).
- Usar la IA para corregir escritura, conversar y evaluar habla.
- Hacer el simulacro de 100 preguntas.
- Ver progreso, racha y XP.
- Usar la app sin internet (lecciones, quizzes, vocabulario).
- Controlar quién entra con código de acceso con caducidad (1 hora por
  activación).

---

## 5. Qué NO se puede hacer aún (fase 2)

- **Progreso en la nube sincronizado** entre dispositivos (hoy es local por
  navegador). Requiere migración a base de datos central (PostgreSQL/Supabase).
- **Panel de profesores** con reportes de avance por grupo.
- **Reportes PDF** por estudiante.
- **Marca y dominio propio** de ABA.
- **Desarrollo de funciones nuevas** a pedido (se cotizan aparte).

**Regla de oro:** no prometer nada de la fase 2 como si ya existiera. Decir
"está contemplado en la siguiente fase" y ofrecer la cotización.

---

## 6. Cierre y propuesta

- El piloto está listo: **50 usuarios por 2 meses a 25.000 CRC** (250
  CRC/estudiante/mes).
- Incluye: acceso completo, soporte y corrección de errores, y el código de
  acceso con caducidad para evitar que se comparta.
- Al terminar el piloto, se define el plan comercial real (tarifa por
  estudiante, mensual o anual) con los datos de uso reales.
- Mantenimiento y desarrollos extra se cotizan aparte.

**Frase de cierre:** "Quiero que lo prueben de verdad: si les sirve y a sus
estudiantes les funciona, armamos el plan comercial; si no, se acaba el piloto
y no pagan nada más."
