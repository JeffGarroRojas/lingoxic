export function levelFromXp(xp, currentLevel = "A1", diagnostic) {
  // B2 exige diagnóstico B2 + XP: el XP solo nunca desbloquea B2.
  if (diagnostic?.overallLevel === "B2" && xp >= 2500) return "B2";
  if (xp >= 2500) return "B1";
  if (xp >= 1000) return "A2";
  return "A1";
}
