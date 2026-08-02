import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCachedAI, setCachedAI, getGeminiCount, setGeminiCount } from "./db.js";

const GEMINI_CONFIG = {
  MODEL: "gemini-2.0-flash",
  MAX_REQUESTS_PER_SESSION: 15,
};

const API_KEY = "REDACTED_API_KEY";

const genAI = new GoogleGenerativeAI(API_KEY);
let sessionCount = 0;

const ERROR_MESSAGES = {
  LÍMITE_LOCAL:
    "Límite de solicitudes de esta sesión alcanzado. Vuelve a cargar la página o practica con los ejercicios locales.",
  LÍMITE_GEMINI:
    "Límite diario de Gemini alcanzado. Vuelve mañana o usa los ejercicios locales. 🔄",
  ERROR_RED:
    "Error al conectar con Gemini. Verifica tu conexión e intenta de nuevo.",
};

async function callGemini(prompt) {
  const cached = await getCachedAI(prompt);
  if (cached) return cached;

  const count = await getGeminiCount();
  if (count >= GEMINI_CONFIG.MAX_REQUESTS_PER_SESSION) return "LÍMITE_LOCAL";

  const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.MODEL });
  sessionCount = count + 1;
  await setGeminiCount(sessionCount);

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    await setCachedAI(prompt, text);
    return text;
  } catch (e) {
    sessionCount = Math.max(0, sessionCount - 1);
    await setGeminiCount(sessionCount);
    return e?.message?.includes("429") || e?.status === 429
      ? "LÍMITE_GEMINI"
      : "ERROR_RED";
  }
}

export async function getRemainingRequests() {
  const daily = await getGeminiCount();
  return Math.max(0, GEMINI_CONFIG.MAX_REQUESTS_PER_SESSION - daily);
}

export async function correctWriting(text, level) {
  const result = await callGemini(
    `Eres un tutor de inglés para un estudiante de nivel ${level} en Costa Rica preparándose para el examen MEP.

Corrige el siguiente texto en inglés. Señala los errores y da sugerencias de mejora. Responde EN ESPAÑOL.

Texto del estudiante:
"${text}"

Formato de respuesta (máximo 200 palabras):
✅ Correcciones:
- [error] → [corrección] : [explicación breve]

💡 Consejos:
- [2-3 consejos para mejorar]

Puntuación estimada: [X/10]`
  );
  return ERROR_MESSAGES[result] || result;
}

export async function evaluateSpeaking(text, topic, level) {
  const result = await callGemini(
    `Evalúa la siguiente respuesta oral en INGLÉS de un estudiante nivel ${level}.
Tema: ${topic}

Respuesta del estudiante: "${text}"

Evalúa: 1) Gramática 2) Vocabulario 3) Fluidez 4) Contenido
Da una puntuación /10 y 2-3 consejos en español. Máximo 150 palabras.`
  );
  return ERROR_MESSAGES[result] || result;
}

export async function chatWithTutor(message, topic, level, history, count) {
  const result = await callGemini(
    `Eres un tutor de inglés conversacional para un estudiante nivel ${level} en Costa Rica.

Tema de conversación: ${topic}
Paso actual: ${count}

Historial de la conversación:
${history
  .map((e) => `${e.role === "user" ? "Estudiante" : "Tutor"}: ${e.content}`)
  .join("\n")}

Instrucciones:
- Eres un hablante nativo de inglés. Guías al estudiante en una conversación natural.
- Habla solo en INGLÉS.
- Mantén tus respuestas cortas (1-3 oraciones).
- Si el estudiante comete un error, responde normalmente pero da una corrección sutil al final entre paréntesis.
- Paso 1: Saluda y pregunta una pregunta simple sobre el tema.
- Paso 2-4: Haz preguntas de seguimiento basadas en lo que el estudiante dijo.
- Paso 5: Termina la conversación educadamente y da un breve feedback.

${
  count === 1
    ? `Empieza la conversación con un saludo amigable y una pregunta sobre el tema.`
    : `Responde al mensaje del estudiante de forma natural.`
}`
  );
  return ERROR_MESSAGES[result] || result;
}
