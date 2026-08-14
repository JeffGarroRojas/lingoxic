import { describe, it, expect } from "vitest";
import {
  isValidAccessCode,
  getAccessCodeType,
  isInternalCode,
  isAcademyCode,
  hasAcademyCodeExpired,
} from "./accessCode.js";

describe("isValidAccessCode", () => {
  it("acepta códigos correctos", () => {
    expect(isValidAccessCode("MEP2026")).toBe(true);
    expect(isValidAccessCode("ABA2026")).toBe(true);
  });

  it("es insensible a mayúsculas/minúsculas y espacios", () => {
    expect(isValidAccessCode("mep2026")).toBe(true);
    expect(isValidAccessCode("  ABA2026  ")).toBe(true);
  });

  it("rechaza códigos incorrectos", () => {
    expect(isValidAccessCode("1234")).toBe(false);
    expect(isValidAccessCode("")).toBe(false);
    expect(isValidAccessCode(null)).toBe(false);
  });
});

describe("getAccessCodeType", () => {
  it("distingue código interno de academia", () => {
    expect(getAccessCodeType("MEP2026")).toBe("internal");
    expect(getAccessCodeType("ABA2026")).toBe("academy");
    expect(getAccessCodeType("xyz")).toBe(null);
  });
});

describe("isInternalCode / isAcademyCode", () => {
  it("identifica cada tipo", () => {
    expect(isInternalCode("MEP2026")).toBe(true);
    expect(isAcademyCode("ABA2026")).toBe(true);
    expect(isInternalCode("ABA2026")).toBe(false);
    expect(isAcademyCode("MEP2026")).toBe(false);
  });
});

describe("hasAcademyCodeExpired", () => {
  it("no expira si nunca se usó", () => {
    expect(hasAcademyCodeExpired(null)).toBe(false);
    expect(hasAcademyCodeExpired(0)).toBe(false);
  });

  it("no expira dentro de 1 hora", () => {
    const now = Date.now();
    expect(hasAcademyCodeExpired(now - 1000, now)).toBe(false);
    expect(hasAcademyCodeExpired(now - 59 * 60 * 1000, now)).toBe(false);
  });

  it("expira después de 1 hora", () => {
    const now = Date.now();
    expect(hasAcademyCodeExpired(now - 61 * 60 * 1000, now)).toBe(true);
    expect(hasAcademyCodeExpired(now - 3 * 60 * 60 * 1000, now)).toBe(true);
  });
});
