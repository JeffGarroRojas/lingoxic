export function levelFromXp(xp, currentLevel, diagnostic) {
  const diagReady = diagnostic && diagnostic.overallLevel === "B2";
  if (diagReady && (xp >= 5000 || currentLevel === "B2" || (xp >= 2500 && currentLevel === "B1"))) return "B2";
  if (xp >= 2500 || (xp >= 1000 && currentLevel === "A2")) return "B1";
  if (xp >= 1000) return "A2";
  return "A1";
}
