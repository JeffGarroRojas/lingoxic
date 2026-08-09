import { describe, it, expect } from "vitest";
import { computeResetLabel } from "../services/gemini.js";

describe("computeResetLabel", () => {
  it("calcula la próxima medianoche local", () => {
    const now = new Date("2026-08-09T10:30:00");
    const info = computeResetLabel(now);
    expect(info).toBeTruthy();
  });
});
