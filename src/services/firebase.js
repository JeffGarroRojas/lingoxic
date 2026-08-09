import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "aprendelingocix",
  apiKey: "REDACTED_API_KEY",
  authDomain: "aprendelingocix.web.app",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function syncUserToFirestore(user) {
  // Sincronización desactivada: el progreso es 100% local (IndexedDB)
  // hasta implementar la base de datos central (PostgreSQL).
  void user;
  return;
}
