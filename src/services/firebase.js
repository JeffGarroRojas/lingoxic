import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function syncUserToFirestore(user) {
  // Sincronización desactivada: el progreso es 100% local (IndexedDB)
  // hasta implementar la base de datos central (PostgreSQL).
  void user;
  return;
}
