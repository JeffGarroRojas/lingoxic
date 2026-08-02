import { describe, it, expect } from "vitest";
import grammarData from "../data/grammarData.js";
import vocabularyData from "../data/vocabularyData.js";

describe("grammarData", () => {
  it("tiene temas con id, title, level, description, explanation y ejercicios", () => {
    for (const topic of grammarData) {
      expect(topic.id, `tema ${topic.id}`).toBeTruthy();
      expect(topic.title).toBeTruthy();
      expect(["A1", "A2", "B1", "B2"]).toContain(topic.level);
      expect(topic.exercises.length).toBeGreaterThan(0);
    }
  });

  it("los ejercicios son MC válidos", () => {
    for (const topic of grammarData) {
      for (const ex of topic.exercises) {
        expect(ex.correctAnswer).toBeTruthy();
        expect(ex.options.length).toBeGreaterThanOrEqual(2);
        expect(ex.options).toContain(ex.correctAnswer);
      }
    }
  });

  it("los ids de ejercicio son únicos", () => {
    const ids = grammarData.flatMap((t) => t.exercises.map((e) => e.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("existe contenido B2 (passive voice y reported speech)", () => {
    const topics = grammarData.map((t) => t.id);
    expect(topics).toContain("passive-voice");
    expect(topics).toContain("reported-speech");
  });
});

describe("vocabularyData", () => {
  it("tiene bancos con id, unitId, title, level y words", () => {
    for (const bank of vocabularyData) {
      expect(bank.id).toBeTruthy();
      expect(bank.unitId).toBeTruthy();
      expect(bank.title).toBeTruthy();
      expect(["A1", "A2", "B1", "B2"]).toContain(bank.level);
      expect(bank.words.length).toBeGreaterThan(0);
    }
  });

  it("cada palabra tiene word, translation, definition, example", () => {
    for (const bank of vocabularyData) {
      for (const w of bank.words) {
        expect(w.word, `palabra ${w.word}`).toBeTruthy();
        expect(w.translation).toBeTruthy();
        expect(w.definition).toBeTruthy();
        expect(w.example).toBeTruthy();
      }
    }
  });

  it("existe el banco B2 global-competence", () => {
    expect(vocabularyData.map((b) => b.id)).toContain("global-competence-vocab");
  });
});
