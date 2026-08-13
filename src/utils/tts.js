export function getBestEnglishVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const priority = [
    "Google US English",
    "Google UK English Female",
    "Google UK English Male",
    "Microsoft Aria",
    "Microsoft Jenny",
    "Microsoft Guy",
    "Microsoft Zira",
    "Samantha",
    "Daniel",
  ];

  for (const name of priority) {
    const match = voices.find((v) => v.name.includes(name));
    if (match) return match;
  }

  return voices.find((v) => v.lang.toLowerCase().startsWith("en")) || null;
}
