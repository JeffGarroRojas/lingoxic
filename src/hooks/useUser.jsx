import { createContext, useContext, useState, useCallback } from "react";
import { getUser, saveUser, updateUser } from "../services/db.js";
import { syncUserToFirestore } from "../services/firebase.js";
import { genId } from "../utils/level.js";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const loadUser = useCallback(async () => {
    let u = await getUser();
    if (u && (!u.avatar || u.avatar === "default")) u = { ...u, avatar: "🦁" };
    setUser(u);
    setInitialized(true);
  }, []);

  const createUser = useCallback(async (name, level, avatar) => {
    const newUser = {
      id: genId(),
      name,
      level,
      xp: 0,
      streak: 0,
      lastActive: Date.now(),
      avatar,
      createdAt: Date.now(),
      completedLessons: [],
      completedQuizzes: [],
      weakAreas: [],
      examSimulations: [],
    };
    await saveUser(newUser);
    await syncUserToFirestore(newUser);
    setUser(newUser);
  }, []);

  const updateUserData = useCallback(async (partial) => {
    let current = user;
    if (!current) return;
    const merged = { ...current, ...partial };
    await updateUser(partial);
    await syncUserToFirestore(merged);
    setUser(merged);
  }, [user]);

  const addXP = useCallback(async (amount) => {
    let current = user;
    if (!current) return;
    const xp = current.xp + amount;
    let level = current.level;
    if (xp >= 5000 || (xp >= 2500 && current.level === "B1")) level = "B2";
    else if (xp >= 2500 || (xp >= 1000 && current.level === "A2")) level = "B1";
    else if (xp >= 1000) level = "A2";
    else level = "A1";
    const merged = { ...current, xp, level };
    await updateUser({ xp, level });
    await syncUserToFirestore(merged);
    setUser(merged);
  }, [user]);

  const completeLesson = useCallback(async (lessonId) => {
    let current = user;
    if (!current || current.completedLessons.includes(lessonId)) return;
    const completedLessons = [...current.completedLessons, lessonId];
    await updateUser({ completedLessons });
    const merged = { ...current, completedLessons };
    await syncUserToFirestore(merged);
    setUser(merged);
  }, [user]);

  const completeQuiz = useCallback(async (quizId) => {
    let current = user;
    if (!current || current.completedQuizzes.includes(quizId)) return;
    const completedQuizzes = [...current.completedQuizzes, quizId];
    await updateUser({ completedQuizzes });
    const merged = { ...current, completedQuizzes };
    await syncUserToFirestore(merged);
    setUser(merged);
  }, [user]);

  const updateStreak = useCallback(async () => {
    let current = user;
    if (!current) return;
    const now = Date.now();
    const day = 86400000;
    const elapsed = now - current.lastActive;
    let streak = current.streak;
    if (elapsed < day) return;
    streak = elapsed < day * 2 ? streak + 1 : 1;
    await updateUser({ streak, lastActive: now });
    setUser({ ...current, streak, lastActive: now });
  }, [user]);

  const resetProgress = useCallback(async () => {
    let current = user;
    if (!current) return;
    const reset = {
      ...current,
      xp: 0,
      level: "A1",
      streak: 0,
      completedLessons: [],
      completedQuizzes: [],
      examSimulations: [],
    };
    await saveUser(reset);
    await syncUserToFirestore(reset);
    setUser(reset);
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        initialized,
        loadUser,
        createUser,
        updateUser: updateUserData,
        addXP,
        completeLesson,
        completeQuiz,
        updateStreak,
        resetProgress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
