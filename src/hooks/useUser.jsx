import { createContext, useContext, useState, useCallback } from "react";
import { getUser, saveUser, updateUser, clearExamResults } from "../services/db.js";
import { syncUserToFirestore } from "../services/firebase.js";
import {
  SKILLS as SKILL_ORDER, DIAGNOSTIC_QUESTIONS,
  scoreToLevel, levelRank,
} from "../data/diagnosticData.js";
import { levelFromXp } from "../utils/levelProgress.js";
import { genId } from "../utils/level.js";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const loadUser = useCallback(async () => {
    let u = await getUser();
    setUser(u);
    setInitialized(true);
  }, []);

  const createUser = useCallback(async (name, level, avatar, accessCode = "") => {
    const newUser = {
      id: genId(),
      name,
      level,
      xp: 0,
      streak: 0,
      lastActive: Date.now(),
      avatar,
      accessCode,
      createdAt: Date.now(),
      completedLessons: [],
      completedQuizzes: [],
      weakAreas: [],
      examSimulations: [],
      diagnostic: null,
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
    // Si hay diagnóstico, el nivel lo manda el diagnóstico (evita que un
    // addXP pequeño degrade el nivel recién evaluado).
    const level = current.diagnostic
      ? current.level
      : levelFromXp(xp, current.level, current.diagnostic);
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
    const elapsed = now - (current.lastActive || 0);
    let streak = current.streak || 0;
    if (streak === 0) {
      streak = 1;
    } else {
      if (elapsed < day) return;
      streak = elapsed < day * 2 ? streak + 1 : 1;
    }
    await updateUser({ streak, lastActive: now });
    const merged = { ...current, streak, lastActive: now };
    await syncUserToFirestore(merged);
    setUser(merged);
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
      weakAreas: [],
      diagnostic: null,
    };
    await saveUser(reset);
    try {
      await clearExamResults();
    } catch {}
    await syncUserToFirestore(reset);
    setUser(reset);
  }, [user]);

  const saveDiagnostic = useCallback(
    async (answers) => {
      let current = user;
      if (!current) return;
      const bySkill = {};
      SKILL_ORDER.forEach((sk) => {
        const qs = DIAGNOSTIC_QUESTIONS[sk];
        let correct = 0;
        qs.forEach((q) => { if (answers[q.prompt] === q.correctAnswer) correct++; });
        bySkill[sk] = { level: scoreToLevel(correct, qs.length), correct, total: qs.length };
      });
      const overallLevel = ["A1", "A2", "B1", "B2"][
        Math.round(SKILL_ORDER.reduce((a, sk) => a + levelRank(bySkill[sk].level), 0) / SKILL_ORDER.length)
      ];
      const overallRank = levelRank(overallLevel);
      const weakAreas = SKILL_ORDER.filter(
        (sk) => levelRank(bySkill[sk].level) < overallRank
      );
      const diagnostic = { bySkill, overallLevel, date: Date.now() };
      const merged = {
        ...current,
        diagnostic,
        weakAreas: weakAreas.length ? weakAreas : current.weakAreas,
        level: overallLevel,
      };
      await saveUser(merged);
      await syncUserToFirestore(merged);
      setUser(merged);
    },
    [user]
  );

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
        saveDiagnostic,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
