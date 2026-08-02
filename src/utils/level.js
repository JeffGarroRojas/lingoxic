export const LEVEL_LABELS = {
  A1: "Principiante",
  A2: "Básico",
  B1: "Intermedio",
  B2: "Intermedio Alto",
};

export const LEVEL_COLORS = {
  A1: "bg-green-500",
  A2: "bg-blue-500",
  B1: "bg-yellow-500",
  B2: "bg-purple-500",
};

export const LEVEL_ORDER = { A1: 1, A2: 2, B1: 3, B2: 4 };

export function isLevelOrAbove(current, target) {
  return LEVEL_ORDER[current] >= LEVEL_ORDER[target];
}

export function nextLevelThreshold(level) {
  return { A1: 1000, A2: 1500, B1: 2500, B2: 999999 }[level];
}

export function streakEmoji(streak) {
  return streak >= 30 ? "🔥🔥🔥" : streak >= 7 ? "🔥🔥" : streak >= 3 ? "🔥" : "⭐";
}

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
