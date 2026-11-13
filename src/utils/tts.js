let warnedNoVoice = false;

export function getBestEnglishVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const priority = ["Google US English","Google UK English Female","Google UK English Male","Microsoft Aria","Microsoft Jenny","Microsoft Guy","Microsoft Zira","Samantha","Daniel","English"];
  for (const name of priority) {
    const m = voices.find((v) => v.name.toLowerCase().includes(name.toLowerCase()));
    if (m) return m;
  }
  const en = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
  if (en) return en;
  return voices[0] || null;
}

export function preloadVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try { window.speechSynthesis.getVoices(); } catch {}
}

export function hasVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  return window.speechSynthesis.getVoices().length > 0;
}

function _speakNow(text, { onEnd, onError, rate = 0.9, lang = "en-US" } = {}) {
  try { if (window.speechSynthesis.speaking) window.speechSynthesis.cancel(); } catch {}
  try { window.speechSynthesis.resume(); } catch {}
  const utter = new SpeechSynthesisUtterance(String(text).trim());
  const voice = getBestEnglishVoice();
  if (voice) { utter.voice = voice; utter.lang = voice.lang || lang; }
  else utter.lang = lang;
  utter.rate = rate; utter.volume = 1; utter.pitch = 1;
  if (onEnd) utter.onend = onEnd;
  utter.onerror = (e) => {
    const err = e?.error || "";
    // cancel / interrupted son normales al navegar o pulsar Detener — no es fallback robot
    if (err === "canceled" || err === "interrupted" || err === "cancelled") return;
    console.warn("[tts] error:", err, "text:", String(text).slice(0,30));
    onError && onError(e);
  };
  try { window.speechSynthesis.speak(utter); } catch (e) { onError && onError(e); }
  return utter;
}

export function speak(text, { onEnd, onError, rate = 0.9, lang = "en-US" } = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onError && onError(new Error("no-tts"));
    return null;
  }
  const clean = String(text || "").trim();
  if (!clean) { onError && onError(new Error("empty text")); return null; }
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) return _speakNow(clean, { onEnd, onError, rate, lang });
  let done = false;
  let timer = null;
  const trySpeak = () => {
    if (done) return;
    done = true;
    if (timer) clearTimeout(timer);
    try { window.speechSynthesis.removeEventListener("voiceschanged", trySpeak); } catch {}
    const v2 = window.speechSynthesis.getVoices();
    if (!v2.length) {
      if (!warnedNoVoice) { warnedNoVoice = true; console.warn("[tts] sin voces — usa Chrome/Edge"); }
      onError && onError(new Error("no-voices"));
      return;
    }
    return _speakNow(clean, { onEnd, onError, rate, lang });
  };
  try { window.speechSynthesis.addEventListener("voiceschanged", trySpeak); } catch {}
  timer = setTimeout(trySpeak, 400);
  try { window.speechSynthesis.getVoices(); } catch {}
  return null;
}

export function stop() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try { window.speechSynthesis.cancel(); } catch {}
    try { window.speechSynthesis.pause(); window.speechSynthesis.cancel(); } catch {}
  }
  try {
    document.querySelectorAll("audio").forEach((a) => { try { a.pause(); a.currentTime = 0; a.src=""; } catch {} });
  } catch {}
}
