import { describe, it, expect } from "vitest";
import { isValidAccessCode } from "./accessCode.js";

describe("isValidAccessCode", () => {
  it("acepta el código correcto", () => {
    expect(isValidAccessCode("MEP2026")).toBe(true);
  });

  it("es insensible a mayúsculas/minúsculas y espacios", () => {
    expect(isValidAccessCode("mep2026")).toBe(true);
    expect(isValidAccessCode("  MEP2026  ")).toBe(true);
  });

  it("rechaza códigos incorrectos", () => {
    expect(isValidAccessCode("1234")).toBe(false);
    expect(isValidAccessCode("MEP2027")).toBe(false);
  });

  it("rechaza valores vacíos o no string", () => {
    expect(isValidAccessCode("")).toBe(false);
    expect(isValidAccessCode(null)).toBe(false);
    expect(isValidAccessCode(undefined)).toBe(false);
    expect(isValidAccessCode(123456)).toBe(false);
  });
});
