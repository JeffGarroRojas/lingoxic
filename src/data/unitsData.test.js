import { describe, it, expect } from "vitest";
import unitsData from "../data/unitsData.js";

const UNITS = ["my-profile", "high-tech", "healthy-lifestyle", "safe-travels", "cultural-heritage", "future-careers", "global-competence"];

describe("unitsData", () => {
  it("tiene al menos 6 unidades y la nueva unidad B2", () => {
    expect(unitsData.length).toBeGreaterThanOrEqual(6);
    expect(unitsData.map((u) => u.id)).toContain("global-competence");
  });

  it("todas las unidades tienen id, title, description, level, order", () => {
    for (const u of unitsData) {
      expect(u.id, `unit ${u.id}`).toBeTruthy();
      expect(u.title, `unit ${u.id}`).toBeTruthy();
      expect(u.description, `unit ${u.id}`).toBeTruthy();
      expect(u.level, `unit ${u.id}`).toBeTruthy();
      expect(u.order, `unit ${u.id}`).toBeGreaterThan(0);
    }
  });

  it("todas las unidades tienen icon y color (usados por Dashboard/Learn)", () => {
    for (const u of unitsData) {
      expect(u.icon, `unit ${u.id} necesita icon`).toBeTruthy();
      expect(u.color, `unit ${u.id} necesita color`).toBeTruthy();
      expect(u.color, `unit ${u.id} color debe ser gradiente`).toMatch(/^from-/);
    }
  });

  it("los ids de unidad son únicos", () => {
    const ids = unitsData.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("cada unidad tiene lessons y quizzes", () => {
    for (const u of unitsData) {
      expect(u.lessons.length, `unit ${u.id} sin lessons`).toBeGreaterThan(0);
      expect(u.quizzes.length, `unit ${u.id} sin quizzes`).toBeGreaterThan(0);
    }
  });

  it("cada lección tiene id, unitId, title, type, order", () => {
    for (const u of unitsData) {
      for (const lesson of u.lessons) {
        expect(lesson.id, `lesson de ${u.id}`).toBeTruthy();
        expect(lesson.unitId, `lesson ${lesson.id}`).toBe(u.id);
        expect(lesson.title, `lesson ${lesson.id}`).toBeTruthy();
        expect(lesson.type, `lesson ${lesson.id}`).toBeTruthy();
        expect(lesson.order, `lesson ${lesson.id}`).toBeGreaterThan(0);
      }
    }
  });

  it("los ids de lección son únicos en toda la app", () => {
    const ids = unitsData.flatMap((u) => u.lessons.map((l) => l.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("cada quiz tiene questions con correctAnswer, options y skillArea válida", () => {
    const VALID_SKILLS = ["grammar", "vocabulary", "reading", "listening", "writing", "speaking"];
    for (const u of unitsData) {
      for (const quiz of u.quizzes) {
        expect(quiz.questions.length, `quiz ${quiz.id} sin preguntas`).toBeGreaterThan(0);
        for (const q of quiz.questions) {
          expect(q.id, `pregunta en quiz ${quiz.id}`).toBeTruthy();
          expect(q.correctAnswer, `pregunta ${q.id} sin correctAnswer`).toBeTruthy();
          expect(q.options.length, `pregunta ${q.id} sin opciones`).toBeGreaterThanOrEqual(2);
          expect(q.options, `pregunta ${q.id} opciones duplicadas`).toEqual(new Set(q.options) && [...new Set(q.options)]);
          expect(q.options, `pregunta ${q.id} correctAnswer fuera de opciones`).toContain(q.correctAnswer);
          expect(VALID_SKILLS, `pregunta ${q.id} skillArea inválida`).toContain(q.skillArea);
        }
      }
    }
  });
});
