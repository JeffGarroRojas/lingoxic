import { describe, it, expect } from "vitest";
import { levelFromXp } from "./levelProgress.js";

const B2_DIAG = { overallLevel: "B2", date: Date.now() };
const B1_DIAG = { overallLevel: "B1", date: Date.now() };

describe("levelFromXp (gatekeeping)", () => {
  it("B2 requiere diagnóstico B2 + XP", () => {
    expect(levelFromXp(6000, "B1", null)).not.toBe("B2");
    expect(levelFromXp(6000, "B1", B1_DIAG)).not.toBe("B2");
    expect(levelFromXp(6000, "B1", B2_DIAG)).toBe("B2");
    expect(levelFromXp(2500, "B1", B2_DIAG)).toBe("B2");
  });

  it("sin diagnóstico, el máximo alcanzable es B1", () => {
    expect(levelFromXp(100000, "B1", null)).toBe("B1");
    expect(levelFromXp(100000, "B2", null)).toBe("B1");
  });

  it("progresa A1→A2→B1 con XP", () => {
    expect(levelFromXp(500, "A1", null)).toBe("A1");
    expect(levelFromXp(1500, "A1", null)).toBe("A2");
    expect(levelFromXp(3000, "A2", null)).toBe("B1");
  });

  it("un usuario ya en B2 con diagnóstico mantiene B2", () => {
    expect(levelFromXp(2500, "B2", B2_DIAG)).toBe("B2");
  });
});
