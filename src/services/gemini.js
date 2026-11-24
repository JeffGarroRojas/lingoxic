import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCachedAI, setCachedAI, getGeminiCount, setGeminiCount } from "./db.js";

// La app usa solo iconos: limpiamos cualquier emoji que devuelva el modelo.
const EMOJI_RE =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu;

function stripEmoji(text) {
  return String(text || "")
    .replace(EMOJI_RE, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const GEMINI_CONFIG = {
  MODEL: "gemini-flash-lite-latest",
  MAX_REQUESTS_PER_SESSION: 20,
};

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_CONFIGURED = Boolean(API_KEY);

const genAI = GEMINI_CONFIGURED ? new GoogleGenerativeAI(API_KEY) : null;
let sessionCount = 0;

export const AI_ERRORS = {
  SIN_CONFIG:
    "La IA no está configurada todavía (falta VITE_GEMINI_API_KEY). Puedes seguir practicando con los ejercicios locales.",
  LÍMITE_LOCAL:
    "Límite de solicitudes de esta sesión alcanzado. Vuelve a cargar la página o practica con los ejercicios locales.",
  LÍMITE_GEMINI:
    "Límite diario de Gemini alcanzado. Vuelve mañana o usa los ejercicios locales.",
  ERROR_RED:
    "Error al conectar con Gemini. Verifica tu conexión e intenta de nuevo.",
  IA_OCUPADA:
    "El servicio de IA está ocupado en este momento. Intenta de nuevo en unos segundos.",
};

const ERROR_MESSAGES = AI_ERRORS;

async function callGemini(prompt) {
  const cached = await getCachedAI(prompt);
  if (cached) return cached;

  if (!GEMINI_CONFIGURED) return "SIN_CONFIG";

  const count = await getGeminiCount();
  if (count >= GEMINI_CONFIG.MAX_REQUESTS_PER_SESSION) return "LÍMITE_LOCAL";

  const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.MODEL });
  sessionCount = count + 1;
  await setGeminiCount(sessionCount);

  const statusOf = (error) => {
    if (error?.status) return error.status;
    const match = String(error?.message || "").match(/\b(\d{3})\b/);
    return match ? Number(match[1]) : 0;
  };

  try {
    let result;
    // Reintenta una vez si el servicio está saturado (5xx) o hay hipo de red.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        result = await model.generateContent(prompt);
        break;
      } catch (error) {
        const status = statusOf(error);
        if (status === 429) throw error;
        if (attempt === 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
    }
    const text = stripEmoji(result.response.text());
    await setCachedAI(prompt, text);
    return text;
  } catch (e) {
    sessionCount = Math.max(0, sessionCount - 1);
    await setGeminiCount(sessionCount);
    const status = statusOf(e);
    if (status === 429) return "LÍMITE_GEMINI";
    if (status >= 500) return "IA_OCUPADA";
    return "ERROR_RED";
  }
}

export async function getRemainingRequests() {
  const daily = await getGeminiCount();
  return Math.max(0, GEMINI_CONFIG.MAX_REQUESTS_PER_SESSION - daily);
}

export function computeResetLabel(now = new Date()) {
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);
  return nextMidnight.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export async function getAILimitInfo() {
  const daily = await getGeminiCount();
  const remaining = Math.max(0, GEMINI_CONFIG.MAX_REQUESTS_PER_SESSION - daily);
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);
  return {
    remaining,
    resetsInMs: nextMidnight.getTime() - now.getTime(),
    resetLabel: computeResetLabel(),
    resetISO: nextMidnight.toISOString(),
  };
}

export async function correctWriting(text, level) {
 const result = await callGemini(
 `Eres un evaluador oficial CEFR (niveles A1-A2-B1-B2). Un estudiante en Costa Rica te presenta un texto escrito. Tu objetivo es determinar si su escritura demuestra dominio REAL del nivel ${level} del Marco Común Europeo.

Corrige el siguiente texto en inglés. Señala los errores y da sugerencias de mejora. Responde EN ESPAÑOL. No uses emojis ni símbolos decorativos.

Texto del estudiante:
"${text}"

Criterios CEFR ${level} que debes verificar:
- Rango y control gramatical (variedad de estructuras y tiempos)
- Riqueza de vocabulario (colocaciones, precisión léxica)
- Coherencia y cohesión (conectores, organización en párrafos)
- Precisión: errores que impiden la comprensión

Formato de respuesta (máximo 250 palabras):
Correcciones:
- [error] → [corrección] : [explicación breve]

Consejos:
- [2-3 consejos para mejorar]

Evaluación CEFR:
Nivel demostrado: [A1|A2|B1|B2]
¿Cumple el nivel ${level}? [SÍ/NO]
Puntuación estimada: [X/10]`
 );
  return ERROR_MESSAGES[result] || result;
}

export async function evaluateSpeaking(text, topic, level) {
 const result = await callGemini(
 `Eres un evaluador oficial CEFR (niveles A1-A2-B1-B2). Un estudiante en Costa Rica responde oralmente a una tarea. Tu objetivo es determinar si su respuesta demuestra dominio REAL del nivel ${level} del Marco Común Europeo.
Tema: ${topic}

Respuesta del estudiante: "${text}"

Criterios CEFR ${level} que debes verificar:
1) Alcance y precisión gramatical
2) Control y amplitud de vocabulario
3) Fluidez y pronunciación
4) Interacción, coherencia y adecuación al tema

Responde EN ESPAÑOL, máximo 180 palabras. No uses emojis.
- Puntuación /10
- Nivel demostrado: [A1|A2|B1|B2]
- ¿Cumple el nivel ${level}? [SÍ/NO]
- 2-3 consejos específicos para alcanzar el nivel ${level}`
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
- No saludes ni escribas mensajes introductorios: el estudiante inicia la conversación.
- Responde al último mensaje del estudiante y haz una pregunta de seguimiento.
- En el cuarto intercambio, cierra con un breve feedback.

${
  count === 1
    ? `Responde al primer mensaje del estudiante sobre el tema; no lo saludes.`
    : `Continúa la conversación respondiendo al último mensaje del estudiante.`
}`
  );
  return ERROR_MESSAGES[result] || result;
}
