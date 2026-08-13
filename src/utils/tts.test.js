import { describe, it, expect, vi, afterEach } from "vitest";
import { getBestEnglishVoice } from "./tts.js";

function mockVoices(list) {
  global.window = { speechSynthesis: { getVoices: () => list } };
}

afterEach(() => {
  delete global.window;
});

describe("getBestEnglishVoice", () => {
  it("devuelve null si no hay speechSynthesis", () => {
    global.window = {};
    expect(getBestEnglishVoice()).toBe(null);
  });

  it("prioriza la voz de Google US English", () => {
    mockVoices([
      { name: "Microsoft Zira", lang: "en-US" },
      { name: "Google US English", lang: "en-US" },
      { name: "Samantha", lang: "en-US" },
    ]);
    const v = getBestEnglishVoice();
    expect(v.name).toBe("Google US English");
  });

  it("elige cualquier voz en inglés si no hay Google", () => {
    mockVoices([
      { name: "Microsoft Aria", lang: "en-US" },
      { name: "Spanish Spain", lang: "es-ES" },
    ]);
    const v = getBestEnglishVoice();
    expect(v.name).toBe("Microsoft Aria");
  });

  it("devuelve null si no hay voces", () => {
    mockVoices([]);
    expect(getBestEnglishVoice()).toBe(null);
  });
});
