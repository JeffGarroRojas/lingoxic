import { describe, it, expect } from "vitest";
import {
  SKILLS, DIAGNOSTIC_QUESTIONS, CEFR_LEVELS,
  scoreToLevel, levelRank,
} from "../data/diagnosticData.js";

describe("diagnosticData", () => {
  it("cubre las 6 habilidades", () => {
    expect(SKILLS).toEqual(["grammar", "vocabulary", "reading", "listening", "writing", "speaking"]);
  });

  it("cada habilidad tiene preguntas para A1, A2, B1 y B2", () => {
    for (const skill of SKILLS) {
      const levels = DIAGNOSTIC_QUESTIONS[skill].map((q) => q.level);
      for (const lvl of CEFR_LEVELS) {
        expect(levels, `${skill} no tiene preguntas ${lvl}`).toContain(lvl);
      }
    }
  });

  it("las preguntas del diagnóstico son MC válidas", () => {
    for (const skill of SKILLS) {
      for (const q of DIAGNOSTIC_QUESTIONS[skill]) {
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.options).toContain(q.correctAnswer);
        expect(q.skillArea).toBe(skill);
      }
    }
  });

  it("los prompts del diagnóstico son únicos por habilidad (clave del estado)", () => {
    for (const skill of SKILLS) {
      const prompts = DIAGNOSTIC_QUESTIONS[skill].map((q) => q.prompt);
      expect(new Set(prompts).size, `${skill} prompts duplicados`).toBe(prompts.length);
    }
  });
});

describe("scoreToLevel", () => {
  it("mapea porcentajes a niveles CEFR", () => {
    expect(scoreToLevel(0, 4)).toBe("A1");
    expect(scoreToLevel(2, 4)).toBe("A2");
    expect(scoreToLevel(3, 4)).toBe("B1");
    expect(scoreToLevel(4, 4)).toBe("B2");
  });

  it("maneja total 0 sin romperse", () => {
    expect(scoreToLevel(0, 0)).toBe("A1");
  });
});

describe("levelRank", () => {
  it("ordena niveles correctamente", () => {
    expect(levelRank("A1")).toBe(0);
    expect(levelRank("B2")).toBe(3);
  });
});
