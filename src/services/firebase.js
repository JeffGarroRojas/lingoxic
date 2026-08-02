import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  projectId: "aprendelingocix",
  apiKey: "REDACTED_API_KEY",
  authDomain: "aprendelingocix.web.app",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function syncUserToFirestore(user) {
  try {
    await setDoc(
      doc(db, "users", user.id),
      {
        name: user.name,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        lastActive: user.lastActive,
        completedLessons: user.completedLessons,
        completedQuizzes: user.completedQuizzes,
        weakAreas: user.weakAreas,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  } catch (e) {
    console.warn("Firestore sync failed (offline?):", e);
  }
}

export { db };
