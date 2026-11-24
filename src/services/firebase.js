import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, update, push } from "firebase/database";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

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
    // App Check opcional: protección anti-abuso para Firebase.
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    if (siteKey) {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
    }
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

export function getDeviceId() {
  try {
    let id = localStorage.getItem("lingoxic_device_id");
    if (!id) {
      id = "dev_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      localStorage.setItem("lingoxic_device_id", id);
    }
    return id;
  } catch {
    return "dev_unknown";
  }
}

// Registro de quién entra: perfil del usuario + bitácora append-only.
export async function registerEntry(user) {
  if (!rtdb || !user?.id) return { ok: false, reason: "disabled" };
  const now = Date.now();
  const deviceId = getDeviceId();
  const agent = typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 180) : "";
  try {
    await update(ref(rtdb, `users/${user.id}`), {
      name: user.name || "",
      level: user.level || "A1",
      createdAt: user.createdAt || now,
      lastSeen: now,
      deviceId,
      agent,
    });
    await push(ref(rtdb, "entries"), {
      userId: user.id,
      name: user.name || "",
      level: user.level || "A1",
      at: now,
      deviceId,
      agent,
    });
    return { ok: true };
  } catch (e) {
    console.warn("[firebase] no se pudo registrar la entrada:", e?.message);
    return { ok: false, reason: "network" };
  }
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
