import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    (import.meta.env.VITE_FIREBASE_PROJECT_ID
      ? `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
      : undefined),
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// IndexedDB es la fuente de verdad. Firebase (RTDB) es la copia central
// best-effort: si falla o no hay red, la app sigue funcionando igual.
let app = null;
let rtdb = null;

if (firebaseConfig.projectId && firebaseConfig.apiKey && firebaseConfig.databaseURL) {
  try {
    app = initializeApp(firebaseConfig);
    rtdb = getDatabase(app);
  } catch (e) {
    console.warn("[firebase] configuración inválida, se desactiva", e?.message);
    app = null;
    rtdb = null;
  }
}

export const isFirebaseEnabled = Boolean(rtdb);

function toCloudPayload(user) {
  return {
    name: user.name,
    level: user.level,
    xp: user.xp,
    streak: user.streak,
    lastActive: user.lastActive || Date.now(),
    completedLessons: user.completedLessons || [],
    completedQuizzes: user.completedQuizzes || [],
    weakAreas: user.weakAreas || [],
    diagnostic: user.diagnostic || null,
    updatedAt: Date.now(),
  };
}

export async function syncUserToCloud(user) {
  if (!rtdb || !user?.id) return { ok: false, reason: "disabled" };
  try {
    await set(ref(rtdb, `progress/${user.id}`), toCloudPayload(user));
    return { ok: true };
  } catch (e) {
    // Sin red o sin permisos: la app continúa con IndexedDB.
    console.warn("[firebase] no se pudo sincronizar el progreso:", e?.message);
    return { ok: false, reason: "network" };
  }
}

// Nombre histórico usado por useUser (se mantiene por compatibilidad).
export const syncUserToFirestore = syncUserToCloud;

export { rtdb };
